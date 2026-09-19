# Floor plan not rendering

**App:** FloorOS  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Recover when FloorOS shows a blank map or stuck loading indicator.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Modern browser with WebGL/canvas enabled
- Demo credentials

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in FloorOS.

## Steps
1. Hard refresh and retry in a private window.
2. Disable extensions that block canvas/WebGL.
3. Confirm you are on the correct floor tab; some demos hide empty floors.
4. Check browser console only if you are technical—capture errors for a support ticket.
5. If the API layer fails (endless spinner), the demo backend may be redeploying; wait and retry.
6. Use the website contact form if the demo stays down during a sales evaluation.

## Verify
Floor geometry/tiles render and space selection highlights a region.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Update a space status](../how-to/update-space-status.md)
- [Website contact form](../../website/how-to/contact-form.md)
