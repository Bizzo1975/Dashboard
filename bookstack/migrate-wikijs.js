/**
 * migrate-wikijs.js
 * Migrates published WikiJS pages to BookStack via REST API.
 *
 * Prerequisites:
 *   1. Copy .env.example → .env and fill in credentials
 *   2. Temporarily expose wikijs-db port in docker-compose.yml:
 *        ports: ["5432:5432"]
 *      Then: docker compose up -d wikijs-db
 *   3. npm install
 *   4. node migrate-wikijs.js
 *
 * After migration:
 *   - Remove the ports: ["5432:5432"] line from docker-compose.yml before committing
 */

require('dotenv').config();
const { Pool } = require('pg');
const fetch = require('node-fetch');
const fs = require('fs');

// ── Config ──────────────────────────────────────────────────────────────────
const BS_URL = process.env.BOOKSTACK_URL;
const BS_TOKEN = `Token ${process.env.BOOKSTACK_TOKEN_ID}:${process.env.BOOKSTACK_TOKEN_SECRET}`;

const db = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'wikijs',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'wikijs',
});

// ── BookStack API helpers ────────────────────────────────────────────────────
async function bsGet(path) {
  const res = await fetch(`${BS_URL}/api/${path}`, {
    headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function bsPost(path, body) {
  const res = await fetch(`${BS_URL}/api/${path}`, {
    method: 'POST',
    headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

// ── Idempotent shelf / book / chapter creators ───────────────────────────────
const shelfCache = {};
const bookCache = {};
const chapterCache = {};

async function getOrCreateShelf(name) {
  if (shelfCache[name]) return shelfCache[name];
  const list = await bsGet('shelves?count=500');
  const existing = (list.data || []).find(s => s.name.toLowerCase() === name.toLowerCase());
  if (existing) { shelfCache[name] = existing; return existing; }
  const created = await bsPost('shelves', { name, description: `Migrated from WikiJS: ${name}` });
  shelfCache[name] = created;
  return created;
}

async function getOrCreateBook(name, shelfId) {
  const key = `${shelfId}::${name}`;
  if (bookCache[key]) return bookCache[key];
  const list = await bsGet('books?count=500');
  const existing = (list.data || []).find(b => b.name.toLowerCase() === name.toLowerCase());
  if (existing) { bookCache[key] = existing; return existing; }
  const created = await bsPost('books', { name, description: `Migrated from WikiJS: ${name}` });
  // Assign to shelf
  await fetch(`${BS_URL}/api/shelves/${shelfId}`, {
    method: 'PUT',
    headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ books: [created.id] }),
  });
  bookCache[key] = created;
  return created;
}

async function getOrCreateChapter(name, bookId) {
  const key = `${bookId}::${name}`;
  if (chapterCache[key]) return chapterCache[key];
  const list = await bsGet(`books/${bookId}/export/plaintext`).catch(() => ({ chapters: [] }));
  // Simpler approach: list chapters via search
  const search = await bsGet(`search?query=${encodeURIComponent(name)}&type=chapter`);
  const existing = (search.data || []).find(
    c => c.type === 'chapter' && c.book_id === bookId && c.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) { chapterCache[key] = existing; return existing; }
  const created = await bsPost('chapters', { name, book_id: bookId, description: `Migrated from WikiJS: ${name}` });
  chapterCache[key] = created;
  return created;
}

// ── Path parser: /a/b/c → { shelf: 'A', book: 'B', chapter: 'C', page: 'C' }
function parsePath(pathStr) {
  const parts = pathStr.replace(/^\//, '').split('/').filter(Boolean);
  const toTitle = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  if (parts.length === 0) return { shelf: 'General', book: 'Uncategorized', chapter: null };
  if (parts.length === 1) return { shelf: 'General', book: toTitle(parts[0]), chapter: null };
  if (parts.length === 2) return { shelf: toTitle(parts[0]), book: toTitle(parts[1]), chapter: null };
  return { shelf: toTitle(parts[0]), book: toTitle(parts[1]), chapter: toTitle(parts[2]) };
}

// ── Internal link re-mapper ──────────────────────────────────────────────────
function remapLinks(content, linkMap) {
  return content.replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, (match, text, path) => {
    const target = linkMap[`/${path}`];
    return target ? `[${text}](${BS_URL}/link/${target})` : match;
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Connecting to WikiJS database...');
  const client = await db.connect();

  let rows;
  try {
    const result = await client.query(
      `SELECT id, title, path, content, "createdAt", "updatedAt"
       FROM pages
       WHERE "isPublished" = true
       ORDER BY path`
    );
    rows = result.rows;
  } finally {
    client.release();
  }

  console.log(`Found ${rows.length} published pages to migrate.`);

  const report = { migrated: [], failed: [], skipped: [] };
  const linkMap = {}; // wikiPath → bookstack_page_id

  // First pass: create all structure + pages, build linkMap
  for (const row of rows) {
    try {
      const { shelf: shelfName, book: bookName, chapter: chapterName } = parsePath(row.path);

      const shelf = await getOrCreateShelf(shelfName);
      const book = await getOrCreateBook(bookName, shelf.id);

      const pagePayload = {
        name: row.title || row.path.split('/').pop() || 'Untitled',
        markdown: row.content || '',
        book_id: book.id,
      };

      if (chapterName) {
        const chapter = await getOrCreateChapter(chapterName, book.id);
        pagePayload.chapter_id = chapter.id;
      }

      const page = await bsPost('pages', pagePayload);
      linkMap[row.path] = page.id;

      report.migrated.push({ wikiId: row.id, path: row.path, bsPageId: page.id, title: row.title });
      process.stdout.write('.');
    } catch (err) {
      report.failed.push({ wikiId: row.id, path: row.path, title: row.title, error: err.message });
      process.stdout.write('F');
    }
  }

  console.log('\n\nMigration complete. Writing report...');
  fs.writeFileSync(
    'migration-report.json',
    JSON.stringify({ ...report, summary: { migrated: report.migrated.length, failed: report.failed.length } }, null, 2)
  );

  console.log(`✓ Migrated: ${report.migrated.length}`);
  console.log(`✗ Failed:   ${report.failed.length}`);
  if (report.failed.length > 0) {
    console.log('Failed pages:', report.failed.map(f => f.path).join(', '));
  }
  console.log('Report saved to migration-report.json');

  await db.end();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
