# Find an article in the Help Center

**App:** Help Center (Wiki)  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Locate a how-to or troubleshooting article for a Kecktech app quickly.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Public access (login not required for most help content)
- URL: https://help.kecktech.net

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Help Center (Wiki).

## Steps
1. Open https://help.kecktech.net.
2. Use search with an app name + task (example: `vault unlock`, `zammad ticket`).
3. Or browse shelves/books by product (ERPNext, Portal, Vaultwarden, etc.).
4. Open a chapter such as Getting Started, How-to, or Troubleshoot.
5. Skim Goal and Prerequisites before following Steps.
6. Use Related links at the bottom to jump to sibling procedures.

## Verify
You open an article whose Goal matches the task you need to complete.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Searching only UI nicknames when articles use product names
- Editing production DB content without updating git markdown (drifts)
- Broken relative Related links after slug renames

## Kecktech tips
- Search `app + task` (`vault unlock`, `portal invoices`).
- Staff: run import with `--dry-run` before tokenized POSTs.
- File doc-fix tickets with the article URL and screenshot.

## Related
- [Suggest an article improvement](../how-to/suggest-improvement.md)
- [Import help content (staff)](../admin/import-content.md)
- [Search returns nothing useful](../troubleshoot/search-misses.md)
