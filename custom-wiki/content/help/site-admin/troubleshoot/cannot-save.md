# Cannot save or publish in Site Admin

**App:** Site Admin CMS  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Clear permission, session, and validation issues that block CMS saves.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Note any on-screen error toast or network status code
- Confirm you should have edit rights for that page

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Site Admin CMS.

## Steps
1. Re-authenticate via Authelia; expired sessions often fail saves with 401.
2. Check required fields—empty mandatory blocks can block save without a clear banner on some forms.
3. If you receive 403, confirm LLDAP group membership for site admins with an ops admin.
4. Try another browser profile to rule out extension interference.
5. If save works but public site is stale, purge/wait for CDN/cache and confirm you published—not only saved draft.
6. Escalate with HAR/screenshot to Internal tickets if API `/api` routes return 5xx.

## Verify
A small intentional edit saves and appears after publish on the public URL.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Publish and review checklist](../admin/publish-checklist.md)
