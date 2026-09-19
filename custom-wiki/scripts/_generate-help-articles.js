/**
 * Generates content/help/** articles + manifest.json
 * Usage: node scripts/_generate-help-articles.js
 */
const fs = require("fs");
const path = require("path");
const APP_CONTEXT = require("./_help-app-context");

const ROOT = path.join(__dirname, "..", "content", "help");
const VERIFIED = "2026-08-07";
const manifest = [];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function subcategoryBlurb(sub) {
  switch (sub) {
    case "getting-started":
      return "This article is a first-run guide. Finish Verify before moving to how-to topics.";
    case "how-to":
      return "This article is a task guide. Follow the steps in order; do not skip Verify.";
    case "troubleshoot":
      return "Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.";
    case "admin":
      return "Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.";
    default:
      return "Follow the steps in order and complete Verify.";
  }
}

function expandSteps(steps) {
  return steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
}

function contextSections(app, subcategory) {
  const ctx = APP_CONTEXT[app];
  if (!ctx) return "";

  const urls = (ctx.urls || []).map((u) => `- ${u}`).join("\n");
  const ui = (ctx.uiMap || []).map((u) => `- ${u}`).join("\n");
  const pitfalls = (ctx.pitfalls || []).map((p) => `- ${p}`).join("\n");
  const tips = (ctx.tips || []).map((t) => `- ${t}`).join("\n");

  return `
## About this app
${ctx.about}

Canonical URLs:
${urls}

## UI map
Know these landmarks before you start:

${ui}

## Audience notes
${subcategoryBlurb(subcategory)}

## Common pitfalls
${pitfalls}

## Kecktech tips
${tips}
`;
}

function article({
  app,
  appName,
  audience,
  title,
  goal,
  prereqs,
  steps,
  verify,
  related,
  extra,
  subcategory,
}) {
  const prereqLines = prereqs.map((p) => `- ${p}`).join("\n");
  const stepLines = expandSteps(steps);
  const relatedLines = related.map((r) => `- [${r.label}](${r.href})`).join("\n");
  const extraBlock = extra ? `\n${extra}\n` : "";
  const ctxBlock = app && subcategory ? contextSections(app, subcategory) : "";

  return `# ${title}

**App:** ${appName}  
**Audience:** ${audience}  
**Last verified:** ${VERIFIED}

## Goal
${goal}

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
${prereqLines}

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ${appName}.

## Steps
${stepLines}
${extraBlock}
## Verify
${verify}

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for ${appName} from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.

${ctxBlock}
## Related
${relatedLines}
`;
}

function writeArticle(app, sub, slug, title, body) {
  const dir = path.join(ROOT, app, sub);
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, String(body).replace(/\r\n/g, "\n"), "utf8");
  const entry = {
    app,
    subcategory: sub,
    slug,
    title,
    path: `content/help/${app}/${sub}/${slug}.md`,
  };
  manifest.push(entry);
  return entry;
}

// article() returns a deferred payload; writeArticleSmart renders with app/subcategory.
function articleDeferred(opts) {
  return { __helpArticle: true, opts };
}

function writeArticleSmart(app, sub, slug, title, bodyOrDeferred) {
  let body;
  if (bodyOrDeferred && bodyOrDeferred.__helpArticle) {
    body = article({
      ...bodyOrDeferred.opts,
      app,
      subcategory: sub,
    });
  } else {
    body = String(bodyOrDeferred);
  }
  return writeArticle(app, sub, slug, title, body);
}

const helpers = {
  writeArticle: writeArticleSmart,
  article: articleDeferred,
  VERIFIED,
};

require("./_help-content-a")(helpers);
require("./_help-content-b")(helpers);
require("./_help-content-c")(helpers);

ensureDir(ROOT);
const manifestPath = path.join(ROOT, "manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

const byApp = {};
for (const m of manifest) {
  byApp[m.app] = (byApp[m.app] || 0) + 1;
}

let minLines = Infinity;
let maxLines = 0;
for (const m of manifest) {
  const abs = path.join(__dirname, "..", m.path);
  const n = fs.readFileSync(abs, "utf8").split(/\r?\n/).length;
  if (n < minLines) minLines = n;
  if (n > maxLines) maxLines = n;
}

console.log(`Wrote ${manifest.length} articles across ${Object.keys(byApp).length} apps`);
console.log(`Line range: ${minLines}–${maxLines}`);
console.log(`Manifest: ${manifestPath}`);
for (const [app, count] of Object.entries(byApp).sort()) {
  console.log(`  ${app}: ${count}`);
}
