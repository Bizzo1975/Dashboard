# Custom Wiki Cutover Runbook

## What was switched

- `help.kecktech.net` now routes to `custom-wiki` (Next.js) via Traefik.
- BookStack route moved to `bookstack.kecktech.net` label for rollback source.

## Services

- `custom-wiki` (app container, port 3011).
- `custom-wiki-db` (PostgreSQL).

## Validation checks

- `GET https://help.kecktech.net` returns Next.js page with Kecktech header/nav.
- `GET https://help.kecktech.net/api/health` returns `{"status":"ok"}`.
- `POST https://help.kecktech.net/api/import/pages` without token returns token error.

## Migration execution prerequisites

To migrate existing BookStack content, provide:

- `BOOKSTACK_URL`
- `BOOKSTACK_TOKEN_ID`
- `BOOKSTACK_TOKEN_SECRET`
- `CUSTOM_WIKI_API_TOKEN`

Then run:

- `node custom-wiki/scripts/migrate-bookstack.js`

The migration script upserts hierarchy and pages through custom wiki import APIs.
