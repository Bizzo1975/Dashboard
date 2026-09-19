# Manage Sovereign Hub catalog entries

**App:** Sovereign Hub  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Add or update hub tiles so users reach the right URLs with correct visibility.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Hub admin role
- Final URL and audience (staff vs customer)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Sovereign Hub.

## Steps
1. Open hub admin/catalog settings.
2. Create or edit a tile: title, description, icon, target URL, and sort order.
3. Limit visibility to groups that should see the tile.
4. Point production tiles at production hosts only—never mix staging URLs silently.
5. Save and verify with a non-admin test user in the intended group.
6. Remove retired services instead of leaving broken links.

## Verify
Test user sees the tile and lands on the correct authenticated app.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Sovereign Hub from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Sovereign Hub aggregates launchers/resources for related services. Broken tiles are often downstream outages or stale catalog URLs.

Canonical URLs:
- https://sovereign-hub.kecktech.net

## UI map
Know these landmarks before you start:

- Hub home tile/catalog grid
- Project or context picker when enabled
- Admin catalog settings for tile URLs and visibility
- Deep link into target services

## Audience notes
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

## Common pitfalls
- Staging URLs left on production tiles
- Tiles visible to groups that lack Authelia access to the target
- SSO loops when hub and target both challenge awkwardly

## Kecktech tips
- Verify tiles with a non-admin user in the target group.
- Remove retired services instead of leaving 404 tiles.
- Keep titles aligned with Help Center app names when possible.

## Related
- [Open Sovereign Hub](../getting-started/open-hub.md)
- [Launch a linked service](../how-to/launch-service.md)
- [Hub tile failures](../troubleshoot/tile-failures.md)
