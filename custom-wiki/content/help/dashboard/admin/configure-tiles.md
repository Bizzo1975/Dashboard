# Configure dashboard tiles

**App:** Apps Dashboard  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Add or update app tiles and visibility so each group sees the right launchers.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Dashboard admin access
- Final HTTPS URL and required Authelia groups

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Apps Dashboard.

## Steps
1. Open dashboard admin/configuration for tiles (as implemented in the Kecktech dashboard).
2. Create/edit a tile: title, icon, target URL, sort order, and audience groups.
3. Use canonical hosts (`erp.kecktech.net`, `tickets.kecktech.net`, `vault.kecktech.net`, etc.).
4. Hide infra tiles from customer groups.
5. Save and verify with a test user in each affected group.
6. Announce non-trivial launcher changes in staff chat.

## Verify
Test users only see permitted tiles and each tile hits the correct healthy URL.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

## Common pitfalls
- Bookmarks to raw hosts drifting from canonical tiles
- Customers seeing infra tiles due to wrong group visibility
- 403 on a tile misread as dashboard outage

## Kecktech tips
- Use the dashboard daily so SSO and links stay consistent.
- Canonical hosts: erp, tickets/support, vault, admin, rmm, portal, help.
- Report wrong tile URLs with expected vs actual hostname.

## Related
- [Use Apps Dashboard tiles](../getting-started/use-app-tiles.md)
- [Find ops tools on the dashboard](../how-to/find-ops-tools.md)
- [Tile opens wrong app or 403](../troubleshoot/tile-403.md)
