# Kecktech — Business Process Map
**Updated: April 2026** | Full lifecycle: Lead → Client → Support → Billing → Close

---

## Overview

This document maps every business process Kecktech runs, which tool owns each step,
and what you do manually vs. what is automated.

---

## Process 1: Customer Acquisition (Lead → Opportunity → Customer)

```
LEAD SOURCES
├── Cold email outreach (manual, tracked in ERPNext CRM)
├── Warm network referrals (manual email, tracked in ERPNext)
├── Networking events — BNI, Chamber (business cards → ERPNext Lead same day)
├── LinkedIn content (organic inbound — prospect contacts you)
├── kecktech.net contact form → Mailcow → Zammad ticket → ERPNext Lead (automated)
└── Senior center referrals (phone → ERPNext Lead)

STEP 1: Research & Enter Lead
  Tool: ERPNext CRM → Lead → New
  Fields: Company, contact name, email, phone, priority_tier, territory, vertical, kecktech_angle
  Status: not_contacted

STEP 2: First Outreach
  Tool: Your email client (Mailcow webmail or app)
  Action: Personalized cold email using template (see 30-day plan Part 4)
  Update: ERPNext Lead → outreach_status = emailed; set follow-up date

STEP 3: Follow-Ups
  Tool: ERPNext CRM follow-up queue (visible on Dashboard → Sales page)
  Trigger: Dashboard flags leads with 3+ days no contact
  Action: Follow-up #1 at day 5, follow-up #2 at day 10 (different angle)
  Update: outreach_status = followed_up_1 / followed_up_2

STEP 4: Reply Received / Call Booked
  Update: outreach_status = replied / call_booked; ERPNext Lead status = Open

STEP 5: Discovery Call (30 min)
  Tool: Phone / video call using script (30-day plan Part 7)
  Listen 10 min → Demo 10 min (show dashboard live) → Next step 10 min
  Update: ERPNext Lead → Notes; if good fit → Convert to Opportunity

STEP 6: Proposal
  Tool: ERPNext Opportunity → generate Quotation
  Action: Send MSP agreement + pricing within 24 hours of call
  Update: outreach_status = proposal_sent

STEP 7: Close / Sign
  Tool: DocuSign / Dropbox Sign (external) for MSA signature
  Action: Send Stripe payment link for first month same day as signature
  Update: ERPNext Opportunity → Won; Convert to Customer

STEP 8: First Invoice
  Tool: ERPNext Sales Invoice (auto from Subscription, or manual)
  Action: Invoice sent via email; Stripe link included; Net-0 terms
```

---

## Process 2: MSP Client Onboarding

```
TRIGGER: New MSP client signs MSA + pays first invoice

STEP 1: ERPNext Setup
  - Create Customer record (verify name matches email domain)
  - Create Subscription (SVC-MSP $199/mo, start date = today)
  - Add SVC-MSP-SEC if security add-on purchased

STEP 2: Tactical RMM
  - Create Client Group: [Company Name]
  - Generate TRMM agent installer for client
  - Email installer + instructions to client IT contact
  - Verify agent checks in (green in TRMM dashboard)

STEP 3: Vaultwarden
  - Create Collection under "Kecktech Field Tech" org: [Company Name]
  - Add client admin credentials, router info, key contacts

STEP 4: Zammad
  - Create Customer account (email = client's primary contact email)
  - Assign to group: MSP Support
  - Set SLA policy: P1=2hr, P2=4hr, P3=24hr

STEP 5: RustDesk
  - Send client RustDesk download link (portal.kecktech.net has instructions)
  - Have client install + share their 9-digit ID
  - Store RustDesk ID in Vaultwarden collection

STEP 6: Welcome Packet
  - Send welcome email with:
    - Portal URL (portal.kecktech.net) + Authelia login instructions
    - Support email (support@kecktech.net) + ticket portal URL
    - Emergency P1 phone number
    - Monthly check-in schedule
  - Schedule first monthly check-in call (30 min, first Friday of each month)

STEP 7: LLDAP
  - Create client user account in LLDAP for portal access
  - Assign to group: kecktech_staff (portal access)
  - Add ERPNext customer name to user notes field
```

