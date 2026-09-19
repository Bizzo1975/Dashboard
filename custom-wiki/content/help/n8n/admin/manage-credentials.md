# Manage n8n credentials

**App:** n8n  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Create and rotate API credentials used by workflows without embedding secrets in node parameters.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- n8n owner/admin rights
- Secret values available from Vaultwarden (Twilio, Graph, Zammad token, etc.)
- URL: https://n8n.kecktech.net

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in n8n.

## Steps
1. In n8n open **Credentials** from the left menu.
2. Create a credential type matching the node (Header Auth, OAuth2, Twilio API, etc.).
3. Paste secrets from Vaultwarden; never commit them to git or paste into public ticket replies.
4. Name credentials clearly (`twilio-prod`, `zammad-webhook-token`).
5. Open a workflow node and select the credential from the dropdown instead of hard-coding.
6. Use **Test** / execute a single node where the UI allows it.
7. On rotation: update the credential object once; all linked workflows pick up the new secret.
8. Remove unused credentials quarterly to reduce blast radius.

## Verify
A dependent workflow execution succeeds after selecting the new credential.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Workflow executions failing](../troubleshoot/executions-failing.md)
