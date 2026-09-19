# Create a sample record in ARGO

**App:** ARGO  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Walk the happy-path create flow so you can evaluate ARGO data entry UX.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Signed into the demo
- Create permission on the demo role

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ARGO.

## Steps
1. From the dashboard, open the primary list (orders, jobs, or assets—use the label shown).
2. Click **New** / **Create**.
3. Fill required fields with clearly fake demo data (prefix names with `DEMO-`).
4. Save and open the record detail view.
5. Edit one field and save again to test update UX.
6. Return to the list and confirm sort/search finds your `DEMO-` record.

## Verify
The new record opens by ID/name and appears in list search.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [ARGO demo errors](../troubleshoot/demo-errors.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
