# Create and unlock your vault

**App:** Vaultwarden  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Access your Kecktech Vaultwarden vault and confirm you can store a login item.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Invitation email or staff-created account
- URL: https://vault.kecktech.net
- A strong master password you will not reuse elsewhere

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Vaultwarden.

## Steps
1. Open https://vault.kecktech.net. Complete Authelia if the edge requires SSO before the vault UI.
2. If invited: open the invite link, set your **master password**, and optionally a non-revealing hint.
3. If the account exists: enter vault email and master password, then unlock.
4. Recommended: install the Bitwarden browser extension, set server URL to the vault hostname above, and log in.
5. Create a temporary **Login** item named `Vault self-test`, save it, then delete after verify.
6. Configure vault timeout lock for your device trust level.

## Verify
Vault item list loads after unlock, and a new Login item saves without sync errors.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

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
- [Store and share a login item](../how-to/share-login-item.md)
- [Manage organization collections](../admin/org-collections.md)
- [Cannot unlock vault](../troubleshoot/cannot-unlock.md)
