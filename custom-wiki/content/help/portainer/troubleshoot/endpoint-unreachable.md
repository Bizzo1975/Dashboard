# Portainer login or endpoint unreachable

**App:** Portainer  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Restore access when Portainer UI or a Docker endpoint will not connect.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Console/SSH access to the Docker host if UI is down
- Vaultwarden credentials for host access

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Portainer.

## Steps
1. Confirm Tailscale connectivity and DNS for `portainer.kecktech.net`.
2. If Authelia fails, fix auth first at https://auth.kecktech.net.
3. If Portainer loads but an environment is gray/down, check the Portainer agent and Docker daemon on that host.
4. On the host: `docker ps` (or equivalent) to see whether containers still run despite UI issues.
5. Review Traefik router for Portainer if you get 404/502 at the edge.
6. Escalate as P1 if multiple customer-facing stacks are impacted.

## Verify
Portainer lists the environment as Up and container views refresh.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Inspect logs for a container](../how-to/view-logs.md)
- [Safe stack update checklist](../admin/stack-update.md)
