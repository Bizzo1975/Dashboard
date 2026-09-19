# Connect to a remote RustDesk ID

**App:** RustDesk  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Start a support session to a client device using its RustDesk ID.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- RustDesk installed on your workstation
- Client ID (from Vaultwarden or the live session)
- Client available to share OTP / approve connection

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in RustDesk.

## Steps
1. Open RustDesk on your tech workstation.
2. Retrieve the client ID from the ticket or Vaultwarden item `RustDesk ID — {Client}`.
3. Enter the ID in **Control Remote Desktop** and click connect.
4. Enter the password/OTP the client provides, or use the stored permanent password only when policy allows unattended access.
5. Wait for the interactive accept if the client side requires it.
6. Perform support work; narrate invasive steps.
7. Disconnect, then log time in Zammad (SVC-REMOTE).

## Verify
You see the remote desktop and input control works for the session duration.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for RustDesk from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
RustDesk is used for interactive remote support. MSP unattended access may also use Tactical RMM. Client IDs are often stored in Vaultwarden.

Canonical URLs:
- https://rustdesk.kecktech.net
- https://rustdesk.com/download

## UI map
Know these landmarks before you start:

- Home screen showing your ID and Ready state
- Control Remote Desktop ID entry
- Settings → Network for custom ID/relay servers when instructed
- Incoming connection Accept prompt on the client side

## Audience notes
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Transposed IDs
- Mismatched custom server settings between tech and client
- Leaving permanent passwords in place against policy after a session

## Kecktech tips
- Prefer one-time passwords for ad-hoc support.
- Put the ID in the Zammad ticket for the assigned tech.
- Fall back to RMM take-control on managed devices when P2P fails.

## Related
- [Install the RustDesk client](../getting-started/install-client.md)
- [Connection fails or is rejected](../troubleshoot/cannot-connect.md)
- [Remote support procedures context](../../tactical-rmm/getting-started/open-rmm.md)
