require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BS_URL = process.env.BOOKSTACK_URL;
const BS_TOKEN = `Token ${process.env.BOOKSTACK_TOKEN_ID}:${process.env.BOOKSTACK_TOKEN_SECRET}`;
const ARTICLES_DIR = path.join(__dirname, 'articles');
const MAPPING_PATH = path.join(__dirname, 'chapter-mapping.json');
const CATALOG_PATH =
  ((process.argv.slice(2).find(a => a.startsWith('--catalog=')) || '').split('=')[1]) ||
  path.resolve(__dirname, '../docs/kecktech-wiki-article-catalog.xlsx');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PILOT_LIMIT = parseInt(((args.find(a => a.startsWith('--limit=')) || '').split('=')[1] || '0'), 10) || 0;
const SINGLE_ID = (args.find(a => a.startsWith('KB-')) || '').toUpperCase();
const REPORT_PATH =
  ((args.find(a => a.startsWith('--report=')) || '').split('=')[1]) ||
  path.join(__dirname, 'reports', DRY_RUN ? 'upload-report-dry-run.json' : 'upload-report.json');
const RETRY_COUNT = parseInt(process.env.BOOKSTACK_RETRY_COUNT || '3', 10);
const RATE_LIMIT_MS = parseInt(process.env.BOOKSTACK_RATE_LIMIT_MS || '150', 10);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function api(method, endpoint, body) {
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
        throw new Error(`${method} ${endpoint} -> ${res.status} ${await res.text()}`);
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

async function findExistingPage(name, bookId) {
  if (DRY_RUN) {
    return null;
  }
  const data = await api('GET', `search?query=${encodeURIComponent(`"${name}"`)}&filter[type]=page`);
  return (data.data || []).find(item => item.type === 'page' && item.book_id === bookId && item.name === name) || null;
}

function pickCatalogMeta(rows, kbId, fallbackTitle) {
  const row = rows.find(item => String(item.KB_ID || item['KB ID'] || item.ID || '').toUpperCase() === kbId);
  const title = String(row?.['Article Title'] || row?.Title || fallbackTitle || kbId).trim();
  const tagsText = String(row?.Tags || '').trim();
  const tags = tagsText
    ? tagsText.split(',').map(tag => ({ name: tag.trim(), value: '' })).filter(tag => tag.name)
    : [];
  return { title, tags };
}

function articleFiles() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return [];
  }
  return fs.readdirSync(ARTICLES_DIR).filter(name => name.endsWith('.md')).sort();
}

function loadCatalogRows() {
  if (!fs.existsSync(CATALOG_PATH)) {
    return [];
  }
  const workbook = XLSX.readFile(CATALOG_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

function pickContentFromCatalog(row) {
  const content = String(
    row?.Markdown ||
    row?.Content ||
    row?.Body ||
    row?.['Article Body'] ||
    ''
  );
  return content.trim();
}

function selectKbIds(mapping) {
  let ids = Object.keys(mapping).sort();
  if (SINGLE_ID) {
    ids = ids.filter(id => id === SINGLE_ID);
  }
  if (PILOT_LIMIT > 0) {
    ids = ids.slice(0, PILOT_LIMIT);
  }
  return ids;
}

async function main() {
  if (!DRY_RUN && (!BS_URL || !process.env.BOOKSTACK_TOKEN_ID || !process.env.BOOKSTACK_TOKEN_SECRET)) {
    throw new Error('Missing BookStack API credentials in .env (BOOKSTACK_URL, BOOKSTACK_TOKEN_ID, BOOKSTACK_TOKEN_SECRET).');
  }
  if (!fs.existsSync(MAPPING_PATH)) {
    throw new Error('chapter-mapping.json not found. Run create-hierarchy.js first.');
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
  const catalogRows = loadCatalogRows();
  const files = articleFiles();
  const fileByKbId = new Map(
    files
      .map(file => [((file.match(/^(KB-\d+)/i) || [])[1] || '').toUpperCase(), file])
      .filter(entry => entry[0])
  );
  const kbIds = selectKbIds(mapping);
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    singleId: SINGLE_ID || null,
    pilotLimit: PILOT_LIMIT || null,
    totalCandidates: kbIds.length,
    uploaded: [],
    updated: [],
    skipped: [],
    errors: [],
    missingMetadata: [],
  };

  if (files.length === 0) {
    report.skipped.push({ reason: 'no markdown files found in bookstack/articles; using catalog content when available' });
  }

  for (const kbId of kbIds) {
    const entry = mapping[kbId];
    if (!entry) {
      report.skipped.push({ kbId, reason: 'KB ID not found in chapter mapping' });
      continue;
    }

    const file = fileByKbId.get(kbId) || null;
    const row = catalogRows.find(item => String(item.KB_ID || item['KB ID'] || item.ID || '').toUpperCase() === kbId);
    const content = file
      ? fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8')
      : pickContentFromCatalog(row);
    const meta = pickCatalogMeta(catalogRows, kbId, entry.title);
    if (!meta.title) {
      report.missingMetadata.push({ kbId, file, reason: 'missing title in mapping/catalog' });
    }
    if (!content) {
      report.skipped.push({ kbId, file, reason: 'no markdown file and no catalog content field' });
      continue;
    }

    try {
      const existing = await findExistingPage(meta.title, entry.bookId);
      const payload = {
        name: meta.title,
        markdown: content,
        book_id: entry.bookId,
        tags: meta.tags,
      };
      if (entry.chapterId) payload.chapter_id = entry.chapterId;

      if (existing) {
        await api('PUT', `pages/${existing.id}`, payload);
        report.updated.push({ kbId, file, pageId: existing.id, title: meta.title });
      } else {
        const page = await api('POST', 'pages', payload);
        report.uploaded.push({ kbId, file, pageId: page.id, title: meta.title });
      }
    } catch (err) {
      report.errors.push({ kbId, file, error: err.message });
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Upload complete. Uploaded=${report.uploaded.length}, Updated=${report.updated.length}, Skipped=${report.skipped.length}, Errors=${report.errors.length}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
