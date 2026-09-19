# User cannot sign in via Authelia

**App:** LLDAP  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Fix directory issues that prevent Authelia from accepting a user login.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Username/email claimed by the user
- LLDAP admin access

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in LLDAP.

## Steps
1. In LLDAP, search the user; confirm the account exists and is not mistyped.
2. Verify group membership matches the Authelia access control rule for the target app.
3. Reset the password if lockout/forgotten password is likely; communicate via a secure channel.
4. Confirm email attribute is populated—some apps key off mail.
5. If password works in LLDAP bind tests but Authelia fails, check Authelia LDAP backend logs.
6. For 2FA-only failures, follow Authelia 2FA reset rather than deleting the user.

## Verify
User completes Authelia login and reaches the intended application.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Create a user and assign groups](../how-to/create-user.md)
- [Group naming and off-boarding](../admin/group-policy.md)
