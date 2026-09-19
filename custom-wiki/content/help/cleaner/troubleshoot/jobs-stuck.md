# Cleaner jobs not updating

**App:** Cleaner  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Unstick the demo when checklist ticks or status changes do not persist.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Network connectivity
- Active demo session

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Cleaner.

## Steps
1. Watch for failed network requests after save; retry once online.
2. Refresh the job detail—UI may be optimistic while API rejected validation.
3. Ensure you are not on a read-only demo persona.
4. Try another job; a single corrupt sample record should not block evaluation.
5. After a platform redeploy, re-login and use freshly seeded jobs.

## Verify
A checklist change remains after refresh.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Complete a cleaning checklist](../how-to/complete-checklist.md)
- [Website contact form](../../website/how-to/contact-form.md)
