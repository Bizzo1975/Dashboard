/**
 * upload-articles.js
 * Reads bookstack/articles/KB-XXXX_slug.md files and uploads them to BookStack
 * using the chapter-mapping.json created by create-hierarchy.js.
 *
 * File naming convention: KB-0001_slug-here.md
 * The KB-ID prefix is used to look up the target shelf/book/chapter.
 *
 * Usage:
 *   node upload-articles.js              — upload all articles
 *   node upload-articles.js KB-0001      — upload single article
 *   node upload-articles.js --dry-run    — show what would be uploaded
 *
 * Prerequisites:
 *   1. Run create-hierarchy.js first to generate chapter-mapping.json
 *   2. Place generated .md files in bookstack/articles/
 */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const BS_URL = process.env.BOOKSTACK_URL;
const BS_TOKEN = `Token ${process.env.BOOKSTACK_TOKEN_ID}:${process.env.BOOKSTACK_TOKEN_SECRET}`;
const ARTICLES_DIR = path.join(__dirname, 'articles');
const MAPPING_PATH = path.join(__dirname, 'chapter-mapping.json');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SINGLE_ID = args.find(a => a.startsWith('KB-'));

// ── API helper ───────────────────────────────────────────────────────────────
async function bsPost(endpoint, body) {
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] POST ${endpoint}`, JSON.stringify(body).slice(0, 120));
    return { id: 0, name: body.name };
  }
  const res = await fetch(`${BS_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function bsPut(endpoint, body) {
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] PUT ${endpoint}`);
    return { id: 0 };
  }
  const res = await fetch(`${BS_URL}/api/${endpoint}`, {
    method: 'PUT',
    headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${endpoint} → ${res.status} ${await res.text()}`);
  return res.json();
}

// Check if a page already exists by name in the same book
async function findExistingPage(name, bookId) {
  const res = await fetch(
    `${BS_URL}/api/search?query=${encodeURIComponent('"' + name + '"')}&filter[type]=page`,
    { headers: { Authorization: BS_TOKEN } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return (data.data || []).find(p => p.type === 'page' && p.book_id === bookId && p.name === name) || null;
}

// ── Extract title from first markdown H1 or filename ─────────────────────────
function extractTitle(content, filename) {
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  // Fall back to filename without KB-ID prefix
  return filename.replace(/^KB-\d+_/, '').replace(/\.md$/, '').replace(/-/g, ' ');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(MAPPING_PATH)) {
    console.error('chapter-mapping.json not found. Run create-hierarchy.js first.');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`Articles directory not found: ${ARTICLES_DIR}`);
    process.exit(1);
  }

  let files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));

  if (SINGLE_ID) {
    files = files.filter(f => f.startsWith(SINGLE_ID));
    if (files.length === 0) {
      console.error(`No article file found for ${SINGLE_ID}`);
      process.exit(1);
    }
  }

  console.log(`${DRY_RUN ? '[DRY-RUN] ' : ''}Uploading ${files.length} article(s)...`);

  const report = { uploaded: [], updated: [], skipped: [], failed: [] };

  for (const file of files) {
    const kbIdMatch = file.match(/^(KB-\d+)/i);
    if (!kbIdMatch) {
      console.warn(`Skipping ${file} — does not start with KB-XXXX`);
      report.skipped.push({ file, reason: 'no KB-ID prefix' });
      continue;
    }

    const kbId = kbIdMatch[1].toUpperCase();
    const entry = mapping[kbId];

    if (!entry) {
      console.warn(`Skipping ${file} — ${kbId} not found in chapter-mapping.json`);
      report.skipped.push({ file, reason: 'not in mapping' });
      continue;
    }

    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    const title = entry.title || extractTitle(content, file);

    try {
      // Check if page already exists (idempotent)
      const existing = await findExistingPage(title, entry.bookId);

      const pagePayload = {
        name: title,
        markdown: content,
        book_id: entry.bookId,
      };
      if (entry.chapterId) pagePayload.chapter_id = entry.chapterId;

      if (existing) {
        await bsPut(`pages/${existing.id}`, pagePayload);
        report.updated.push({ kbId, file, title, pageId: existing.id });
        process.stdout.write('U');
      } else {
        const page = await bsPost('pages', pagePayload);
        report.uploaded.push({ kbId, file, title, pageId: page.id });
        process.stdout.write('.');
      }
    } catch (err) {
      report.failed.push({ kbId, file, title, error: err.message });
      process.stdout.write('F');
    }
  }

  console.log('\n');
  console.log(`✓ Uploaded: ${report.uploaded.length}`);
  console.log(`↺ Updated:  ${report.updated.length}`);
  console.log(`- Skipped:  ${report.skipped.length}`);
  console.log(`✗ Failed:   ${report.failed.length}`);

  if (report.failed.length > 0) {
    console.log('\nFailed:');
    report.failed.forEach(f => console.log(`  ${f.kbId} — ${f.error}`));
  }

  const reportPath = path.join(__dirname, 'upload-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
