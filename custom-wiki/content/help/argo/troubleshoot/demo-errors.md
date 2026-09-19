# ARGO demo errors

**App:** ARGO  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Work around validation failures, stale sessions, and hosting blips in the ARGO demo.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Screenshot of the error
- Time of failure

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ARGO.

## Steps
1. Read validation messages—required fields often block save.
2. Sign out/in if you receive 401 after idle time.
3. Retry create with simpler ASCII field values if you hit encoding edge cases.
4. Clear site data if the UI shows mixed old/new schemas after a redeploy.
5. Persistent 5xx: report via https://www.kecktech.net contact or support ticket with URL + time.

## Verify
You can create or open a sample record without an error toast.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for ARGO from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
ARGO is a Kecktech demo operations app. Use `DEMO-` prefixes on sample records so resets and reviews stay obvious.

Canonical URLs:
- https://argo.kecktech.net

## UI map
Know these landmarks before you start:

- Home dashboard widgets
- Primary list (orders/jobs/assets depending on build)
- Create/New form with validation
- Record detail with edit/save

## Audience notes
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Idle sessions returning 401 mid-form
- Validation errors mistaken for outages
- Mixing staging expectations with the public demo host

## Kecktech tips
- Keep sample data obviously fake.
- Screenshot the create→list path for stakeholder reviews.
- Report 5xx with timestamp via contact/support.

## Related
- [Open the ARGO demo](../getting-started/open-demo.md)
- [Create a sample record](../how-to/create-sample-record.md)
- [Website contact form](../../website/how-to/contact-form.md)
