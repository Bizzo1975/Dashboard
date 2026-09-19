# Manage ERPNext roles and permissions

**App:** ERPNext  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Assign roles and permission rules so staff see only the DocTypes they need.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- System Manager or Administrator role
- URL: https://erp.kecktech.net
- List of modules the user needs (CRM, Accounts, Stock, etc.)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in ERPNext.

## Steps
1. Sign in to https://erp.kecktech.net as an administrator.
2. Awesome Bar → `User` → open the target user.
3. Under **Roles**, enable the minimum set (Sales User, Accounts User, etc.). Avoid System Manager unless required.
4. Apply a **Role Profile** if Kecktech uses standard tech vs finance profiles.
5. Open **Role Permission Manager** and confirm Create/Read/Write/Submit for required Document Types.
6. If restricting by Customer/Company, add **User Permission** rows for allowed records.
7. Have the user hard-refresh Desk (or log out/in) and re-test module access.
8. Record the access grant in the related Zammad ticket or onboarding checklist.

## Verify
The user opens permitted DocTypes and gets a clear permission error on DocTypes they should not access.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Cannot open Desk](../troubleshoot/cannot-open-desk.md)
