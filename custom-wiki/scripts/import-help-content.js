/**
 * import-help-content.js
 *
 * Reads content/help/** (via manifest.json) and POSTs to wiki import APIs:
 *   POST /api/import/hierarchy
 *   POST /api/import/pages
 *
 * Env:
 *   WIKI_URL            default http://127.0.0.1:8080
 *   WIKI_IMPORT_TOKEN   bearer token (required unless --dry-run)
 *
 * Usage:
 *   node scripts/import-help-content.js
 *   node scripts/import-help-content.js --dry-run
 *   node scripts/import-help-content.js --app erpnext
 *   node scripts/import-help-content.js --review-status APPROVED
 */

const fs = require("fs");
const path = require("path");

try {
  require("dotenv").config();
} catch {
  // dotenv optional when env is already injected
}

const DRY_RUN = process.argv.includes("--dry-run");
const appFilterArg = process.argv.indexOf("--app");
const APP_FILTER = appFilterArg >= 0 ? process.argv[appFilterArg + 1] : null;
const reviewArg = process.argv.indexOf("--review-status");
const REVIEW_STATUS =
  reviewArg >= 0 ? process.argv[reviewArg + 1] : "DRAFT";

const WIKI_URL = (process.env.WIKI_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
const TOKEN = process.env.WIKI_IMPORT_TOKEN || "";

const ROOT = path.join(__dirname, "..");
const HELP_ROOT = path.join(ROOT, "content", "help");
const MANIFEST_PATH = path.join(HELP_ROOT, "manifest.json");

const SUBCATEGORY_META = {
  "getting-started": { title: "Getting Started", order: 1 },
  "how-to": { title: "How-to", order: 2 },
  admin: { title: "Admin", order: 3 },
  troubleshoot: { title: "Troubleshoot", order: 4 },
};

const APP_TITLES = {
  erpnext: "ERPNext",
  zammad: "Zammad / Support",
  vaultwarden: "Vaultwarden",
  n8n: "n8n",
  website: "Website",
  "site-admin": "Site Admin CMS",
  wiki: "Help Center",
  umami: "Umami",
  "tactical-rmm": "Tactical RMM",
  portainer: "Portainer",
  traefik: "Traefik",
  authelia: "Authelia SSO",
  lldap: "LLDAP",
  rustdesk: "RustDesk",
  portal: "Customer Portal",
  marketlist: "Marketlist",
  flooros: "FloorOS",
  argo: "ARGO",
  cleaner: "Cleaner",
  netops: "NetOps",
  chat: "Chat",
  "sovereign-hub": "Sovereign Hub",
  farmbot: "FarmBot",
  dashboard: "Apps Dashboard",
};

function titleFromH1(markdown) {
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function summaryFromGoal(markdown) {
  const m = markdown.match(/##\s*Goal\s*\n+([^\n#]+)/i);
  return m ? m[1].trim() : undefined;
}

async function apiPost(pathname, body) {
  const url = `${WIKI_URL}${pathname}`;
  if (DRY_RUN) {
    console.log(`[DRY-RUN] POST ${pathname}`, {
      bookSlug: body.bookSlug,
      chapterSlug: body.chapterSlug,
      slug: body.slug,
      title: body.title,
      shelf: body.shelf?.slug,
      book: body.book?.slug,
      chapter: body.chapter?.slug,
    });
    return { ok: true, dryRun: true };
  }

  if (!TOKEN) {
    throw new Error("WIKI_IMPORT_TOKEN is required (or use --dry-run)");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const msg = json.error || text || res.statusText;
    throw new Error(`${pathname} → ${res.status}: ${msg}`);
  }
  return json;
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing manifest at ${MANIFEST_PATH}. Run node scripts/_generate-help-articles.js first.`);
  }
  /** @type {{ app: string, subcategory: string, slug: string, title: string, path: string }[]} */
  let items = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (APP_FILTER) {
    items = items.filter((i) => i.app === APP_FILTER);
  }
  return items;
}

function groupByApp(items) {
  /** @type {Map<string, typeof items>} */
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.app)) map.set(item.app, []);
    map.get(item.app).push(item);
  }
  return map;
}

async function ensureHierarchy(app, subcategory) {
  const appTitle = APP_TITLES[app] || app;
  const subMeta = SUBCATEGORY_META[subcategory] || {
    title: subcategory,
    order: 99,
  };

  return apiPost("/api/import/hierarchy", {
    shelf: {
      title: "Help Center",
      slug: "help-center",
      description: "Product help for Kecktech apps (getting started, how-to, admin, troubleshoot).",
    },
    book: {
      title: appTitle,
      slug: app,
      description: `Help articles for ${appTitle}.`,
    },
    chapter: {
      title: subMeta.title,
      slug: subcategory,
      description: `${subMeta.title} guides for ${appTitle}.`,
    },
  });
}

async function importPage(item) {
  const abs = path.join(ROOT, item.path);
  if (!fs.existsSync(abs)) {
    throw new Error(`Article file missing: ${abs}`);
  }
  const markdown = fs.readFileSync(abs, "utf8");
  const title = item.title || titleFromH1(markdown) || item.slug;
  const summary = summaryFromGoal(markdown);

  return apiPost("/api/import/pages", {
    bookSlug: item.app,
    chapterSlug: item.subcategory,
    title,
    slug: item.slug,
    markdown,
    summary,
    category: item.app,
    subcategory: item.subcategory,
    reviewStatus: REVIEW_STATUS,
    tags: [
      { name: "app", value: item.app },
      { name: "subcategory", value: item.subcategory },
      { name: "source", value: "content/help" },
    ],
    kbId: `HELP-${item.app}-${item.subcategory}-${item.slug}`.slice(0, 64),
  });
}

async function main() {
  console.log(`Import help content → ${WIKI_URL}${DRY_RUN ? " (DRY RUN)" : ""}`);
  if (APP_FILTER) console.log(`Filter app: ${APP_FILTER}`);
  console.log(`reviewStatus: ${REVIEW_STATUS}`);

  const items = loadManifest();
  if (!items.length) {
    console.log("No articles matched.");
    return;
  }

  const byApp = groupByApp(items);
  let hierarchyCount = 0;
  let pageCount = 0;
  const errors = [];

  for (const [app, appItems] of byApp) {
    const subs = [...new Set(appItems.map((i) => i.subcategory))];
    subs.sort(
      (a, b) =>
        (SUBCATEGORY_META[a]?.order || 99) - (SUBCATEGORY_META[b]?.order || 99)
    );

    console.log(`\n== ${app} (${appItems.length} articles) ==`);
    for (const sub of subs) {
      try {
        await ensureHierarchy(app, sub);
        hierarchyCount += 1;
        console.log(`  hierarchy: help-center / ${app} / ${sub}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ app, sub, stage: "hierarchy", message });
        console.error(`  hierarchy FAILED ${app}/${sub}: ${message}`);
        continue;
      }

      const pages = appItems.filter((i) => i.subcategory === sub);
      for (const item of pages) {
        try {
          const result = await importPage(item);
          pageCount += 1;
          console.log(
            `  page: ${item.slug}${result.id ? ` → ${result.id}` : ""}`
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push({
            app,
            sub,
            slug: item.slug,
            stage: "page",
            message,
          });
          console.error(`  page FAILED ${item.slug}: ${message}`);
        }
      }
    }
  }

  console.log(`\nDone. hierarchy upserts: ${hierarchyCount}, pages: ${pageCount}, errors: ${errors.length}`);
  if (errors.length) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Import failed:", err.message || err);
  process.exit(1);
});
