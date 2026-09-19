# Find ops tools on the dashboard

**App:** Apps Dashboard  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Locate onboarding, infra, and support launchers used by Kecktech staff.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Ops-group access on the dashboard

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Apps Dashboard.

## Steps
1. Sign in to the dashboard.
2. Look for ops-specific sections or tiles such as Onboarding Wizard (`/ops/onboarding` on the dashboard host).
3. Open Portainer, Traefik, LLDAP, n8n, Umami, and RMM tiles from the same grid when visible.
4. Prefer these links over tribal bookmarks so hostname changes propagate.
5. If you use the onboarding wizard, follow its steps for LLDAP → Vault → Zammad → ERPNext linkage.

## Verify
You can open the onboarding wizard or an infra tile appropriate to your role.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Apps Dashboard from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
The Apps Dashboard is the staff launcher for Kecktech systems after Authelia. Ops tooling such as the onboarding wizard may live under `/ops/...` on this host.

Canonical URLs:
- https://dash.kecktech.net
- https://dashboard.kecktech.net

## UI map
Know these landmarks before you start:

- Tile grid of applications
- Optional ops section / onboarding wizard entry
- User session identity via Authelia
- Admin configuration for tile URLs and group visibility

## Audience notes
This article is a task guide. Follow the steps in order; do not skip Verify.

## Common pitfalls
- Bookmarks to raw hosts drifting from canonical tiles
- Customers seeing infra tiles due to wrong group visibility
- 403 on a tile misread as dashboard outage

## Kecktech tips
- Use the dashboard daily so SSO and links stay consistent.
- Canonical hosts: erp, tickets/support, vault, admin, rmm, portal, help.
- Report wrong tile URLs with expected vs actual hostname.

## Related
- [Use Apps Dashboard tiles](../getting-started/use-app-tiles.md)
- [Configure dashboard tiles](../admin/configure-tiles.md)
- [Tile opens wrong app or 403](../troubleshoot/tile-403.md)
