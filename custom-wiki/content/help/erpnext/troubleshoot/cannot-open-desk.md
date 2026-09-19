# Cannot open ERPNext Desk

**App:** ERPNext  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Diagnose and clear common blocks that prevent Desk from loading after SSO or password login.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Browser access from your workstation
- Try both https://erp.kecktech.net and https://ops.kecktech.net
- Know whether you normally use Authelia SSO

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ERPNext.

## Steps
1. Confirm the page is not a Traefik 404/502. Gateway errors lasting more than a minute should be ticketed at https://tickets.kecktech.net.
2. Clear cookies for `auth.kecktech.net` and `erp.kecktech.net` (or use a private window), then sign in again through Authelia.
3. If Authelia succeeds but ERPNext shows **Login**, use the ERPNext user that matches your staff email.
4. If Desk loads but modules are empty, ask an admin to confirm your User is enabled and has Role permissions.
5. Temporarily disable aggressive ad blockers for `*.kecktech.net`; Desk boot uses XHR.
6. For CSRF or session loops: sign out at https://auth.kecktech.net, close the tab, then start again from the ERP URL.
7. Still blocked? Capture URL, HTTP status, and a screenshot; file a Zammad ticket (Internal or MSP Support).

## Verify
Desk home loads with workspace icons and Awesome Bar finds DocTypes.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for ERPNext from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
ERPNext (Desk) is Kecktech’s ERP for CRM, invoicing, assets (including HaaS), and operations records. Many staff sessions hit Authelia first, then Desk.

Canonical URLs:
- https://erp.kecktech.net
- https://ops.kecktech.net

## UI map
Know these landmarks before you start:

- Awesome Bar (search) at the top — fastest way to open DocTypes like Customer or Sales Invoice
- Left workspace sidebar — modules such as CRM, Accounting, Stock, Assets
- Avatar menu (top-right) — user, company context, Log out
- List view vs Form view — lists support filters; forms have Save / Submit where applicable

## Audience notes
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Confusing Authelia password with a separate ERPNext local user password
- Missing Role permissions looking like “the module is broken”
- Creating Customers without a Contact email — portal/Zammad linkage becomes harder later
- Using Submit on documents without understanding stock/accounting impact

## Kecktech tips
- Prefer Awesome Bar over hunting through nested menus.
- Match Customer contact emails to portal/Zammad identities when possible.
- For HaaS devices, record Assets with serials and link the Customer.

## Related
- [Log in to Desk](../getting-started/login-and-desk.md)
- [Create a customer](../how-to/create-customer.md)
- [Authelia first login](../../authelia/getting-started/first-login.md)
