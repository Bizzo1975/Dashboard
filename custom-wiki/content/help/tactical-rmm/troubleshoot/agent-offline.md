# Tactical RMM agent offline

**App:** Tactical RMM  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Diagnose why an agent stopped checking in and restore monitoring.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Client contact path for on-site power/network checks
- Vaultwarden item for device admin / RustDesk ID if unattended access fails

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Tactical RMM.

## Steps
1. Confirm last check-in time on the agent page and whether other agents at that site are online.
2. If the whole site is offline, suspect ISP/firewall; contact the client for WAN status.
3. If only one device: ask whether it is powered on, sleeping, or off-domain VPN.
4. Attempt RustDesk or take-control recovery if credentials exist.
5. On the device, verify the Tactical RMM service is running and can reach the RMM URL.
6. Reinstall the agent only after confirming you have the correct client/site installer from RMM.
7. After recovery, confirm check-in and review missed patches/alerts.

## Verify
Agent status returns to Online with a fresh check-in within a few minutes.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Tactical RMM from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Tactical RMM provides agent monitoring, scripting, and remote tools for MSP/HaaS devices. Installers are site-specific—never reuse another client’s agent package.

Canonical URLs:
- https://rmm.kecktech.net

## UI map
Know these landmarks before you start:

- Clients → Sites → Agents tree
- Agent detail: status, patches, scripts, take control / remote background
- Script library and Run Script dialog (run-as + timeout)
- Alerts/policies assigned at client or site level

## Audience notes
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Running destructive scripts without a change window
- Assuming Offline means “safe to ignore” on HaaS devices
- Losing local admin/RustDesk fallback when RMM is down

## Kecktech tips
- Confirm Online check-in before remote actions.
- Log SVC-MSP / SVC-REMOTE time in the Zammad ticket.
- Store agent IDs with device records in Vaultwarden.

## Related
- [Open RMM and find an agent](../getting-started/open-rmm.md)
- [Run a remote script](../how-to/run-script.md)
- [Deploy an agent](../admin/deploy-agent.md)
