# Run a demo FarmBot sequence

**App:** FarmBot  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Execute a sample sequence in the demo to evaluate automation UX.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Demo role allowed to run sequences
- Confirmation that the instance is simulated or hardware-safe

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in FarmBot.

## Steps
1. Open **Sequences** (or equivalent).
2. Select a sample sequence such as water plants / move to home—prefer staff-provided safe demos.
3. Use **Run** / **Execute** once. Watch the log/ticker for step progress.
4. Do not edit motor steps on a live bot without training.
5. After completion, review the log for success/failure messages.
6. Reset demo state if the UI provides a sandbox reset.

## Verify
Sequence log shows completed steps without unhandled errors.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [FarmBot controls unresponsive](../troubleshoot/unresponsive.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
