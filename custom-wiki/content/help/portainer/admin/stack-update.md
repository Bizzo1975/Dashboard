# Safe stack update checklist

**App:** Portainer  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Update a compose stack in Portainer with rollback awareness.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Maint window or approved change
- Backup/snapshot policy understood for stateful services
- Image tags pinned (avoid surprise `:latest` where possible)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Portainer.

## Steps
1. Identify the stack and export/copy the current compose for rollback.
2. Confirm volumes and networks will persist across recreate.
3. Pull new images, then update the stack with Portainer **Update the stack**.
4. Watch container health and logs for 2–5 minutes.
5. Hit the public URL through Traefik (auth apps via Authelia) for a smoke test.
6. If unhealthy, roll back to the previous compose/image tag immediately.
7. Record version and outcome in the change ticket.

## Verify
Stack services are healthy and the smoke-test URL behaves correctly.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Portainer login or endpoint down](../troubleshoot/endpoint-unreachable.md)
