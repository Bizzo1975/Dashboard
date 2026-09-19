# Update a space status in FloorOS

**App:** FloorOS  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Change a room/zone status (available, occupied, maintenance) in the demo workflow.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Access to an editable demo floor
- Understanding that demo data may reset

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in FloorOS.

## Steps
1. Open the floor view and select the target room/zone.
2. Open the detail / edit panel.
3. Change status using the control provided (dropdown or buttons).
4. Add an optional note (example: `Demo maintenance window`).
5. Save. Confirm the floor color/icon updates to match the new status.
6. Switch floors if available and return to ensure the change persisted for the session.

## Verify
Selected space shows the new status in both the detail panel and the floor overview.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Extensions blocking canvas/WebGL
- Editing on a read-only demo persona
- Assuming statuses persist across sandbox resets

## Kecktech tips
- Start on a floor that contains seeded rooms.
- Use clear demo notes like `DEMO maintenance`.
- Capture screenshots for sales follow-up rather than relying on sandbox state.

## Related
- [Open the FloorOS demo](../getting-started/open-demo.md)
- [Floor plan not rendering](../troubleshoot/map-not-loading.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
