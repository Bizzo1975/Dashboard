# Cannot unlock Vaultwarden

**App:** Vaultwarden  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Recover from failed unlock, wrong server URL, or SSO edge issues.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Know whether you use web vault, browser extension, or mobile app
- Access to invite email if the account is new

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Vaultwarden.

## Steps
1. Confirm the client custom server URL is exactly `https://vault.kecktech.net`.
2. If Authelia challenges loop, finish https://auth.kecktech.net login, then reload the vault.
3. Master password failures: try your hint; staff cannot read your master password.
4. After rotating the master password on one device, sync that device online before updating others.
5. Extension stuck: log out, clear local vault data, log in again with email + master password (+ vault 2FA if enabled).
6. Invite expired? Ask staff to resend an organization invite from the Vaultwarden admin console.

## Verify
Vault unlocks and previously saved items are listed.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Vaultwarden from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Vaultwarden is Kecktech’s Bitwarden-compatible password manager for staff and shared client collections. The master password is never recoverable by admins.

Canonical URLs:
- https://vault.kecktech.net

## UI map
Know these landmarks before you start:

- Web vault item list with collection filters
- New item → Login / Secure Note / Card
- Organization Admin Console for collections and members
- Browser extension: set custom server URL before login

## Audience notes
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Pointing the official Bitwarden extension at bitwarden.com instead of vault.kecktech.net
- Storing shared client secrets only in My Vault
- Emailing master passwords or collection exports
- Losing TOTP for the vault account without backup codes

## Kecktech tips
- One collection per client company; name it consistently with RMM/ERP.
- Store RustDesk IDs and HaaS local admin creds on the client collection.
- Use read-only collection permissions for customers when they only need to view.

## Related
- [Create and unlock your vault](../getting-started/create-vault.md)
- [Store and share a login item](../how-to/share-login-item.md)
- [Manage organization collections](../admin/org-collections.md)
