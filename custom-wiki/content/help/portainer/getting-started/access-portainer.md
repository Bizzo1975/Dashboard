# Access Portainer environments

**App:** Portainer  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Sign in to Portainer and open the Docker environment that hosts Kecktech stacks.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Ops admin membership
- URL: https://portainer.kecktech.net
- Tailscale if the instance is not public

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Portainer.

## Steps
1. Open https://portainer.kecktech.net and authenticate (Authelia and/or Portainer local admin as configured).
2. From **Home / Environments**, select the target endpoint (Docker host or Swarm).
3. Open **Containers** to see running services.
4. Use stacks view if deployments are managed as compose stacks.
5. Do not restart production containers without a change window unless mitigating an outage.

## Verify
Container list loads for the selected environment with health/status columns visible.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Recreating stateful containers without confirming volumes
- Updating `:latest` tags without a rollback plan
- Pasting secrets from logs into public chat

## Kecktech tips
- Export compose before stack updates.
- Smoke-test the public Traefik URL after changes.
- Prefer change tickets for production restarts.

## Related
- [Inspect logs for a container](../how-to/view-logs.md)
- [Safe stack update checklist](../admin/stack-update.md)
- [Portainer login or endpoint down](../troubleshoot/endpoint-unreachable.md)
