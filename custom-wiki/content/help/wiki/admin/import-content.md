# Import help content from markdown

**App:** Help Center (Wiki)  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Push `content/help` articles into the wiki via the import APIs.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Repo checkout of custom-wiki with updated markdown
- Environment: `WIKI_URL` (default http://127.0.0.1:8080) and `WIKI_IMPORT_TOKEN`
- Token must exist as a valid API bearer token in the wiki database

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Help Center (Wiki).

## Steps
1. Review `content/help/manifest.json` for the articles you intend to load.
2. Ensure hierarchy route and pages route are reachable on the wiki instance.
3. From `custom-wiki`, run `node scripts/import-help-content.js` (add `--dry-run` first if desired).
4. The script POSTs `/api/import/hierarchy` per app/subcategory, then `/api/import/pages` with markdown bodies.
5. Confirm responses return shelf/book/chapter IDs and page IDs without 401/400 errors.
6. Open https://help.kecktech.net and spot-check a new article’s title and Related links.
7. Set reviewStatus to APPROVED in admin/review tooling when content is production-ready.

## Verify
A newly imported slug resolves under its book/chapter and renders sanitized HTML from markdown.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Help Center (Wiki) from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
The Help Center (custom wiki) hosts product documentation. Public readers browse shelves/books; staff import markdown from `content/help` via API.

Canonical URLs:
- https://help.kecktech.net

## UI map
Know these landmarks before you start:

- Search box on the home/header
- Shelves → Books (per app) → Chapters (getting-started, how-to, admin, troubleshoot)
- Article page with Goal, Prerequisites, Steps, Verify, Related
- Staff review/import tooling for draft vs approved pages

## Audience notes
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

## Common pitfalls
- Searching only UI nicknames when articles use product names
- Editing production DB content without updating git markdown (drifts)
- Broken relative Related links after slug renames

## Kecktech tips
- Search `app + task` (`vault unlock`, `portal invoices`).
- Staff: run import with `--dry-run` before tokenized POSTs.
- File doc-fix tickets with the article URL and screenshot.

## Related
- [Find an article](../getting-started/find-an-article.md)
- [Suggest an article improvement](../how-to/suggest-improvement.md)
- [Search returns nothing useful](../troubleshoot/search-misses.md)
