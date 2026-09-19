# Inspect logs for a container

**App:** Portainer  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Pull recent container logs to diagnose an application error.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Access to the environment
- Container/service name

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Portainer.

## Steps
1. Open the environment → **Containers**.
2. Select the container (example: wiki, n8n, traefik).
3. Open the **Logs** tab. Enable auto-refresh if you are reproducing live.
4. Increase line count or download logs for ticket attachments.
5. Correlate timestamps with Traefik access errors or user-reported times.
6. Avoid pasting secrets from logs into public channels; redact tokens.

## Verify
You captured log lines that include the error signature needed for root-cause analysis.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Portainer from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Portainer is the Docker/ops UI for inspecting containers, logs, and stacks on Kecktech hosts. Many environments are Tailscale-scoped.

Canonical URLs:
- https://portainer.kecktech.net

## UI map
Know these landmarks before you start:

- Environments home
- Containers / Stacks / Volumes / Networks
- Container Logs and Console tabs
- Stack editor for compose updates

## Audience notes
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Recreating stateful containers without confirming volumes
- Updating `:latest` tags without a rollback plan
- Pasting secrets from logs into public chat

## Kecktech tips
- Export compose before stack updates.
- Smoke-test the public Traefik URL after changes.
- Prefer change tickets for production restarts.

## Related
- [Access Portainer environments](../getting-started/access-portainer.md)
- [Safe stack update checklist](../admin/stack-update.md)
- [Portainer login or endpoint down](../troubleshoot/endpoint-unreachable.md)
