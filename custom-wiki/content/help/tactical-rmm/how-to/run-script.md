# Run a script on a managed agent

**App:** Tactical RMM  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Execute an approved script or remote command on a single agent and capture output.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Online agent
- Permission to run scripts
- Change window / customer approval when required

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Tactical RMM.

## Steps
1. Open the target agent in Tactical RMM.
2. Choose **Run Script** (or the Scripts action in the agent toolbar).
3. Select a saved script from the library, or paste an approved one-off when policy allows.
4. Set run-as context (System vs logged-in user) and timeout.
5. Confirm the host name in the dialog before executing.
6. Watch the script results panel for stdout/stderr and exit code.
7. Paste a short summary into the related Zammad ticket and log time (SVC-MSP / SVC-REMOTE).

## Verify
Script result shows success exit code (or an understood non-zero with remediation next steps).

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Deploy an agent](../admin/deploy-agent.md)
- [Agent offline](../troubleshoot/agent-offline.md)
