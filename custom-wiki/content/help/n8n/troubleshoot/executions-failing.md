# Workflow executions failing

**App:** n8n  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Find the failing node, fix credentials or payload shape, and restore reliable automation.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Access to Executions history
- Knowledge of which external API failed (Zammad, Twilio, Graph, etc.)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in n8n.

## Steps
1. Open **Executions**, filter Error, and open the latest failed run.
2. Click the red node. Read the error message and HTTP status (401, 403, 404, 429, 5xx).
3. 401/403: open **Credentials**, re-test the credential, rotate tokens stored in Vaultwarden if expired.
4. Expression errors: compare incoming JSON to the expressions under the node (typos in `$json` paths).
5. Timeouts: check whether the downstream API is up; increase timeout only after confirming the API is healthy.
6. For webhook workflows that never run: confirm Active state and that Traefik routes `${url}` correctly.
7. After fix, re-run with a controlled test payload and document the root cause in the related ticket.

## Verify
A new execution completes with Success and side effects (SMS, ticket note) occur as designed.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Test a webhook workflow](../how-to/test-webhook.md)
- [Manage credentials](../admin/manage-credentials.md)
