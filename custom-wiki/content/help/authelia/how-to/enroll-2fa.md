# Enroll or reset Authelia 2FA

**App:** Authelia  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Register TOTP (or complete a staff-assisted reset) so two-factor apps accept your login.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Working password login
- Authenticator app on your phone
- Staff help if you lost all second factors

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Authelia.

## Steps
1. Open https://auth.kecktech.net and sign in with username/password.
2. Open the security / 2FA settings from the Authelia authenticated portal (or follow the enrollment prompt).
3. Scan the TOTP QR code with your authenticator app.
4. Enter the 6-digit code to confirm enrollment.
5. Save recovery/backup codes in your Vaultwarden vault—not in plain email.
6. If locked out: contact Kecktech support; staff reset 2FA in Authelia/LLDAP process, then you re-enroll.

## Verify
A fresh login to a two-factor resource accepts password + TOTP and lands in the app.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Authelia from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Authelia provides SSO and 2FA in front of protected Kecktech apps. Identities come from LLDAP groups such as `kecktech_customers`, `kecktech_ops`, and `kecktech_admins`.

Canonical URLs:
- https://auth.kecktech.net

## UI map
Know these landmarks before you start:

- Login form (username/password)
- TOTP / 2FA challenge
- Authenticated portal security settings for enrollment
- Redirect back to the original app after success

## Audience notes
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Clock skew breaking TOTP (looks like a redirect loop)
- Stale cookies across auth + app hosts
- Expecting customer one-factor access on two-factor-only admin hosts

## Kecktech tips
- Store TOTP backup codes in Vaultwarden.
- Portal customers generally use one-factor where policy allows; admins should expect 2FA.
- Access control changes require config reload and paired LLDAP group updates.

## Related
- [First Authelia SSO login](../getting-started/first-login.md)
- [Adjust access control rules](../admin/access-control.md)
- [Stuck in login redirect loop](../troubleshoot/redirect-loop.md)
