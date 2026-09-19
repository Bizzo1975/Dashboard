# Open the FarmBot demo

**App:** FarmBot  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Launch the FarmBot demo UI and locate farm/device controls safely.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Demo URL: https://farmbot.kecktech.net
- Understand this may be a simulated farm—avoid assuming physical hardware moves unless staff confirm

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in FarmBot.

## Steps
1. Open FarmBot from the demos page or direct URL.
2. Sign in with demo credentials if required.
3. Find the farm map / device overview.
4. Locate controls for sequences, plants, or peripherals as exposed in the demo.
5. Read any warning banners about simulation vs real hardware.

## Verify
Farm overview loads and you can open the sequences or plants panel.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for FarmBot from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
FarmBot demo showcases farm device automation UX. Assume simulation unless staff confirm hardware is live—do not run untested motor sequences on a real bot.

Canonical URLs:
- https://farmbot.kecktech.net

## UI map
Know these landmarks before you start:

- Farm map / device overview
- Sequences list and editor
- Run/Execute controls
- Logs/ticker for step progress

## Audience notes
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Running move sequences on live hardware without training
- Interpreting a locked simulator as a UI bug
- Websocket drops looking like “buttons do nothing”

## Kecktech tips
- Prefer staff-designated safe sample sequences.
- Watch logs while evaluating—not only the map animation.
- Contact sales via the website for hardware deployments.

## Related
- [Run a demo sequence](../how-to/run-sequence.md)
- [FarmBot controls unresponsive](../troubleshoot/unresponsive.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
