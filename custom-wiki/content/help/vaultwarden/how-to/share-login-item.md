# Store and share a login item

**App:** Vaultwarden  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Save credentials into the correct collection so teammates can access them securely.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Unlocked vault
- Membership in the target Organization/Collection
- URL: https://vault.kecktech.net

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Vaultwarden.

## Steps
1. Unlock the web vault or browser extension pointed at the Kecktech server.
2. Click **New item** → **Login**.
3. Fill Name, Username, Password, and URI (example: https://portal.kecktech.net).
4. Under Ownership/Collections, select the client collection. Do not leave shared client secrets only in My Vault.
5. Add notes for RustDesk IDs, serials, or recovery codes when relevant.
6. Save and confirm the item appears under the collection filter.
7. Customer access requires an org admin to grant the collection—never email the vault master password.

## Verify
Another collection member can unlock and view the item.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Manage organization collections](../admin/org-collections.md)
- [Cannot unlock vault](../troubleshoot/cannot-unlock.md)
