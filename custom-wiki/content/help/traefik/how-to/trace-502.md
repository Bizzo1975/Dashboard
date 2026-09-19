# Trace a 502 Bad Gateway

**App:** Traefik  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Determine whether a 502 is caused by Traefik routing or a down upstream container.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Failing public URL
- Portainer access to the upstream stack

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Traefik.

## Steps
1. Note exact hostname and path returning 502.
2. In Traefik, find the router → service → server URL (container name/port).
3. In Portainer, confirm the upstream container is running and healthy on that port.
4. Compare container logs at the failure timestamp.
5. If the service is up but Traefik still 502s, check network membership (Traefik must share Docker network with the container).
6. Retry the URL; if Authelia middleware is attached, confirm auth.kecktech.net is healthy too.
7. Record root cause (crash loop, wrong port label, network) in the incident ticket.

## Verify
Public URL returns application HTML/JSON instead of Traefik 502.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Traefik from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Traefik is the edge reverse proxy/TLS terminator for `*.kecktech.net`. Routers map Host rules to container services; Authelia middleware protects staff apps.

Canonical URLs:
- https://traefik.kecktech.net

## UI map
Know these landmarks before you start:

- HTTP Routers / Services / Middlewares
- Entrypoints web / websecure
- Router detail: rule, service servers, middleware chain
- Traefik container logs for ACME and backend errors

## Audience notes
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Debugging Traefik before confirming DNS
- Wrong container port in service labels → 502
- Forgetting shared Docker network between Traefik and the app
- Accidentally putting Authelia on intentionally public routes

## Kecktech tips
- Distinguish 404 (no router) from 502 (bad upstream) from auth redirects.
- After label changes, recreate the container so Traefik rediscovers it.
- Keep help/marketing public unless there is a deliberate lockdown.

## Related
- [Read the Traefik dashboard](../getting-started/read-dashboard.md)
- [Add or update a router label](../admin/router-labels.md)
- [Router missing / TLS errors](../troubleshoot/router-missing.md)
