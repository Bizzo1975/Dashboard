# Open Tactical RMM and find an agent

**App:** Tactical RMM  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Sign in to RMM and locate a managed agent under the correct client/site.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Tech account with RMM access
- URL: https://rmm.kecktech.net
- Client name and approximate hostname

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Tactical RMM.

## Steps
1. Open https://rmm.kecktech.net and complete Authelia if prompted.
2. Sign into Tactical RMM with your tech credentials.
3. In the left tree, expand **Clients → {Client} → Sites**.
4. Open **Agents** and sort/filter by hostname or last seen.
5. Click the agent to open the detail view (status, OS, patches, scripts).
6. Confirm the agent shows Online before attempting remote actions.

## Verify
Agent detail page loads and shows a recent check-in timestamp.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Running destructive scripts without a change window
- Assuming Offline means “safe to ignore” on HaaS devices
- Losing local admin/RustDesk fallback when RMM is down

## Kecktech tips
- Confirm Online check-in before remote actions.
- Log SVC-MSP / SVC-REMOTE time in the Zammad ticket.
- Store agent IDs with device records in Vaultwarden.

## Related
- [Run a remote script](../how-to/run-script.md)
- [Deploy an agent](../admin/deploy-agent.md)
- [Agent offline](../troubleshoot/agent-offline.md)
