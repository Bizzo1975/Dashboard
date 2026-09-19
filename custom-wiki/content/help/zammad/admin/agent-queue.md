# Work the agent ticket queue

**App:** Zammad  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Claim, update, and close tickets from the agent UI under Kecktech SLA practice.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Agent or Admin role in Zammad
- URL: https://tickets.kecktech.net
- Familiarity with groups: MSP Support, HaaS, Senior Care, Internal

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Zammad.

## Steps
1. Open https://tickets.kecktech.net and sign in as an agent (not the customer portal).
2. Open **Overviews** → your group overview or **My assigned**.
3. Open the oldest New ticket that matches your skill. **Assign** it to yourself if unassigned.
4. Set priority (Critical/High/Normal/Low). Critical/High may trigger n8n → Twilio SMS to on-call.
5. Reply publicly with next steps. Use macros for common acknowledgements when available.
6. Log time under **Time Accounting**. Tag SVC-MSP, SVC-HAAS, SVC-REMOTE as required.
7. When done, set **Pending Close** with a clear resolution summary.
8. For vendor waits, use **Pending Reminder** with a follow-up date and an internal note containing the vendor case ID.

## SLA quick reference
| Priority | First response | Resolution target |
|---|---|---|
| Critical | 30 min | 4 hours |
| High | 2 hours | 8 hours |
| Normal | 4 hours | 24 hours |
| Low | 8 hours | 72 hours |

## Verify
Ticket shows your assignment, latest public reply, and a state that matches remaining work.

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
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

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
- [Ticket missing after submit](../troubleshoot/ticket-not-visible.md)