---

## Process 3: Daily Support Operations

```
MORNING (30 min):
  1. Check n8n morning briefing email (Zammad tickets + ERPNext alerts + TRMM)
  2. Review Dashboard → Support page:
     - Open Zammad tickets: triage by priority, respond to P1/P2 first
     - TRMM alerts: acknowledge or create ticket for each
  3. Check TRMM for offline agents (any device offline overnight = proactive outreach)

DURING DAY:
  - Work tickets in priority order (P1 → P2 → P3)
  - Log time in Dashboard → Support → Time Entry form after each engagement
  - Remote support via RustDesk (client shares ID, you connect)
  - Update Zammad ticket with resolution notes on close

EVENING (15 min):
  - Check Dashboard → Billing for unbilled draft timesheets
  - Update ERPNext Lead statuses after any outreach
  - Review tomorrow's follow-up queue (Dashboard → Sales)
```

---

## Process 4: Monthly Billing Cycle

```
RECURRING SUBSCRIPTIONS (automated once Stripe is connected):
  - ERPNext Subscription module auto-generates invoices on renewal date
  - Invoice emailed to client via Mailcow
  - Stripe payment link included in invoice email
  - On payment: Stripe webhook → n8n → ERPNext records payment

BILLABLE HOURS (manual, monthly):
  STEP 1: Dashboard → Billing → check "Unbilled Hours" KPI
  STEP 2: Click "Bill Unbilled Time" to convert draft timesheets to invoice
  STEP 3: Review invoice, add any additional line items
  STEP 4: Submit invoice → send email → include Stripe payment link

OVERDUE INVOICE FOLLOW-UP:
  - Dashboard → Billing shows overdue invoices with "Send Reminder" email button
  - Click to send templated reminder email
  - If 30+ days: phone call to client contact
  - If 60+ days: escalate; consider service suspension warning

MONTH-END REVIEW (1st of each month, 30 min):
  - Dashboard → Billing → review MRR/ARR KPIs vs prior month
  - Check AR aging: any invoices in 31–60 or 61+ day bucket?
  - Dashboard → Sales → review pipeline conversion rate
  - Log any new expenses in ERPNext (Purchase Invoice)
  - Review Umami stats for kecktech.net (traffic trend)
```

---

## Process 5: HaaS Device Lifecycle

```
NEW HAAS DEVICE:
  STEP 1: Client requests hardware → generate Quotation in ERPNext (SVC-HAAS)
  STEP 2: Client approves → create Purchase Order to acquire device
  STEP 3: Receive device → zero-wipe (NIST 800-88) → configure OS + security
  STEP 4: Receive in ERPNext → convert to Fixed Asset → record serial number
  STEP 5: Assign asset to customer (custom Customer field on Asset)
  STEP 6: Create Subscription (SVC-HAAS $149/mo) linked to this asset
  STEP 7: Ship/deliver device → update TRMM (new agent = this device)
  STEP 8: Document in Vaultwarden collection: device specs, serial, warranty

ONGOING:
  - Dashboard → Ops → HaaS Device Lifecycle table shows age of each device
  - "Aging" flag at 36 months, "Replace Soon" at 48 months
  - At 36 months: contact client about refresh cycle options

END OF LEASE:
  STEP 1: Subscription expires → generate final invoice if applicable
  STEP 2: Retrieve device from client
  STEP 3: Assess: refurbish for next client, or certified e-waste
  STEP 4: Update Asset in ERPNext as disposed/transferred
```

---

## Process 6: AI App Development Engagement

