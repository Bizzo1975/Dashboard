# Document a network change

**App:** NetOps  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Record a firewall, DNS, or circuit change so the next operator has accurate NetOps context.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Approved change ticket in Zammad
- Before/after values (IP, VLAN, DNS name, rule IDs)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in NetOps.

## Steps
1. Open the site/device object affected by the change.
2. Update structured fields (IP addresses, uplinks, notes) to the new reality.
3. Add a dated note referencing the Zammad ticket number.
4. Attach diagrams or config snippets if the app supports uploads—redact secrets.
5. If DNS changed, verify public/private resolution and update related Traefik routes docs.
6. Close the loop in the ticket with a link/screenshot of the NetOps record.

## Verify
Another tech can open the same record and understand the new state without asking you.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [NetOps admin inventory hygiene](../admin/inventory-hygiene.md)
- [NetOps unreachable](../troubleshoot/unreachable.md)
