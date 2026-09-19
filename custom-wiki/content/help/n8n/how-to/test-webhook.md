# Test a webhook-triggered workflow

**App:** n8n  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Safely fire a test execution for a webhook workflow (for example Zammad → SMS) and confirm success.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Editor access to the target workflow
- Permission to send a test event (or use n8n Listen for test event)
- Understanding of whether the workflow is Active in production

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in n8n.

## Steps
1. Open the workflow. Note whether it is **Active** (production) before testing.
2. Select the Webhook (or Zammad Trigger) node. Copy the Test URL if you will POST manually.
3. Click **Listen for test event** on the trigger node when available.
4. Send a safe synthetic payload (prefer staging ticket IDs). Never spam real customer SMS without intent.
5. Watch the node turn green and inspect JSON output in the OUTPUT panel.
6. Step through downstream nodes (IF, HTTP Request, Twilio). Confirm credentials resolve.
7. Open **Executions** and confirm the run shows Success with expected branch taken.
8. Deactivate experimental copies; leave only reviewed workflows Active.

## Verify
Executions list shows a successful run with the expected Twilio/HTTP response body.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Open the workflow editor](../getting-started/open-editor.md)
- [Manage credentials](../admin/manage-credentials.md)
- [Workflow executions failing](../troubleshoot/executions-failing.md)
