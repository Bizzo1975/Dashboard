# FarmBot controls unresponsive

**App:** FarmBot  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Recover when the demo UI loads but run controls do nothing.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Browser console access helpful but optional

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in FarmBot.

## Steps
1. Confirm you are still authenticated; re-login if buttons no-op.
2. Check whether another demo user locked the device/simulator.
3. Refresh after waiting for a previously running sequence to finish.
4. Try a different sample sequence; one corrupt definition should not block all demos.
5. If websockets fail, try another network; report persistent outages via the contact form.

## Verify
A sample sequence starts and emits log lines.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Running move sequences on live hardware without training
- Interpreting a locked simulator as a UI bug
- Websocket drops looking like “buttons do nothing”

## Kecktech tips
- Prefer staff-designated safe sample sequences.
- Watch logs while evaluating—not only the map animation.
- Contact sales via the website for hardware deployments.

## Related
- [Open the FarmBot demo](../getting-started/open-demo.md)
- [Run a demo sequence](../how-to/run-sequence.md)
- [Website contact form](../../website/how-to/contact-form.md)
