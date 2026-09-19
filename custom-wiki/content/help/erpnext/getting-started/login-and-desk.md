# Log in to ERPNext Desk

**App:** ERPNext  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Sign in to the Kecktech ERP desk and open your home workspace without errors.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Staff or customer ERPNext account (often behind Authelia)
- URL: https://erp.kecktech.net (alias: https://ops.kecktech.net)
- Modern browser with cookies enabled for Authelia SSO

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ERPNext.

## Steps
1. Open https://erp.kecktech.net (or https://ops.kecktech.net).
2. If redirected to Authelia at https://auth.kecktech.net, enter your LLDAP username and password, then complete 2FA if enrolled.
3. On the ERPNext login screen (if shown), enter your ERPNext user email/username and password, then click **Login**.
4. Wait for Desk to load. You should see the workspace sidebar and module icons (CRM, Accounting, Buying, Selling, Stock, and others).
5. Open **Home** (or your default workspace). Pin frequently used DocTypes with the star icon.
6. Open your avatar menu (top-right) and confirm the correct user name and company context appear.

## Verify
You can open **CRM → Customer** (or another permitted module) and the list view loads without an authentication or permission error.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

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
- [Create a customer](../how-to/create-customer.md)
- [Manage roles and permissions](../admin/manage-roles.md)
- [Cannot open Desk](../troubleshoot/cannot-open-desk.md)
