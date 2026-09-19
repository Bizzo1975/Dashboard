# Open the n8n workflow editor

**App:** n8n  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Reach the n8n canvas so you can inspect or edit Kecktech automation workflows.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Ops/staff account allowed on n8n (Authelia + n8n user)
- URL: https://n8n.kecktech.net
- Tailscale or office network if the instance is restricted

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in n8n.

## Steps
1. Open https://n8n.kecktech.net.
2. Complete Authelia SSO if challenged.
3. Sign into n8n with your ops user if a second login is required.
4. From the left sidebar open **Workflows**. You should see named flows such as Zammad webhook → Twilio SMS.
5. Click a workflow to open the canvas. Nodes appear left-to-right with trigger → actions.
6. Use the editor toggle to switch between Editor and Executions without activating changes yet.

## Verify
A workflow canvas loads and you can select a node to view its parameters panel.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for n8n from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
n8n runs Kecktech automations (example: Zammad webhook → Twilio SMS for on-call). Treat Active workflows as production code.

Canonical URLs:
- https://n8n.kecktech.net

## UI map
Know these landmarks before you start:

- Workflows list → canvas editor
- Credentials manager (left menu)
- Executions history with Success/Error filters
- Node parameters + INPUT/OUTPUT JSON panels

## Audience notes
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Testing with real customer SMS storms
- Hard-coding secrets in Function nodes instead of Credentials
- Leaving duplicate workflows Active after experiments
- Ignoring 401s after token rotation

## Kecktech tips
- Use Listen for test event before activating webhook changes.
- Name credentials with environment suffixes (`-prod`).
- Document workflow purpose in the workflow Settings description field.

## Related
- [Test a webhook workflow](../how-to/test-webhook.md)
- [Manage credentials](../admin/manage-credentials.md)
- [Workflow executions failing](../troubleshoot/executions-failing.md)
