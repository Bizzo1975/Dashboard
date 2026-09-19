# BookStack XLSX Import Runbook

## Prerequisites

- Configure `bookstack/.env` with BookStack API URL/token values.
- Place source catalog at `docs/kecktech-wiki-article-catalog.xlsx`.
- Place article markdown files under `bookstack/articles` using `KB-XXXX_slug.md` naming.

## Pilot (25 articles)

1. Dry-run pilot:
   - `npm run pilot -- --dry-run --pilot-limit=25`
2. Execute pilot:
   - `npm run pilot -- --pilot-limit=25`
3. Review reports:
   - `bookstack/reports/pilot-hierarchy-report.json`
   - `bookstack/reports/pilot-upload-report.json`

## Full rollout

1. Dry-run full import:
   - `npm run full-import -- --dry-run`
2. Execute full import:
   - `npm run full-import`
3. Review reports:
   - `bookstack/reports/full-hierarchy-report.json`
   - `bookstack/reports/full-upload-report.json`

## Acceptance checklist

- Uploaded count matches expected pilot/full batch size.
- No unexpected errors in `errors`.
- `skipped` entries are understood and tracked.
- Random article spot checks confirm chapter placement and rendering.
- Search in BookStack returns pilot articles by title and tag.
