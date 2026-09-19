# Portal empty or forbidden

**App:** Customer Portal  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Resolve blank widgets or 403 errors after portal sign-in.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Your login email
- Company name on file with Kecktech

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Customer Portal.

## Steps
1. If you see 403 after Authelia, you may lack `kecktech_customers`—contact support to fix group membership.
2. If home loads but tickets are empty, confirm you have tickets under the same email in Zammad.
3. If invoices are empty, finance may not have issued ERPNext invoices yet—or the customer record email does not match.
4. Retry in a private window after signing out of Authelia fully.
5. Provide screenshots and your username in a support ticket for staff linkage repair.

## Verify
Portal shows your identity and the data widgets you are entitled to see.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Portal admin linkage checks](../admin/link-accounts.md)
