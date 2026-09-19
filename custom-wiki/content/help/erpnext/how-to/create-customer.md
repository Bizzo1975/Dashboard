# Create a customer in ERPNext

**App:** ERPNext  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Add a Customer record with billing details so invoices and portal data can link correctly.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Logged into Desk with CRM or Sales create permission
- URL: https://erp.kecktech.net
- Legal/business name and primary contact email ready

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ERPNext.

## Steps
1. Open https://erp.kecktech.net and reach Desk.
2. Go to **CRM → Customer**, or use Awesome Bar: type `Customer` and press Enter.
3. Click **+ Add Customer** (or **New**).
4. Set **Customer Name** to the company or individual legal name used on invoices.
5. Choose **Customer Type** (Company or Individual) and set **Customer Group** / **Territory** per Kecktech ops practice.
6. Under **Address & Contact**, add a primary Billing Address and a Contact with email (match Zammad/portal email when possible).
7. Optional: set default payment terms, currency, and tax category for that client.
8. Click **Save**. Note the Customer ID in the title bar for ticket notes.

## Verify
The Customer appears in list search by name, and the form opens without validation errors.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Manage roles and permissions](../admin/manage-roles.md)
- [Cannot open Desk](../troubleshoot/cannot-open-desk.md)
