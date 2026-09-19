# Add or update a Traefik router label

**App:** Traefik  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Expose a container on a kecktech.net hostname with Authelia middleware when required.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Compose edit rights via Portainer/git
- Chosen subdomain and whether SSO is required

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Traefik.

## Steps
1. Decide hostname (example: `newapp.kecktech.net`) and create DNS.
2. Add Traefik labels: enable, router rule `Host(...)`, entrypoints, TLS certresolver, service port.
3. Attach Authelia forward-auth middleware for staff apps; omit for intentionally public apps (marketing, help).
4. Deploy the stack update during a change window.
5. Confirm router appears in Traefik and smoke-test through the browser.
6. Document the new route in ops inventory / this Help Center.

## Verify
HTTPS to the hostname reaches the app and auth behavior matches the design (SSO vs public).

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Trace a 502 to a service](../how-to/trace-502.md)
- [Router missing / TLS errors](../troubleshoot/router-missing.md)
