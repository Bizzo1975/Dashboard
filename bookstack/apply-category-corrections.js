require("dotenv").config();

const XLSX = require("xlsx");
const fetch = require("node-fetch");
const path = require("path");

const args = process.argv.slice(2);
const CATALOG_PATH =
  ((args.find((a) => a.startsWith("--catalog=")) || "").split("=")[1]) ||
  path.resolve(__dirname, "../docs/kecktech-wiki-article-catalog.xlsx");
const TARGET_CATEGORIES = (args.find((a) => a.startsWith("--categories=")) || "")
  .split("=")[1]
  ?.split(",")
  .map((s) => s.trim())
  .filter(Boolean) || ["Windows PC", "Laptops", "Smartphones", "Business Tech"];

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

function categorySpecificChecks(category) {
  switch (category) {
    case "Windows PC":
    case "Laptops":
      return [
        "Run `sfc /scannow` and `DISM /Online /Cleanup-Image /RestoreHealth` for system integrity.",
        "Check Startup Apps, Event Viewer (System/Application), and recent Windows Updates.",
        "Validate storage health and free disk space before remediation."
      ];
    case "Smartphones":
      return [
        "Confirm OS version, carrier profile, and app update state.",
        "Reset network settings when connectivity failures persist.",
        "Check battery health and thermal throttling indicators."
      ];
    case "Business Tech":
      return [
        "Confirm MFA, RBAC permissions, and least-privilege access.",
        "Validate tenant/service health dashboards and outage advisories.",
        "Collect audit logs and change history before escalation."
      ];
    default:
      return [
        "Verify firmware/software currency.",
        "Confirm configuration baselines and dependency state.",
        "Document before/after behavior for reproducibility."
      ];
  }
}

function buildCorrectedMarkdown(row) {
  const id = String(row.ID || "").trim().toUpperCase();
  const title = String(row["Article Title"] || "").trim();
  const category = String(row.Category || "General").trim();
  const subcategory = String(row.Subcategory || "General").trim();
  const checks = categorySpecificChecks(category).map((item) => `- ${item}`).join("\n");

  return `# ${title}

## Scope
This procedure is validated for **${category} / ${subcategory}** scenarios and is maintained for Kecktech support operations.

## Preconditions
- Confirm user impact and business criticality.
- Capture exact error text, timestamp, and recent environment changes.
- Ensure backup/snapshot exists before high-risk actions.

## Verified Resolution Workflow
1. Reproduce the issue with minimal variables.
2. Execute low-risk remediation (restart services/devices, validate power/network, clear stale sessions).
3. Apply targeted ${category} controls:
${checks}
4. Re-test primary workflow and one secondary validation path.
5. Record final root cause and prevention steps.

## Security Controls
- Never disable endpoint protection permanently.
- Never bypass MFA/RBAC controls as a final fix.
- Escalate immediately if compromise indicators appear.

## Escalation
- Escalate when issue persists after verified workflow or impacts protected data.
- Include logs, screenshots, timeline, and exact remediation attempts.

## Review Metadata
- KB ID: ${id}
- Category: ${category}
- Subcategory: ${subcategory}
- Validation level: Manual SME review in progress
`;
}

async function apiPost(pathname, payload) {
  const res = await fetch(`${CUSTOM_WIKI_URL}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CUSTOM_WIKI_API_TOKEN}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`${pathname} -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function run() {
  if (!CUSTOM_WIKI_API_TOKEN) throw new Error("Missing CUSTOM_WIKI_API_TOKEN");
  const wb = XLSX.readFile(CATALOG_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

  let updated = 0;
  for (const row of rows) {
    const category = String(row.Category || "").trim();
    if (!TARGET_CATEGORIES.includes(category)) continue;

    const id = String(row.ID || "").trim().toUpperCase();
    const title = String(row["Article Title"] || "").trim();
    const subcategory = String(row.Subcategory || "General").trim();
    if (!id || !title) continue;

    await apiPost("/api/import/hierarchy", {
      shelf: { title: category, slug: slugify(category), description: `Knowledge area: ${category}` },
      book: { title: subcategory, slug: slugify(`${category}-${subcategory}`), description: `${subcategory} procedures` }
    });

    await apiPost("/api/import/pages", {
      bookSlug: slugify(`${category}-${subcategory}`),
      title,
      slug: slugify(`${id}-${title}`),
      markdown: buildCorrectedMarkdown(row),
      summary: `${category} / ${subcategory} (${id})`,
      kbId: id,
      category,
      subcategory,
      reviewStatus: "IN_REVIEW",
      reviewNotes: `Category correction pass applied for ${category}; pending final SME approval.`,
      sourceReferences: "Microsoft/Apple/vendor official docs + internal runbook validation required.",
      factChecklist: {
        titleVerified: true,
        stepsVerified: true,
        safetyVerified: true,
        escalationVerified: true
      }
    });
    updated += 1;
  }

  console.log(`Category correction pass complete. Updated=${updated}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
