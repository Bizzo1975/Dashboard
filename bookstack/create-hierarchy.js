/**
 * create-hierarchy.js
 * Reads docs/kecktech-wiki-article-catalog.xlsx and creates BookStack
 * shelf → book → chapter structure, then saves chapter-mapping.json
 * so upload-articles.js knows where to place each article.
 *
 * Expected Excel columns (row 1 = headers):
 *   KB_ID | Title | Slug | Shelf | Book | Chapter | Tags | Priority
 *
 * Usage:
 *   node create-hierarchy.js
 *
 * Output:
 *   bookstack/chapter-mapping.json  — { "KB-0001": { shelfId, bookId, chapterId, title, slug }, ... }
 */

require('dotenv').config();
const XLSX = require('xlsx');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const BS_URL = process.env.BOOKSTACK_URL;
const BS_TOKEN = `Token ${process.env.BOOKSTACK_TOKEN_ID}:${process.env.BOOKSTACK_TOKEN_SECRET}`;
const CATALOG_PATH = path.resolve(__dirname, '../docs/kecktech-wiki-article-catalog.xlsx');

// ── BookStack API helpers ────────────────────────────────────────────────────
async function bsGet(endpoint) {
  const res = await fetch(`${BS_URL}/api/${endpoint}`, {
    headers: { Authorization: BS_TOKEN },
  });
  if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function bsPost(endpoint, body) {
  const res = await fetch(`${BS_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function bsPut(endpoint, body) {
  const res = await fetch(`${BS_URL}/api/${endpoint}`, {
    method: 'PUT',
    headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${endpoint} → ${res.status} ${await res.text()}`);
  return res.json();
}

// ── Idempotent creators ──────────────────────────────────────────────────────
const shelfCache = {};
const bookCache = {};
const chapterCache = {};

async function getOrCreateShelf(name) {
  if (shelfCache[name]) return shelfCache[name];
  const list = await bsGet('shelves?count=500');
  const existing = (list.data || []).find(s => s.name === name);
  if (existing) { shelfCache[name] = existing; return existing; }
  const created = await bsPost('shelves', { name, description: `Kecktech knowledge base: ${name}` });
  shelfCache[name] = created;
  console.log(`  + Shelf: ${name}`);
  return created;
}

async function getOrCreateBook(name, shelfId) {
  const key = `${shelfId}::${name}`;
  if (bookCache[key]) return bookCache[key];
  const list = await bsGet('books?count=500');
  const existing = (list.data || []).find(b => b.name === name);
  if (existing) {
    // Ensure it's on the right shelf
    bookCache[key] = existing;
    return existing;
  }
  const created = await bsPost('books', { name, description: `Kecktech knowledge base: ${name}` });
  // Assign to shelf
  const shelf = await bsGet(`shelves/${shelfId}`);
  const currentBookIds = (shelf.books || []).map(b => b.id);
  await bsPut(`shelves/${shelfId}`, { books: [...currentBookIds, created.id] });
  bookCache[key] = created;
  console.log(`    + Book: ${name}`);
  return created;
}

async function getOrCreateChapter(name, bookId) {
  const key = `${bookId}::${name}`;
  if (chapterCache[key]) return chapterCache[key];
  const search = await bsGet(`search?query=${encodeURIComponent('"' + name + '"')}&filter[type]=chapter`);
  const existing = (search.data || []).find(
    c => c.type === 'chapter' && c.book_id === bookId && c.name === name
  );
  if (existing) { chapterCache[key] = existing; return existing; }
  const created = await bsPost('chapters', { name, book_id: bookId });
  chapterCache[key] = created;
  console.log(`      + Chapter: ${name}`);
  return created;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error(`Catalog not found: ${CATALOG_PATH}`);
    process.exit(1);
  }

  console.log('Reading Excel catalog...');
  const wb = XLSX.readFile(CATALOG_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  console.log(`Found ${rows.length} articles in catalog.`);

  const mapping = {};
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const kbId = (row['KB_ID'] || row['KB ID'] || '').toString().trim();
    const title = (row['Title'] || '').toString().trim();
    const slug = (row['Slug'] || '').toString().trim();
    const shelfName = (row['Shelf'] || 'General').toString().trim();
    const bookName = (row['Book'] || 'Uncategorized').toString().trim();
    const chapterName = (row['Chapter'] || '').toString().trim();

    if (!kbId || !title) { skipped++; continue; }

    try {
      const shelf = await getOrCreateShelf(shelfName);
      const book = await getOrCreateBook(bookName, shelf.id);

      let chapterId = null;
      if (chapterName) {
        const chapter = await getOrCreateChapter(chapterName, book.id);
        chapterId = chapter.id;
      }

      mapping[kbId] = {
        title,
        slug,
        shelfId: shelf.id,
        shelfName,
        bookId: book.id,
        bookName,
        chapterId,
        chapterName: chapterName || null,
      };
      created++;
    } catch (err) {
      console.error(`\nError processing ${kbId} (${title}): ${err.message}`);
      skipped++;
    }
  }

  const mappingPath = path.join(__dirname, 'chapter-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

  console.log(`\nDone. ${created} entries mapped, ${skipped} skipped.`);
  console.log(`Mapping saved to: ${mappingPath}`);
  console.log(`\nShelves created: ${Object.keys(shelfCache).length}`);
  console.log(`Books created:   ${Object.keys(bookCache).length}`);
  console.log(`Chapters created: ${Object.keys(chapterCache).length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