```
STEP 1: Lead Qualification
  - Prospect has SaaS pain ($300+/mo in tools they don't fully use)
  - Discovery call: map their workflow, identify replacement targets
  - Confirm budget ($3K–$8K one-time + optional $199/mo MSP hosting)

STEP 2: Paid Discovery ($500)
  - Invoice SVC-AIAPP at $500 (credited to build)
  - Collect payment before starting
  - Deliver: written scope, wireframe, tech decisions, fixed price, timeline

STEP 3: Build (3–6 weeks)
  - Create ERPNext Project: [Client] — [App Name]
  - Add milestones as Tasks (Week 2 demo, build complete, launch)
  - 50% deposit invoice on scope approval
  - Weekly Friday demos on staging environment
  - Log all hours to ERPNext Timesheet → link to Project

STEP 4: Launch
  - Deploy to Kecktech infrastructure (or client's server)
  - Staff training session (included)
  - 50% balance invoice on launch day
  - 30-day post-launch support window begins (included)

STEP 5: Ongoing
  - Offer MSP + Hosting bundle at launch ($199/mo + $49/mo if hosting needed)
  - If ongoing development needed: new scoped engagement or hourly ($79/hr remote)
  - Ask for testimonial and referral at 30-day mark
```

---

## Process 7: Senior Concierge Operations

```
ACQUISITION:
  - Senior center presentations → business card + QR to kecktech.net
  - Adult children referral ($200 service credit on referral)
  - Faith community outreach (quarterly presentations)

ONBOARDING:
  - Phone intake: assess tech situation, explain service
  - In-home visit to set up RustDesk, verify devices ($100/hr visit)
  - Create ERPNext Customer + Subscription (SVC-SENIOR $79/mo)
  - Create Zammad account → assign to "Senior Care" group
  - Create Vaultwarden entry: safe word, trusted contacts, device list

MONTHLY SERVICE:
  - Proactive monthly device health check (remote via RustDesk, 15 min)
  - Check for Windows updates, verify antivirus, scan for scam indicators
  - Document findings in Zammad ticket (even if no issues)
  - Log 0.25hr to timesheet (included in subscription)

INCIDENT RESPONSE:
  - Scam/fraud: P1 priority, same-business-day response
  - Device failure: on-site visit ($100/hr SVC-SENIOR-ONSITE)
  - Account lockout: remote session to recover

QUARTERLY:
  - Phone call with senior + optional family member briefing
  - Deliver plain-language security report
  - Check for household tech changes (new TV, router, smart devices)
```

---

## Process 8: Accounts Payable (Expenses)

```
REGULAR EXPENSES TO TRACK IN ERPNEXT:
  - Internet provider (fiber + LTE backup)
  - Insurance (E&O, GL, Cyber — monthly or quarterly)
  - Software tools (Cursor AI, dev subscriptions)
  - Hardware purchases for HaaS fleet
  - Marketing (Chamber membership, printing, ads)
  - Professional services (legal, accounting)

MONTHLY:
  STEP 1: Collect all receipts/invoices
  STEP 2: Create Purchase Invoice in ERPNext for each
  STEP 3: Dashboard → Billing → AP section shows outstanding payables
  STEP 4: Pay vendors; mark invoice paid in ERPNext

QUARTERLY REVIEW:
  - Review AP aging vs AR aging
  - Identify any recurring subscriptions to cancel or renegotiate
  - Update cash flow projection
```

---

## Automation Status

| Process | Automated | Manual | Tool |
|---------|-----------|--------|------|
| Contact form → Zammad ticket | ✅ | — | Mailcow IMAP → Zammad |
| TRMM alert → Zammad ticket | ✅ | — | n8n webhook |
| High-priority ticket → SMS | ⚠️ (Twilio pending) | Phone | n8n + Twilio |
| Monthly invoice generation | ⚠️ (Stripe pending) | Manual create | ERPNext Subscription |
| Invoice email with payment link | ⚠️ (Stripe pending) | Manual send | ERPNext + Stripe |
| Morning briefing email | ❌ Not built | Check dashboard | n8n (spec in DAILY-TASKS.md) |
| Lead follow-up reminders | ⚠️ (dashboard shows) | Manual email | Dashboard Sales page |
| Overdue invoice reminders | ⚠️ (dashboard shows) | Manual email | Dashboard Billing page |
| TRMM patch management | ✅ | — | TRMM automated patching |
| RustDesk connection | ✅ | Client shares ID | RustDesk self-hosted |
