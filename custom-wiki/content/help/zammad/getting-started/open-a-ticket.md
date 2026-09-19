# Open a support ticket in Zammad

**App:** Zammad  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Create a tracked support request so Kecktech can respond under SLA.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Customer account, or ability to email support@kecktech.net
- Customer UI: https://support.kecktech.net (alias: https://tickets.kecktech.net)
- Clear issue description and optional screenshots

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Zammad.

## Steps
1. Open https://support.kecktech.net (or https://tickets.kecktech.net).
2. Sign in via Authelia if prompted. Customers land in the Zammad customer portal.
3. Click **New Ticket** (or **+**).
4. Enter a short **Title** naming the system and symptom (example: `Portal invoices not loading`).
5. Select the group when offered (MSP Support, HaaS, Senior Care, or Internal for staff).
6. Describe what broke, when it started, who is affected, and steps already tried. Attach screenshots or logs.
7. Submit and copy the ticket number from the confirmation or ticket header.
8. Alternatively email support@kecktech.net — Zammad creates a ticket from that channel automatically.

## Verify
The ticket appears in your list with state New or Open and shows your message.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

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
- [Reply to a ticket](../how-to/customer-reply.md)
- [Work the agent queue](../admin/agent-queue.md)
- [Ticket missing after submit](../troubleshoot/ticket-not-visible.md)
