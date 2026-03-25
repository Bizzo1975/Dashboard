'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DATA_DIR    = process.env.DATA_DIR    || '/website/src/data';
const WEBSITE_DIR = process.env.WEBSITE_DIR || '/website';
const PORT        = process.env.PORT        || 3000;

const PAGES = ['home', 'about', 'services', 'pricing', 'contact', 'global'];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Helpers ───────────────────────────────────────────────────────────────────

function readData(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf8'));
}

function writeData(name, data) {
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function humanLabel(key) {
  return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

// Recursively render form fields from a JSON value
function renderFields(val, name, depth = 0) {
  if (val === null || val === undefined) return '';

  if (typeof val === 'boolean') {
    // Render as hidden — booleans are structural
    return `<input type="hidden" name="${esc(name)}" value="${val ? 'true' : 'false'}" />`;
  }

  if (typeof val === 'number') {
    return `<input type="hidden" name="${esc(name)}" value="${val}" />`;
  }

  if (typeof val === 'string') {
    const id = name.replace(/[\[\].]/g, '_');
    const label = humanLabel(name.split(/[\[\].]+/).filter(Boolean).pop() || name);
    const isLong = val.length > 100 || val.includes('\n');
    const inputHtml = isLong
      ? `<textarea id="${id}" name="${esc(name)}" rows="${Math.max(3, Math.ceil(val.length / 80))}">${esc(val)}</textarea>`
      : `<input type="text" id="${id}" name="${esc(name)}" value="${esc(val)}" />`;
    return `<div class="field"><label for="${id}">${esc(label)}</label>${inputHtml}</div>`;
  }

  if (Array.isArray(val)) {
    const label = humanLabel(name.split(/[\[\].]+/).filter(Boolean).pop() || name);
    let html = `<div class="array-section"><h${Math.min(depth + 3, 5)} class="array-heading">${esc(label)}</h${Math.min(depth + 3, 5)}>`;
    val.forEach((item, i) => {
      if (typeof item === 'object' && !Array.isArray(item)) {
        html += `<fieldset class="array-item"><legend>Item ${i + 1}</legend>`;
        html += renderFields(item, `${name}[${i}]`, depth + 1);
        html += `</fieldset>`;
      } else {
        html += renderFields(item, `${name}[${i}]`, depth + 1);
      }
    });
    html += `</div>`;
    return html;
  }

  if (typeof val === 'object') {
    const label = name ? humanLabel(name.split(/[\[\].]+/).filter(Boolean).pop() || name) : '';
    let html = label && depth > 0 ? `<div class="obj-section"><h${Math.min(depth + 3, 5)} class="obj-heading">${esc(label)}</h${Math.min(depth + 3, 5)}>` : '<div class="obj-section">';
    for (const [k, v] of Object.entries(val)) {
      html += renderFields(v, name ? `${name}[${k}]` : k, depth + 1);
    }
    html += '</div>';
    return html;
  }

  return '';
}

// Recursively merge form body back into original structure (preserving types)
function mergeFormData(original, submitted) {
  if (original === null || original === undefined) return submitted;

  if (typeof original === 'boolean') {
    return submitted === 'true';
  }
  if (typeof original === 'number') {
    return Number(submitted);
  }
  if (typeof original === 'string') {
    return typeof submitted === 'string' ? submitted : original;
  }
  if (Array.isArray(original)) {
    if (!submitted || !Array.isArray(submitted)) return original;
    return original.map((item, i) => {
      if (submitted[i] === undefined) return item;
      return mergeFormData(item, submitted[i]);
    });
  }
  if (typeof original === 'object') {
    const result = {};
    for (const key of Object.keys(original)) {
      result[key] = submitted && submitted[key] !== undefined
        ? mergeFormData(original[key], submitted[key])
        : original[key];
    }
    return result;
  }
  return submitted;
}

// ── Layout ────────────────────────────────────────────────────────────────────

function layout(title, body, page = '') {
  const navLinks = PAGES.map(p =>
    `<a href="/page/${p}" class="nav-link${p === page ? ' active' : ''}">${p.charAt(0).toUpperCase() + p.slice(1)}</a>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)} — Kecktech Admin</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <header class="admin-header">
    <div class="admin-header-inner">
      <a href="/" class="admin-logo">Kecktech Admin</a>
      <nav class="admin-nav">${navLinks}</nav>
    </div>
  </header>
  <main class="admin-main">
    ${body}
  </main>
</body>
</html>`;
}

// ── Build state ───────────────────────────────────────────────────────────────

let buildState = { running: false, log: '', exitCode: null };

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => res.redirect('/page/home'));

app.get('/page/:name', (req, res) => {
  const { name } = req.params;
  if (!PAGES.includes(name)) return res.status(404).send(layout('Not Found', '<p>Page not found.</p>'));

  const data = readData(name);
  const saved = req.query.saved === '1';
  const fields = renderFields(data, '');

  const body = `
    ${saved ? '<div class="alert alert-success">Saved successfully. Click <strong>Rebuild &amp; Publish</strong> to push changes live.</div>' : ''}
    <div class="page-header">
      <h1>Edit: ${esc(name.charAt(0).toUpperCase() + name.slice(1))}</h1>
      <div class="page-actions">
        <form method="POST" action="/build" style="display:inline">
          <button type="submit" class="btn btn-build" id="build-btn">Rebuild &amp; Publish</button>
        </form>
      </div>
    </div>
    <form method="POST" action="/save/${esc(name)}" class="edit-form">
      ${fields}
      <div class="form-footer">
        <button type="submit" class="btn btn-save">Save Changes</button>
        <span class="save-note">Saving updates the data file. You still need to Rebuild &amp; Publish to go live.</span>
      </div>
    </form>
    <div class="build-log" id="build-log" hidden>
      <h3>Build Output</h3>
      <pre id="build-output"></pre>
    </div>
    <script>
      const buildBtn = document.getElementById('build-btn');
      const buildLog = document.getElementById('build-log');
      const buildOutput = document.getElementById('build-output');

      document.querySelector('form[action="/build"]').addEventListener('submit', async (e) => {
        e.preventDefault();
        buildBtn.textContent = 'Building…';
        buildBtn.disabled = true;
        buildLog.hidden = false;
        buildOutput.textContent = 'Starting build…';

        await fetch('/build', { method: 'POST' });

        // Poll for completion
        const poll = setInterval(async () => {
          const res = await fetch('/build/status');
          const data = await res.json();
          buildOutput.textContent = data.log || '…';
          if (!data.running) {
            clearInterval(poll);
            buildBtn.textContent = 'Rebuild & Publish';
            buildBtn.disabled = false;
            if (data.exitCode === 0) {
              buildOutput.textContent += '\\n\\n✅ Build complete! Site is live.';
            } else {
              buildOutput.textContent += '\\n\\n❌ Build failed. Check output above.';
            }
          }
        }, 1000);
      });
    </script>`;

  res.send(layout(`Edit ${name}`, body, name));
});

app.post('/save/:name', (req, res) => {
  const { name } = req.params;
  if (!PAGES.includes(name)) return res.status(404).send('Not found');

  const original = readData(name);
  const merged = mergeFormData(original, req.body);
  writeData(name, merged);

  res.redirect(`/page/${name}?saved=1`);
});

app.post('/build', (req, res) => {
  if (buildState.running) {
    return res.json({ started: false, error: 'Build already running' });
  }
  buildState = { running: true, log: 'Starting build…\n', exitCode: null };

  exec('npm run build', { cwd: WEBSITE_DIR }, (err, stdout, stderr) => {
    buildState.running = false;
    buildState.log = (stdout || '') + (stderr || '');
    buildState.exitCode = err ? (err.code || 1) : 0;
  });

  res.json({ started: true });
});

app.get('/build/status', (req, res) => {
  res.json(buildState);
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Kecktech Admin running on port ${PORT}`);
  console.log(`DATA_DIR: ${DATA_DIR}`);
  console.log(`WEBSITE_DIR: ${WEBSITE_DIR}`);
});
