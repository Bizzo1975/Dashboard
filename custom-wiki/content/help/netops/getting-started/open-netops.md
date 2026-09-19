# Open the NetOps console

**App:** NetOps  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Reach the NetOps tooling used for network visibility and operator tasks.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Ops/admin group membership
- URL: https://net-ops.kecktech.net
- Tailscale if the console is internal-only

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in NetOps.

## Steps
1. Connect to the admin network if required.
2. Open https://net-ops.kecktech.net and complete Authelia.
3. Land on the NetOps home/dashboard.
4. Locate inventory, device, or circuit lists used by the team.
5. Open a known site/device to confirm read access before making changes.

## Verify
NetOps UI loads and you can open a site or device record.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Updating production firewalls without a ticket while “just fixing docs”
- Leaving decommissioned gear marked active
- Docs that disagree with Traefik/DNS reality

## Kecktech tips
- Always reference the Zammad ticket number in NetOps notes.
- Reconcile names with RMM clients and Vaultwarden collections.
- Hygiene passes prevent incident confusion later.

## Related
- [Document a network change](../how-to/document-change.md)
- [NetOps admin inventory hygiene](../admin/inventory-hygiene.md)
- [NetOps unreachable](../troubleshoot/unreachable.md)
