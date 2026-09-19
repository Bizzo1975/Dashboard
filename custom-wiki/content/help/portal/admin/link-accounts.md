# Link portal user to Zammad and ERPNext

**App:** Customer Portal  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Ensure a customer’s LLDAP identity maps to Zammad org tickets and ERPNext invoices in the portal.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- LLDAP user already in `kecktech_customers`
- Access to Zammad admin and ERPNext
- Optional: https://dashboard.kecktech.net/ops/onboarding wizard

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Customer Portal.

## Steps
1. Prefer the Onboarding Wizard on the apps dashboard to run Steps 1–4 automatically when available.
2. In Zammad, ensure a Customer user exists with the same email and correct Organization.
3. In ERPNext (https://erp.kecktech.net / https://ops.kecktech.net), confirm Customer + invoices exist for the company.
4. Align contact email addresses across systems.
5. Have the customer sign in at https://portal.kecktech.net and verify tickets/invoices populate.
6. Store portal credentials in the client Vaultwarden collection.

## Verify
Customer portal session shows welcome identity plus at least one linked ticket or invoice when data exists.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Customer Portal from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
The customer portal personalizes tickets (Zammad) and invoices (ERPNext) for users in `kecktech_customers`. Empty widgets usually mean identity mismatch, not a total outage.

Canonical URLs:
- https://portal.kecktech.net

## UI map
Know these landmarks before you start:

- Welcome banner with name/company
- Tickets / support widget
- Invoices / billing widget
- Links out to support.kecktech.net when creating richer ticket threads

## Audience notes
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

## Common pitfalls
- User exists in LLDAP but not in `kecktech_customers`
- Zammad customer email differs from portal login email
- No ERPNext invoices yet interpreted as “billing is broken”

## Kecktech tips
- Staff should run linkage checks via the onboarding wizard when possible.
- Customers should keep one primary email across portal, tickets, and invoices.
- Use Vaultwarden for credential handoff—not email threads.

## Related
- [Sign in to the customer portal](../getting-started/sign-in.md)
- [View tickets and invoices](../how-to/view-tickets-invoices.md)
- [Portal empty or forbidden](../troubleshoot/empty-or-403.md)
