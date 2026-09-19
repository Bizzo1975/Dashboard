require('dotenv').config();
const XLSX = require('xlsx');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = parseInt(((args.find(a => a.startsWith('--limit=')) || '').split('=')[1] || '0'), 10) || 0;
const REPORT_PATH =
  ((args.find(a => a.startsWith('--report=')) || '').split('=')[1]) ||
  path.join(__dirname, 'reports', 'hierarchy-report.json');
const CATALOG_PATH =
  ((args.find(a => a.startsWith('--catalog=')) || '').split('=')[1]) ||
  path.resolve(__dirname, '../docs/kecktech-wiki-article-catalog.xlsx');

const BS_URL = process.env.BOOKSTACK_URL;
const BS_TOKEN = `Token ${process.env.BOOKSTACK_TOKEN_ID}:${process.env.BOOKSTACK_TOKEN_SECRET}`;
const RETRY_COUNT = parseInt(process.env.BOOKSTACK_RETRY_COUNT || '3', 10);
const RATE_LIMIT_MS = parseInt(process.env.BOOKSTACK_RATE_LIMIT_MS || '150', 10);

const shelfCache = {};
const bookCache = {};
const chapterCache = {};

const report = {
  timestamp: new Date().toISOString(),
  dryRun: DRY_RUN,
  catalogPath: CATALOG_PATH,
  totalRows: 0,
  processedRows: 0,
  created: { shelves: [], books: [], chapters: [] },
  reused: { shelves: [], books: [], chapters: [] },
  skipped: [],
  errors: [],
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function ensureConfigured() {
  if (DRY_RUN) {
    return;
  }
  if (!BS_URL || !process.env.BOOKSTACK_TOKEN_ID || !process.env.BOOKSTACK_TOKEN_SECRET) {
    throw new Error('Missing BookStack API credentials in .env (BOOKSTACK_URL, BOOKSTACK_TOKEN_ID, BOOKSTACK_TOKEN_SECRET).');
  }
}

async function bsRequest(method, endpoint, body) {
  if (DRY_RUN && method !== 'GET') {
    return { id: -1, dryRun: true };
  }

  let attempts = 0;
  let lastErr;
  while (attempts < RETRY_COUNT) {
    attempts += 1;
    try {
      const res = await fetch(`${BS_URL}/api/${endpoint}`, {
        method,
        headers: { Authorization: BS_TOKEN, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${method} ${endpoint} -> ${res.status} ${text}`);
      }
      await sleep(RATE_LIMIT_MS);
      return res.status === 204 ? {} : res.json();
    } catch (err) {
      lastErr = err;
      if (attempts < RETRY_COUNT) {
        await sleep(RATE_LIMIT_MS * attempts);
      }
    }
  }
  throw lastErr;
}

async function bsGet(endpoint) {
  return bsRequest('GET', endpoint);
}

async function bsPost(endpoint, payload) {
  return bsRequest('POST', endpoint, payload);
}

async function bsPut(endpoint, payload) {
  return bsRequest('PUT', endpoint, payload);
}

async function getOrCreateShelf(name) {
  if (shelfCache[name]) return shelfCache[name];
  if (DRY_RUN) {
    const pseudo = { id: Object.keys(shelfCache).length + 1, name };
    shelfCache[name] = pseudo;
    report.created.shelves.push(name);
    return pseudo;
  }
  const list = await bsGet('shelves?count=500');
  const existing = (list.data || []).find(item => item.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    shelfCache[name] = existing;
    report.reused.shelves.push(name);
    return existing;
  }
  const created = await bsPost('shelves', { name, description: `Kecktech knowledge base: ${name}` });
  const value = DRY_RUN ? { id: -1, name } : created;
  shelfCache[name] = value;
  report.created.shelves.push(name);
  return value;
}

async function getOrCreateBook(name, shelfId) {
  const key = `${shelfId}::${name}`;
  if (bookCache[key]) return bookCache[key];
  if (DRY_RUN) {
    const pseudo = { id: Object.keys(bookCache).length + 1001, name };
    bookCache[key] = pseudo;
    report.created.books.push(name);
    return pseudo;
  }
  const list = await bsGet('books?count=500');
  const existing = (list.data || []).find(item => item.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    bookCache[key] = existing;
    report.reused.books.push(name);
    return existing;
  }
  const created = await bsPost('books', { name, description: `Kecktech knowledge base: ${name}` });
  const value = DRY_RUN ? { id: -1, name } : created;
  if (!DRY_RUN) {
    const shelf = await bsGet(`shelves/${shelfId}`);
    const bookIds = (shelf.books || []).map(book => book.id);
    if (!bookIds.includes(value.id)) {
      await bsPut(`shelves/${shelfId}`, { books: [...bookIds, value.id] });
    }
  }
  bookCache[key] = value;
  report.created.books.push(name);
  return value;
}

async function getOrCreateChapter(name, bookId) {
  const key = `${bookId}::${name}`;
  if (chapterCache[key]) return chapterCache[key];
  if (DRY_RUN) {
    const pseudo = { id: Object.keys(chapterCache).length + 2001, name };
    chapterCache[key] = pseudo;
    report.created.chapters.push(name);
    return pseudo;
  }
  const search = await bsGet(`search?query=${encodeURIComponent(`"${name}"`)}&filter[type]=chapter`);
  const existing = (search.data || []).find(item => item.type === 'chapter' && item.book_id === bookId && item.name === name);
  if (existing) {
    chapterCache[key] = existing;
    report.reused.chapters.push(name);
    return existing;
  }
  const created = await bsPost('chapters', { name, book_id: bookId });
  const value = DRY_RUN ? { id: -1, name } : created;
  chapterCache[key] = value;
  report.created.chapters.push(name);
  return value;
}

function pickField(row, names, fallback = '') {
  for (const field of names) {
    const value = row[field];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return fallback;
}

async function main() {
  ensureConfigured();
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Catalog not found: ${CATALOG_PATH}`);
  }

  const workbook = XLSX.readFile(CATALOG_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  let rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (LIMIT > 0) {
    rows = rows.slice(0, LIMIT);
  }
  report.totalRows = rows.length;

  const mapping = {};
  for (const row of rows) {
    const kbId = pickField(row, ['KB_ID', 'KB ID', 'ID']);
    const title = pickField(row, ['Title', 'Article Title']);
    const slug = pickField(row, ['Slug'], '');
    const shelfName = pickField(row, ['Shelf', 'Category'], 'General');
    const bookName = pickField(row, ['Book', 'Subcategory'], 'Uncategorized');
    const chapterName = pickField(row, ['Chapter', 'Section'], '');

    if (!kbId || !title) {
      report.skipped.push({ row, reason: 'missing KB ID or title' });
      continue;
    }

    try {
      const shelf = await getOrCreateShelf(shelfName);
      const book = await getOrCreateBook(bookName, shelf.id);
      const chapter = chapterName ? await getOrCreateChapter(chapterName, book.id) : null;

      mapping[kbId] = {
        title,
        slug,
        shelfId: shelf.id,
        shelfName,
        bookId: book.id,
        bookName,
        chapterId: chapter ? chapter.id : null,
        chapterName: chapterName || null,
      };
      report.processedRows += 1;
    } catch (err) {
      report.errors.push({ kbId, title, error: err.message });
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'chapter-mapping.json'), JSON.stringify(mapping, null, 2));
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`Hierarchy complete. Processed=${report.processedRows}, Skipped=${report.skipped.length}, Errors=${report.errors.length}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
