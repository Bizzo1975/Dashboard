# Open the Cleaner demo

**App:** Cleaner  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Launch the Cleaner demo and understand its repo Quality flags and cleanup inbox concept.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Demo URL: https://cleaner.kecktech.net
- Demo credentials from the demos page if required

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Cleaner.

## Steps
1. Open Cleaner from the marketing demos list or direct URL.
2. Sign in if the demo is authenticated.
3. Find the schedule or job list for the sample property/client.
4. Open a job card to see status, assigned cleaner, and checklist items.
5. Note whether the demo emphasizes dispatcher view vs cleaner mobile view.

## Verify
You can open the schedule/job board and view a job detail.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Optimistic UI ticks that fail server-side validation
- Read-only demo role with no write permissions
- Board filters hiding the job you just completed

## Kecktech tips
- Complete the full checklist before marking Done when evaluating QA flows.
- Try both board and detail views after status changes.
- Ask staff which persona (dispatcher vs cleaner) the demo account represents.

## Related
- [Complete a cleaning checklist](../how-to/complete-checklist.md)
- [Jobs not updating](../troubleshoot/jobs-stuck.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
