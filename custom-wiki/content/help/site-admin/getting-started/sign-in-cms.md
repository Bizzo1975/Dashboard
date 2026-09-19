# Sign in to Site Admin

**App:** Site Admin CMS  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Reach the CMS dashboard used to edit www.kecktech.net pages.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Staff account in the admin group (Authelia/LLDAP)
- URL: https://admin.kecktech.net

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Site Admin CMS.

## Steps
1. Open https://admin.kecktech.net.
2. Complete Authelia login and 2FA if prompted.
3. Land on the Site Admin home / page list.
4. Confirm you can see editable pages such as Home and other site routes.
5. Open **Page → Home** (or `/page/home`) as a smoke check that the editor shell loads.

## Verify
You see the CMS navigation and at least one editable page entry without a 403.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Site Admin CMS from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Site Admin is the staff CMS for www.kecktech.net pages (example editor path `/page/home`). Changes are staff-only and Authelia-gated.

Canonical URLs:
- https://admin.kecktech.net

## UI map
Know these landmarks before you start:

- Page list / navigation to each editable route
- Editor fields/blocks for headlines, body, CTAs
- Save (draft) vs Publish/Go live controls
- Preview when offered by the CMS build

## Audience notes
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Saving a draft and forgetting to publish
- Editing production claims (pricing/SLA) without approval
- 403s from missing admin group membership mistaken for app bugs

## Kecktech tips
- Use a second reviewer for homepage and pricing-adjacent copy.
- Check mobile width before publish.
- Link Help CTAs to https://help.kecktech.net articles when possible.

## Related
- [Edit a page](../how-to/edit-a-page.md)
- [Publish and review checklist](../admin/publish-checklist.md)
- [Cannot save or publish](../troubleshoot/cannot-save.md)
