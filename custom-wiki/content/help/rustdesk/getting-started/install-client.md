# Install the RustDesk client

**App:** RustDesk  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Install RustDesk and prepare your ID for Kecktech remote support sessions.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Permission to install software on the device
- Download from https://rustdesk.com/download (or installer provided by Kecktech)
- Optional self-hosted signal/relay: configure only if staff instructs

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in RustDesk.

## Steps
1. Download the RustDesk client for your OS.
2. Install and launch RustDesk. Note your **ID** on the home screen.
3. Set a one-time or permanent password per staff guidance (prefer one-time for ad-hoc support).
4. If Kecktech provides a custom server/key, open **Settings → Network** and enter the ID/relay server details from your ticket.
5. Send your RustDesk ID to the technician through the support ticket (not via public social media).
6. Stay at the PC to approve the incoming connection prompt.

## Verify
RustDesk shows your ID and Ready status; you can accept a test connection from Kecktech.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Transposed IDs
- Mismatched custom server settings between tech and client
- Leaving permanent passwords in place against policy after a session

## Kecktech tips
- Prefer one-time passwords for ad-hoc support.
- Put the ID in the Zammad ticket for the assigned tech.
- Fall back to RMM take-control on managed devices when P2P fails.

## Related
- [Connect to a remote ID](../how-to/connect-remote.md)
- [Connection fails or is rejected](../troubleshoot/cannot-connect.md)
- [Open a support ticket](../../zammad/getting-started/open-a-ticket.md)
