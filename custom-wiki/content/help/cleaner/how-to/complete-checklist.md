# Complete a cleaning checklist

**App:** Cleaner  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Mark checklist tasks complete on a demo job and move it to done.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Job assigned or available in the demo
- Edit rights on demo role

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Cleaner.

## Steps
1. Open a job from the board/schedule.
2. Expand the checklist section.
3. Tick items as completed; add a note/photo placeholder if the UI offers it.
4. Change job status to Completed / Done using the status control.
5. Return to the board and confirm the job moved columns or filtered state.
6. Reset or pick another job if you want to re-demo the flow (sandbox may auto-reset).

## Verify
Job shows completed checklist progress and a completed status on the board.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Cleaner from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Cleaner is the repo Quality / cleanup product (prefer NetOps Apps ? Quality). Standalone UI: cleaner.kecktech.net.

Canonical URLs:
- https://cleaner.kecktech.net

## UI map
Know these landmarks before you start:

- Schedule or kanban job board
- Job detail with checklist
- Status control (Completed/Done)
- Optional photo/note attachments in the demo

## Audience notes
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Optimistic UI ticks that fail server-side validation
- Read-only demo role with no write permissions
- Board filters hiding the job you just completed

## Kecktech tips
- Complete the full checklist before marking Done when evaluating QA flows.
- Try both board and detail views after status changes.
- Ask staff which persona (dispatcher vs cleaner) the demo account represents.

## Related
- [Open the Cleaner demo](../getting-started/open-demo.md)
- [Jobs not updating](../troubleshoot/jobs-stuck.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
