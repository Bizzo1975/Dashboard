require("dotenv").config();

const XLSX = require("xlsx");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = parseInt(((args.find((a) => a.startsWith("--limit=")) || "").split("=")[1] || "0"), 10) || 0;
const REPORT_PATH =
  ((args.find((a) => a.startsWith("--report=")) || "").split("=")[1]) ||
  path.join(__dirname, "reports", DRY_RUN ? "xlsx-customwiki-dry-run.json" : "xlsx-customwiki-live.json");
const CATALOG_PATH =
  ((args.find((a) => a.startsWith("--catalog=")) || "").split("=")[1]) ||
  path.resolve(__dirname, "../docs/kecktech-wiki-article-catalog.xlsx");

const CUSTOM_WIKI_URL = process.env.CUSTOM_WIKI_URL || "http://custom-wiki:3011";
const CUSTOM_WIKI_API_TOKEN = process.env.CUSTOM_WIKI_API_TOKEN;

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

function parseTags(row) {
  return String(row.Tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((name) => ({ name, value: "" }));
}

function buildMarkdown(row) {
  const title = String(row["Article Title"] || row.Title || row.ID || "Untitled").trim();
  const category = String(row.Category || "General").trim();
  const subcategory = String(row.Subcategory || "General").trim();
  const audience = String(row.Audience || "General Users").trim();
  const difficulty = String(row.Difficulty || "Moderate").trim();
  const priority = String(row.Priority || "Standard").trim();
  const tags = String(row.Tags || "").trim();

  const tagBullets = tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => `- ${t}`)
        .join("\n")
    : "- troubleshooting\n- support";

  return `# ${title}

## Quick Summary
This guide provides practical, real-world steps for **${audience}** to handle **${subcategory}** in the **${category}** domain.

## When To Use This Guide
- You are currently experiencing: **${title}**
- You need a safe and repeatable process with minimal risk
- You want escalation criteria before contacting support

## Readiness Check
- Difficulty: **${difficulty}**
- Priority: **${priority}**
- Estimated time: **15-30 minutes**
- Recommended access: device settings + administrator account when applicable

## Step-by-Step Resolution
1. **Confirm the exact symptom**
   - Capture the message, screen behavior, or failure point.
   - Note any recent changes (updates, installs, hardware changes).
2. **Perform the safest low-risk checks first**
   - Restart the affected device/service.
   - Verify cable/power/network basics.
   - Re-test after each change to isolate impact.
3. **Apply targeted corrective actions**
   - Open relevant settings for ${category}.
   - Validate core configuration values tied to ${subcategory}.
   - Remove conflicting temporary conditions (stuck processes, pending updates, stale sessions).
4. **Validate expected behavior**
   - Confirm the original issue no longer reproduces.
   - Run one secondary confirmation test (for example, reopen app, reconnect service, re-run workflow).
5. **Document and harden**
   - Record what changed and why.
   - Keep only confirmed-good settings.
   - Schedule follow-up monitoring if this issue is recurring.

## Advanced Checks (If Issue Persists)
- Review system/app logs around the failure time.
- Validate permissions and policy controls.
- Verify update state and dependency versions.
- Test from a known-good account/profile to isolate user-specific factors.

## Safety and Security Notes
- Do not disable security controls permanently to bypass the issue.
- Avoid unknown third-party tools unless vetted by IT.
- Back up critical data before high-impact changes.

## Escalation Criteria
Escalate to Kecktech support when any of these are true:
- Reproducible failure remains after all core steps.
- Data integrity/security risk is present.
- Business-critical workflow is blocked.
- The fix requires privileged infrastructure access.

## Related Tags
${tagBullets}

## Internal Notes Template
- Environment:
- Error text/code:
- Last known good state:
- Actions attempted:
- Final resolution:
`;
}

async function apiPost(pathname, payload) {
  if (DRY_RUN) return { dryRun: true };
  const res = await fetch(`${CUSTOM_WIKI_URL}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CUSTOM_WIKI_API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`${pathname} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Catalog not found: ${CATALOG_PATH}`);
  }
  if (!DRY_RUN && !CUSTOM_WIKI_API_TOKEN) {
    throw new Error("Missing CUSTOM_WIKI_API_TOKEN");
  }

  const wb = XLSX.readFile(CATALOG_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  let rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
  if (LIMIT > 0) rows = rows.slice(0, LIMIT);

  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    totalRows: rows.length,
    imported: 0,
    skipped: 0,
    errors: 0,
    skippedItems: [],
    errorItems: [],
  };

  for (const row of rows) {
    const id = String(row.ID || "").trim().toUpperCase();
    const title = String(row["Article Title"] || row.Title || "").trim();
    const category = String(row.Category || "General").trim();
    const subcategory = String(row.Subcategory || "General").trim();

    if (!id || !title) {
      report.skipped += 1;
      report.skippedItems.push({ id, title, reason: "missing ID or title" });
      continue;
    }

    const shelfSlug = slugify(category);
    const bookSlug = slugify(`${category}-${subcategory}`);
    const pageSlug = slugify(`${id}-${title}`);
    const markdown = buildMarkdown(row);

    try {
      await apiPost("/api/import/hierarchy", {
        shelf: { title: titleCase(category), slug: shelfSlug, description: `Knowledge area: ${category}` },
        book: { title: titleCase(subcategory), slug: bookSlug, description: `${subcategory} procedures and guides` },
      });

      await apiPost("/api/import/pages", {
        bookSlug,
        title,
        slug: pageSlug,
        markdown,
        summary: `${category} / ${subcategory} (${id})`,
        tags: parseTags(row),
        kbId: id,
        category,
        subcategory,
        reviewStatus: "IN_REVIEW",
        reviewNotes: `Pending manual SME validation for ${category} > ${subcategory}.`,
        sourceReferences: "Vendor docs + Kecktech internal SOP review required.",
        factChecklist: {
          titleVerified: false,
          stepsVerified: false,
          safetyVerified: false,
          escalationVerified: false
        }
      });

      report.imported += 1;
    } catch (error) {
      report.errors += 1;
      report.errorItems.push({
        id,
        title,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(
    `XLSX import complete. Imported=${report.imported}, Skipped=${report.skipped}, Errors=${report.errors}`
  );
  console.log(`Report: ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
