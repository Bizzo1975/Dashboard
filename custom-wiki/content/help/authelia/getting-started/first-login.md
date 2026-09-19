# Complete your first Authelia SSO login

**App:** Authelia  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Authenticate once so protected Kecktech apps open for your session.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Account exists in LLDAP
- Authelia portal: https://auth.kecktech.net
- App URL such as https://dash.kecktech.net or https://portal.kecktech.net

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Authelia.

## Steps
1. Open a protected app (example: https://dash.kecktech.net).
2. You are redirected to Authelia.
3. Enter your username and password (LLDAP credentials).
4. If prompted to register 2FA, enroll an authenticator app (TOTP) and store backup codes in Vaultwarden.
5. Complete the 2FA challenge when one-factor is insufficient for that resource policy.
6. Authelia redirects you back to the original application.

## Verify
Refreshing the app no longer forces a full login for the SSO session lifetime.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Clock skew breaking TOTP (looks like a redirect loop)
- Stale cookies across auth + app hosts
- Expecting customer one-factor access on two-factor-only admin hosts

## Kecktech tips
- Store TOTP backup codes in Vaultwarden.
- Portal customers generally use one-factor where policy allows; admins should expect 2FA.
- Access control changes require config reload and paired LLDAP group updates.

## Related
- [Enroll or reset 2FA](../how-to/enroll-2fa.md)
- [Adjust access control rules](../admin/access-control.md)
- [Stuck in login redirect loop](../troubleshoot/redirect-loop.md)
