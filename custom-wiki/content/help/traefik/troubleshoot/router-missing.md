# Router missing or TLS errors

**App:** Traefik  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Restore a hostname that does not appear in Traefik or fails certificate issuance.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Compose/labels for the service
- DNS A/AAAA or CNAME for `*.kecktech.net` pointing at the edge

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Traefik.

## Steps
1. nslookup/dig the hostname; fix DNS before debugging Traefik.
2. Confirm container labels include `traefik.enable=true`, correct `Host()` rule, and entrypoint `websecure`.
3. Restart/recreate the container so Traefik re-discovers labels.
4. For TLS failures, check ACME resolver logs in the Traefik container and rate limits.
5. Ensure the router is not filtered by a wrong middleware chain that rejects before TLS completes.
6. Validate with `curl -vI https://hostname` from Tailscale and from an external vantage point.

## Verify
Router appears in the dashboard and HTTPS returns a valid certificate for the hostname.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Add or update a router label](../admin/router-labels.md)
