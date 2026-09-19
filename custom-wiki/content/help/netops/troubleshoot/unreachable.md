# NetOps console unreachable

**App:** NetOps  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Restore access when NetOps fails DNS, auth, or upstream health checks.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Tailscale status
- Portainer access for the NetOps stack

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in NetOps.

## Steps
1. Confirm Tailscale is connected and `net-ops.kecktech.net` resolves as expected.
2. Check Authelia health if you never leave the auth redirect.
3. In Traefik, verify the NetOps router points at a healthy container.
4. Inspect Portainer logs for the NetOps service.
5. Use break-glass host tools only if documented; do not bypass change control on production firewalls.
6. Declare incident priority based on whether customer traffic is impacted vs docs-only outage.

## Verify
NetOps UI authenticates and loads inventory views.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for NetOps from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
NetOps is an internal console for network inventory and change documentation. Treat it as operational source material during incidents.

Canonical URLs:
- https://net-ops.kecktech.net

## UI map
Know these landmarks before you start:

- Site / device inventory lists
- Record detail with IPs, uplinks, contacts
- Notes/history for change documentation
- Search/filter across sites

## Audience notes
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Updating production firewalls without a ticket while “just fixing docs”
- Leaving decommissioned gear marked active
- Docs that disagree with Traefik/DNS reality

## Kecktech tips
- Always reference the Zammad ticket number in NetOps notes.
- Reconcile names with RMM clients and Vaultwarden collections.
- Hygiene passes prevent incident confusion later.

## Related
- [Open the NetOps console](../getting-started/open-netops.md)
- [Document a network change](../how-to/document-change.md)
- [NetOps admin inventory hygiene](../admin/inventory-hygiene.md)
