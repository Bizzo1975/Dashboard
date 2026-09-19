# Deploy a Tactical RMM agent

**App:** Tactical RMM  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Install an agent under the correct client/site for monitoring and remote management.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Admin rights in RMM
- Local admin on the target Windows/Linux/Mac device
- Client and Site already created in RMM

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Tactical RMM.

## Steps
1. Sign in at https://rmm.kecktech.net.
2. Navigate to the Client → Site where the device belongs.
3. Use **Add Agent** / download the installer for that site (do not reuse another client’s installer).
4. Run the installer on the device with elevation.
5. Wait for the agent to appear Online in the Agents list.
6. Assign monitoring policies / automation as required for HaaS or MSP baselines.
7. Store hostname, agent ID, and local admin reference in the client’s Vaultwarden collection.
8. Document deployment in the HaaS or onboarding ticket.

## Verify
New agent is Online under the intended Client/Site and accepts a test script or inventory refresh.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Agent offline](../troubleshoot/agent-offline.md)
