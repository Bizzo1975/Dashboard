# Reply to a support ticket

**App:** Zammad  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Send a customer reply that continues the conversation on an existing ticket.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Existing ticket number or Zammad notification email
- Portal: https://support.kecktech.net

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Zammad.

## Steps
1. Open https://support.kecktech.net and sign in.
2. Open **My Tickets** or the deep link from the notification email.
3. Select the ticket and read the latest agent reply.
4. Type your update in the reply box. Answer agent questions in a short numbered list when possible.
5. Attach new files if requested. Do not paste passwords—use Vaultwarden share links instead.
6. Submit/Update and confirm your message appears in the timeline.
7. If the ticket is Pending Close and the issue is fixed, reply confirming resolution.

## Verify
Your reply is visible in ticket history and the state is Open or Pending (not stuck Closed).

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Ticket missing after submit](../troubleshoot/ticket-not-visible.md)
- [Portal sign-in](../../portal/getting-started/sign-in.md)
