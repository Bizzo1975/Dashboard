# Manage organization collections

**App:** Vaultwarden  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Create client collections and grant least-privilege access for staff and customers.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Organization Owner or Admin
- URL: https://vault.kecktech.net
- Naming convention: one collection per client company

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Vaultwarden.

## Steps
1. Sign in with an org admin account.
2. Open Admin Console / Organization settings for the Kecktech org.
3. Create a Collection named after the client. Use Read only for customers who should view but not edit.
4. Assign staff users with Can edit or Can view as appropriate.
5. Invite a new customer by email, require master password setup, then assign only their client collection.
6. Create Login items for portal, HaaS device admin, and RustDesk ID notes in that collection.
7. On off-boarding, remove the user from the collection or disable the user.

## Verify
A test staff account sees only intended collections; a removed user loses visibility after re-login.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Cannot unlock vault](../troubleshoot/cannot-unlock.md)
