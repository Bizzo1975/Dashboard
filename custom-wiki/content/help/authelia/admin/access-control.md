# Adjust Authelia access control rules

**App:** Authelia  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Change which groups may access a protected domain and whether one- or two-factor is required.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Access to Authelia configuration (file/config volume) and ability to reload
- LLDAP groups such as `kecktech_admins`, `kecktech_ops`, `kecktech_customers`
- Change ticket for audit

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Authelia.

## Steps
1. Identify the domain (example: `admin.kecktech.net`) and current policy (bypass / one_factor / two_factor).
2. Edit access control rules so subject groups match intent (customers → portal; admins → infra).
3. Keep help.kecktech.net / public marketing bypass rules intact unless intentionally locking them down.
4. Validate YAML/config, deploy, and restart/reload Authelia carefully.
5. Test with a user in-group and a user out-of-group (expect 403 or denied).
6. Document the rule change and rollback snippet in the ticket.

## Verify
In-group user reaches the app with the expected factor count; out-of-group user is denied.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Stuck in login redirect loop](../troubleshoot/redirect-loop.md)
