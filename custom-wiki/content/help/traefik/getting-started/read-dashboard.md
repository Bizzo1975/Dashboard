# Read the Traefik dashboard

**App:** Traefik  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Open Traefik’s dashboard/API view to inspect routers, services, and middlewares.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Ops access (often Tailscale-only)
- Dashboard URL if enabled: https://traefik.kecktech.net
- Familiarity with entrypoints `web` / `websecure`

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Traefik.

## Steps
1. Connect to the admin network/Tailscale if required.
2. Open https://traefik.kecktech.net (or the internal dashboard port documented for the host).
3. Authenticate if the dashboard is SSO-protected.
4. Open **HTTP → Routers** and search for a hostname (example: `erp.kecktech.net`).
5. Click the router to see entrypoints, rule (`Host(...)`), service, and middlewares (Authelia, headers, compress).
6. Cross-check **Services** and **Middlewares** tabs when diagnosing 404 vs 502.

## Verify
You can locate the router for a known hostname and see it marked enabled/success.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

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
- [Trace a 502 to a service](../how-to/trace-502.md)
- [Add or update a router label](../admin/router-labels.md)
- [Router missing / TLS errors](../troubleshoot/router-missing.md)
