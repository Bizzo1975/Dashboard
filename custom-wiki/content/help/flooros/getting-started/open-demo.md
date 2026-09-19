# Open the FloorOS demo

**App:** FloorOS  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Launch FloorOS and orient to floor-plan / space management views in the demo.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Demo URL: https://flooros.kecktech.net
- Link also available from https://www.kecktech.net demos

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in FloorOS.

## Steps
1. Open FloorOS from the demos page or the direct URL.
2. Sign in with published demo credentials if the app is gated.
3. Land on the primary floor or spaces view.
4. Identify navigation for floors, rooms/zones, and status indicators.
5. Pan/zoom the floor visualization if the demo includes an interactive map.
6. Open a room/zone detail panel to see sample metadata (capacity, status, notes).

## Verify
A floor view renders and you can select at least one space/room without a blank screen.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for FloorOS from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
FloorOS demos floor-plan / space status workflows for facilities-style use cases. Rendering depends on modern browser canvas/WebGL support.

Canonical URLs:
- https://flooros.kecktech.net

## UI map
Know these landmarks before you start:

- Floor switcher / tabs
- Interactive map canvas
- Room/zone selection highlight
- Detail panel with status controls

## Audience notes
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Extensions blocking canvas/WebGL
- Editing on a read-only demo persona
- Assuming statuses persist across sandbox resets

## Kecktech tips
- Start on a floor that contains seeded rooms.
- Use clear demo notes like `DEMO maintenance`.
- Capture screenshots for sales follow-up rather than relying on sandbox state.

## Related
- [Update a space status](../how-to/update-space-status.md)
- [Floor plan not rendering](../troubleshoot/map-not-loading.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
