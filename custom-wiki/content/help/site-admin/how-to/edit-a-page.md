# Edit a website page

**App:** Site Admin CMS  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Change copy or content blocks on a marketing page and save the draft.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Signed into Site Admin
- Editor URL pattern: https://admin.kecktech.net/page/{slug}
- Approved copy from marketing/owner when changing public claims

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Site Admin CMS.

## Steps
1. Open https://admin.kecktech.net and sign in.
2. Select the page to edit (example: Home via `/page/home`).
3. Update the fields or blocks shown in the editor (headlines, body, CTAs, demo cards as applicable).
4. Keep brand voice consistent; do not invent pricing or SLA claims.
5. Click **Save** (or equivalent) to persist the draft.
6. Use preview if available, then follow the publish checklist before making changes live.
7. After publish, open https://www.kecktech.net on the matching path and hard-refresh.

## Verify
Saved content reloads in the editor, and the public page shows the update after publish/cache refresh.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Publish and review checklist](../admin/publish-checklist.md)
- [Cannot save or publish](../troubleshoot/cannot-save.md)
