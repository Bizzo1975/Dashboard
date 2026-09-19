# Stuck in Authelia redirect loop

**App:** Authelia  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Break SSO redirect loops between an app and auth.kecktech.net.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Affected app URL
- Ability to clear site cookies

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Authelia.

## Steps
1. Stop rapid refreshes; open a private window.
2. Sign out explicitly at https://auth.kecktech.net if a session exists.
3. Clear cookies for `auth.kecktech.net` and the target app hostname.
4. Confirm device clock is correct (TOTP fails when skewed and may look like a loop).
5. Retry the app URL once. Complete password + 2FA deliberately.
6. If only one app loops, report possible misconfigured forward-auth middleware for that router.
7. If all apps fail, treat as auth outage and open a high-priority ticket.

## Verify
You reach the app UI once and subsequent navigations stay authenticated.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Enroll or reset 2FA](../how-to/enroll-2fa.md)
- [Adjust access control rules](../admin/access-control.md)
