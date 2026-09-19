# RustDesk connection fails

**App:** RustDesk  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Fix common ID, password, network, and custom-server issues that block remote sessions.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Both parties online
- Correct RustDesk ID

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in RustDesk.

## Steps
1. Confirm both sides run compatible RustDesk versions and show Ready/Online.
2. Re-read the ID carefully; IDs are easy to transpose.
3. If using a custom Kecktech server, verify Network settings match staff instructions on both sides.
4. Disable VPN conflicts temporarily; some VPNs block P2P/relay.
5. Ensure the client clicks Accept on the connection prompt.
6. Try a new one-time password if authentication fails.
7. Fallback: schedule Tactical RMM take-control for MSP-managed devices.

## Verify
A new connection attempt reaches the Accept prompt and establishes desktop video.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Connect to a remote ID](../how-to/connect-remote.md)
- [Open a support ticket](../../zammad/getting-started/open-a-ticket.md)
