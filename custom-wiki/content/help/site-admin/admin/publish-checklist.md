# Publish and review checklist

**App:** Site Admin CMS  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Ship website changes safely with review, links, and mobile checks.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Draft already saved in Site Admin
- Second reviewer available for material marketing changes

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Site Admin CMS.

## Steps
1. Re-read the edited sections for typos, broken brand names, and outdated phone numbers.
2. Click every CTA and internal link you changed; confirm demos still match `demos.json` / live demo apps.
3. Check desktop and a narrow mobile width before publish.
4. Publish using the CMS control (Publish/Go live—use the label shown in admin).
5. Verify https://www.kecktech.net (and the specific path) with a hard refresh.
6. Spot-check Help and Portal links still resolve.
7. Note the change in the related ticket or changelog channel.

## Verify
Public page matches the approved draft and no console/network errors block primary CTAs.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

## Common pitfalls
- Saving a draft and forgetting to publish
- Editing production claims (pricing/SLA) without approval
- 403s from missing admin group membership mistaken for app bugs

## Kecktech tips
- Use a second reviewer for homepage and pricing-adjacent copy.
- Check mobile width before publish.
- Link Help CTAs to https://help.kecktech.net articles when possible.

## Related
- [Sign in to Site Admin](../getting-started/sign-in-cms.md)
- [Edit a website page](../how-to/edit-a-page.md)
- [Cannot save or publish](../troubleshoot/cannot-save.md)
