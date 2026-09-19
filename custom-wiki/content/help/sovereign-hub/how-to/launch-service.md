# Launch a linked service from the hub

**App:** Sovereign Hub  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Use Sovereign Hub navigation to open a downstream app with the correct context.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Working hub session
- Permission on the target service

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Sovereign Hub.

## Steps
1. From hub home, select the service tile/card you need.
2. If prompted, complete an additional consent or project picker.
3. Confirm the URL you land on matches the expected kecktech.net (or documented) host.
4. Perform a minimal action in the target app to ensure the session is valid.
5. Use hub back-navigation or your bookmark to return without stacking duplicate SSO loops.

## Verify
Target service loads under your user and reflects the project/context you selected.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Manage hub catalog entries](../admin/manage-catalog.md)
- [Hub tile failures](../troubleshoot/tile-failures.md)
