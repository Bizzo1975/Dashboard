# Create a user and assign groups

**App:** LLDAP  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Provision an LLDAP user with the correct group so Authelia and apps authorize them.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Directory admin access
- Legal name, username pattern `firstname.lastname`, and email
- Target group (customers vs ops vs admins)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in LLDAP.

## Steps
1. Go to **Users → Create User**.
2. Set username (lowercase), email, display name, and a strong temporary password.
3. Save the user, then open the user detail page.
4. Add to group: `kecktech_customers` for portal users; never add customers to `kecktech_admins` or `kecktech_ops`.
5. Store credentials in the appropriate Vaultwarden collection.
6. Optionally create matching Zammad customer and verify ERPNext customer linkage via the onboarding wizard at https://dashboard.kecktech.net/ops/onboarding.
7. Have the user complete Authelia first login + 2FA as required.

## Verify
User appears in the group membership list and can authenticate at https://auth.kecktech.net.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for LLDAP from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
LLDAP is the lightweight directory behind Authelia. Creating users and assigning groups is the source of truth for who can reach portal vs ops apps.

Canonical URLs:
- https://lldap.kecktech.net

## UI map
Know these landmarks before you start:

- Users list + Create User
- Groups membership editor
- User detail attributes (mail, display name)
- Admin login distinct from normal app SSO users

## Audience notes
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Adding customers to `kecktech_admins` / `kecktech_ops`
- Username typos (`First.Last` vs `first.last`)
- Off-boarding in apps but leaving LLDAP groups intact

## Kecktech tips
- Prefer the dashboard onboarding wizard when provisioning customers.
- Keep emails aligned with Zammad and ERPNext contacts.
- Store temporary passwords only in Vaultwarden collections.

## Related
- [Open the LLDAP admin console](../getting-started/admin-console.md)
- [Group naming and off-boarding](../admin/group-policy.md)
- [User cannot sign in via Authelia](../troubleshoot/user-auth-fail.md)
