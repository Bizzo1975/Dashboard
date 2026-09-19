# Open the ARGO demo

**App:** ARGO  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Launch the ARGO demo and locate its primary operational dashboard.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Demo URL: https://argo.kecktech.net
- Demos page for current access notes

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ARGO.

## Steps
1. Open ARGO from https://www.kecktech.net demos or the direct hostname.
2. Authenticate with demo credentials when prompted.
3. Identify the home dashboard: KPIs, queues, or job/order cards depending on the build.
4. Open the main navigation to see modules showcased in the demo.
5. Read any on-screen demo banner so you know which features are simulated.

## Verify
Dashboard widgets load and navigation between two modules works.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Idle sessions returning 401 mid-form
- Validation errors mistaken for outages
- Mixing staging expectations with the public demo host

## Kecktech tips
- Keep sample data obviously fake.
- Screenshot the create→list path for stakeholder reviews.
- Report 5xx with timestamp via contact/support.

## Related
- [Create a sample record](../how-to/create-sample-record.md)
- [ARGO demo errors](../troubleshoot/demo-errors.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
