# Use Apps Dashboard tiles

**App:** Apps Dashboard  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Open Kecktech apps from the central dashboard tiles after SSO.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Staff or authorized user account
- URL: https://dash.kecktech.net (alias: https://dashboard.kecktech.net)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Apps Dashboard.

## Steps
1. Open https://dash.kecktech.net (or https://dashboard.kecktech.net).
2. Complete Authelia login and 2FA if required.
3. Review the tile grid. Each tile launches an app (ERP, tickets, vault, admin, RMM, etc.).
4. Click a tile you are allowed to use. A new tab/window may open.
5. If a tile is missing, you may lack group membership—ask ops rather than bookmarking raw hosts inconsistently.
6. Use the dashboard as your daily launcher to keep SSO sessions predictable.

## Verify
At least two tiles open their target apps under your user without 403.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Apps Dashboard from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
The Apps Dashboard is the staff launcher for Kecktech systems after Authelia. Ops tooling such as the onboarding wizard may live under `/ops/...` on this host.

Canonical URLs:
- https://dash.kecktech.net
- https://dashboard.kecktech.net

## UI map
Know these landmarks before you start:

- Tile grid of applications
- Optional ops section / onboarding wizard entry
- User session identity via Authelia
- Admin configuration for tile URLs and group visibility

## Audience notes
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Bookmarks to raw hosts drifting from canonical tiles
- Customers seeing infra tiles due to wrong group visibility
- 403 on a tile misread as dashboard outage

## Kecktech tips
- Use the dashboard daily so SSO and links stay consistent.
- Canonical hosts: erp, tickets/support, vault, admin, rmm, portal, help.
- Report wrong tile URLs with expected vs actual hostname.

## Related
- [Pin and find ops tools](../how-to/find-ops-tools.md)
- [Configure dashboard tiles](../admin/configure-tiles.md)
- [Tile opens wrong app or 403](../troubleshoot/tile-403.md)
