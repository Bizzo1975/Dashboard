# Ticket missing after submit

**App:** Zammad  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Locate a ticket that does not appear in the customer portal after submit.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Approximate submit time and subject line
- Access to the email inbox used for the Zammad account

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Zammad.

## Steps
1. Check confirmation email from Zammad / support@kecktech.net for a ticket number and link.
2. In the portal, clear state/date filters and search by subject keywords.
3. Confirm you are logged in as the same email used at creation. Org-shared tickets may use a different view.
4. If you emailed support@kecktech.net, wait a few minutes for mail processing; check spam for bounces.
5. Retry https://tickets.kecktech.net vs https://support.kecktech.net after a full Authelia re-login in a private window.
6. Still missing? Contact support with subject, timestamp, and sending email so an agent can search Admin → Tickets.

## Verify
You can open the ticket by number and see your original message.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Zammad from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Zammad is the Kecktech help desk. Customers use the portal UI; agents use the agent interface. Email to support@kecktech.net also creates tickets. Critical/High priorities can SMS on-call via n8n → Twilio.

Canonical URLs:
- https://tickets.kecktech.net
- https://support.kecktech.net

## UI map
Know these landmarks before you start:

- Customer portal: My Tickets, New Ticket, ticket timeline replies
- Agent UI: Overviews, ticket pane, article composer, Time Accounting tab
- States: New, Open, Pending Reminder, Pending Close, Closed
- Groups commonly used: MSP Support, HaaS, Senior Care, Internal

## Audience notes
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Replying by personal email outside the thread — breaks ticket history
- Pasting passwords into public ticket articles instead of Vaultwarden
- Agents forgetting Time Accounting / service tags used for billing
- Customers searching while filters hide Closed/Pending tickets

## Kecktech tips
- Put the system name and symptom in the subject line.
- Use Pending Reminder with a date when waiting on vendors.
- Pending Close after resolution; let auto-close finish when customers go silent.

## Related
- [Open a ticket](../getting-started/open-a-ticket.md)
- [Reply to a ticket](../how-to/customer-reply.md)
- [Work the agent queue](../admin/agent-queue.md)
