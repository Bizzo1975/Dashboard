# Keep NetOps inventory accurate

**App:** NetOps  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Run a lightweight hygiene pass so stale devices and circuits do not mislead incident response.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- NetOps admin rights
- Recent customer site list from ERP/CRM

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in NetOps.

## Steps
1. Export or browse devices last-seen older than your threshold (example: 90 days).
2. Mark decommissioned gear retired instead of deleting history when the app allows.
3. Reconcile circuit IDs with carrier portals quarterly.
4. Ensure each active site has an emergency contact and location note.
5. Align naming with Vaultwarden collections and RMM client names.
6. Log the hygiene pass date in ops notes.

## Verify
Spot-check three active sites: contacts, uplinks, and hostnames match production.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [NetOps unreachable](../troubleshoot/unreachable.md)
