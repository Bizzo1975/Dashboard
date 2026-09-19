# Group naming and off-boarding

**App:** LLDAP  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Keep LLDAP groups consistent and revoke access cleanly when people leave.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Directory admin
- Off-boarding ticket with last day

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in LLDAP.

## Steps
1. Use standard groups only: `kecktech_customers`, `kecktech_ops`, `kecktech_admins` (plus any documented specialty groups).
2. Do not create ad-hoc groups without updating Authelia access control.
3. On off-boarding: remove group memberships, disable or delete the user per policy.
4. Revoke Vaultwarden collection access and set Zammad user inactive.
5. Confirm Authelia denies login within a minute of directory change (or after session expiry).
6. Check the onboarding wizard / inventory so ERP/portal linkages are noted historically.

## Verify
Former user’s password no longer opens protected apps; shared vault items are not customer-accessible.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [User cannot sign in via Authelia](../troubleshoot/user-auth-fail.md)
