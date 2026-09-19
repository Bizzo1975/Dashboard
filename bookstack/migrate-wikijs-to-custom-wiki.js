require("dotenv").config();

const { Pool } = require("pg");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = parseInt(((args.find((a) => a.startsWith("--limit=")) || "").split("=")[1] || "0"), 10) || 0;
const REPORT_PATH =
  ((args.find((a) => a.startsWith("--report=")) || "").split("=")[1]) ||
  path.join(__dirname, "reports", "wikijs-custom-wiki-report.json");

const CUSTOM_WIKI_URL = process.env.CUSTOM_WIKI_URL || "http://custom-wiki:3011";
const CUSTOM_WIKI_API_TOKEN = process.env.CUSTOM_WIKI_API_TOKEN;

const db = new Pool({
  host: process.env.PGHOST || "wikijs-db",
  port: parseInt(process.env.PGPORT || "5432", 10),
  user: process.env.PGUSER || "wikijs",
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "wikijs",
});

const report = {
  timestamp: new Date().toISOString(),
  dryRun: DRY_RUN,
  limit: LIMIT || null,
  totals: {
    pagesRead: 0,
    hierarchyCalls: 0,
    pagesImported: 0,
    pagesSkipped: 0,
    errors: 0,
  },
  skipped: [],
  errors: [],
};

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "untitled";
}

function titleCase(input) {
  const text = String(input || "").replace(/[-_]+/g, " ").trim();
  if (!text) return "Untitled";
  return text
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapPathToHierarchy(rawPath) {
  const segments = String(rawPath || "")
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean);

  const pageSeg = segments.length ? segments[segments.length - 1] : "untitled-page";
  const shelfSeg = segments[0] || "general";
  const bookSeg = segments[1] || segments[0] || "general";
  const chapterSeg = segments.length > 2 ? segments.slice(2, segments.length - 1).join("-") : "";

  const shelfSlug = slugify(shelfSeg);
  const bookSlug = slugify(`${shelfSlug}-${bookSeg}`);
  const chapterSlug = chapterSeg ? slugify(chapterSeg) : undefined;
  const pageSlug = slugify(pageSeg);

  return {
    shelf: { slug: shelfSlug, title: titleCase(shelfSeg) },
    book: { slug: bookSlug, title: titleCase(bookSeg) },
    chapter: chapterSlug ? { slug: chapterSlug, title: titleCase(chapterSeg) } : null,
    pageSlug,
  };
}

async function cwPost(apiPath, payload) {
  if (DRY_RUN) {
    return { dryRun: true };
  }
  const res = await fetch(`${CUSTOM_WIKI_URL}${apiPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CUSTOM_WIKI_API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`${apiPath} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  if (!DRY_RUN && !CUSTOM_WIKI_API_TOKEN) {
    throw new Error("Missing CUSTOM_WIKI_API_TOKEN for live import.");
  }

  const client = await db.connect();
  let rows = [];
  try {
    const result = await client.query(
      `SELECT id, title, path, content, description
       FROM pages
       WHERE "isPublished" = true
       ORDER BY path`
    );
    rows = result.rows;
  } finally {
    client.release();
  }

  if (LIMIT > 0) {
    rows = rows.slice(0, LIMIT);
  }
  report.totals.pagesRead = rows.length;

  const hierarchySeen = new Set();
  for (const row of rows) {
    const hierarchy = mapPathToHierarchy(row.path);
    const hierarchyKey = `${hierarchy.shelf.slug}::${hierarchy.book.slug}::${hierarchy.chapter?.slug || ""}`;

    if (!hierarchySeen.has(hierarchyKey)) {
      await cwPost("/api/import/hierarchy", {
        shelf: { title: hierarchy.shelf.title, slug: hierarchy.shelf.slug },
        book: { title: hierarchy.book.title, slug: hierarchy.book.slug, description: "" },
        chapter: hierarchy.chapter
          ? { title: hierarchy.chapter.title, slug: hierarchy.chapter.slug, description: "" }
          : undefined,
      });
      hierarchySeen.add(hierarchyKey);
      report.totals.hierarchyCalls += 1;
    }

    const markdown = String(row.content || "").trim();
    if (!markdown) {
      report.skipped.push({ wikiId: row.id, path: row.path, reason: "empty Wiki.js content" });
      report.totals.pagesSkipped += 1;
      continue;
    }

    try {
      await cwPost("/api/import/pages", {
        bookSlug: hierarchy.book.slug,
        chapterSlug: hierarchy.chapter?.slug,
        title: String(row.title || "").trim() || titleCase(hierarchy.pageSlug),
        slug: hierarchy.pageSlug,
        markdown,
        summary: String(row.description || "").trim(),
      });
      report.totals.pagesImported += 1;
    } catch (error) {
      report.errors.push({
        wikiId: row.id,
        path: row.path,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      report.totals.errors += 1;
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(
    `Migration complete. Read=${report.totals.pagesRead}, Imported=${report.totals.pagesImported}, ` +
      `Skipped=${report.totals.pagesSkipped}, Errors=${report.totals.errors}`
  );
  console.log(`Report: ${REPORT_PATH}`);
  await db.end();
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  try {
    await db.end();
  } catch (_err) {
    // Ignore shutdown errors.
  }
  process.exit(1);
});
