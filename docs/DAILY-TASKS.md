# Kecktech — Daily & Weekly Task System
**Updated: April 2026** | Solo operator cadence. Adjust pace on chronic pain days.

> **This file is MSP-only.** For the complete daily loop (MSP + NetOps/Cleaner Quality + ME Manager Presence), use:
> [kecktech-dashboard/ops/presence/DAILY_OPERATOR_LOOP.md](F:/Github/kecktech-dashboard/ops/presence/DAILY_OPERATOR_LOOP.md)

> **Chronic pain protocol:** On bad days, order of sacrifice:
> Content creation (skip) → delivery work (batch/defer) → outreach minimum → client commitments (NEVER miss)

---

## Morning Briefing (n8n email — daily, 7:30am CT)

The n8n morning briefing workflow sends a daily email with:

1. **Zammad:** Count of open tickets by priority; any P1/P2 tickets open 2+ hours
2. **ERPNext:** Invoices overdue + count; upcoming renewals in next 7 days
3. **TRMM:** Any offline agents; count of active alerts by severity

**n8n Workflow Spec** (create at n8n.kecktech.net):
- Trigger: Schedule → 7:30am CT (12:30 UTC) weekdays
- Node 1: HTTP GET `http://zammad-railsserver:3000/api/v1/tickets/search?query=state_id:1,2&limit=20` (Authorization header)
- Node 2: HTTP GET `http://frappe_docker-frontend-1:8080/api/resource/Sales%20Invoice?filters=[["docstatus","=",1],["outstanding_amount",">",0]]` (ERPNext token)
- Node 3: HTTP GET `http://trmm-nginx:8080/api/v3/agents/?overdue=true` (TRMM API key)
- Node 4: Compose email from all three sources
- Node 5: Send via Mailcow SMTP to jon@kecktech.net

---

## Dashboard Home Panel — "Today" Section

Add a "Today" widget to `dashboard/src/app/page.tsx` showing:

1. **Open P1/P2 tickets** (Zammad) — count + oldest unresponded
2. **Overdue invoices** (ERPNext) — count + total $ outstanding
3. **Offline TRMM agents** (TRMM) — count
4. **Leads needing follow-up** (ERPNext CRM) — count (3+ days no contact)
5. **Unbilled hours** (ERPNext Timesheet) — hours in draft status

This is the single morning dashboard check before diving into work.

---

## Daily Checklist (Every Business Day, ~5 hrs active work)

### ☀️ Morning Block (30 min)
- [ ] Read n8n morning briefing email
- [ ] Open dashboard.kecktech.net — check Today panel
- [ ] Respond to any P1/P2 tickets (2-hour SLA — must be first priority)
- [ ] Acknowledge TRMM critical alerts; create tickets for any requiring work
- [ ] Check email inbox — reply to any prospect or client emails

### 💼 Outreach Block (90 min — Week 1–4)
*Skip once client load fills delivery capacity*
- [ ] Research or enrich 5 prospects in ERPNext CRM
- [ ] Send personalized cold emails (target: 10–15/day in active ramp)
- [ ] Follow up on prospects flagged in Dashboard → Sales follow-up queue
- [ ] Log all outreach in ERPNext (update outreach_status)
- [ ] Return any voicemails / call-back requests within 1 hour

### 🔧 Delivery Block (2 hrs)
- [ ] Work open Zammad tickets (P3 and pending)
- [ ] Log time in Dashboard → Support → Time Entry after each ticket
- [ ] Any scheduled remote sessions (RustDesk)
- [ ] AI app build work (if active engagement)
- [ ] Monthly senior check-in calls (if scheduled)

### 📣 Content Block (30 min — 3x per week, not daily)
*Monday / Wednesday / Friday only*
- [ ] Write or post LinkedIn content (rotating: Green IT, MSP tips, senior scam alerts, Wichita business focus)
- [ ] Update blog on kecktech.net if a post is scheduled

### 🌙 Evening Wrap (15 min)
- [ ] Check unbilled hours — convert any completed timesheets to draft invoices
- [ ] Update ERPNext lead statuses from today's activity
- [ ] Set tomorrow's top 3 priorities (write them down)
- [ ] Confirm all tickets have a response or are correctly in pending state

---

## Weekly Cadence

### Monday
- [ ] Review Dashboard → Sales: pipeline KPIs vs last week
- [ ] Send follow-ups to all leads 5+ days old
- [ ] Plan outreach targets for the week
- [ ] Check TRMM: any agents offline over the weekend?

### Tuesday
- [ ] Outreach heavy day (highest reply rate mid-week)
- [ ] Discovery calls if booked

### Wednesday
- [ ] LinkedIn post (rotating content)
- [ ] Review ERPNext AP: any invoices due this week to pay?
- [ ] Check bookings / discovery call calendar

### Thursday
- [ ] Proposal follow-ups — call any open proposals 3–5 days old
- [ ] TRMM patch review: any clients with pending critical patches?

### Friday
- [ ] Monthly check-in calls with MSP clients (rotating schedule, ~30 min each)
- [ ] Bill any draft timesheets from the week
- [ ] Week-in-review: tickets closed, leads moved, revenue activity
- [ ] Blog post if scheduled

---

## Monthly Checklist (1st of month, ~2 hrs)

### Revenue Review
- [ ] Dashboard → Billing: record MRR/ARR vs prior month
- [ ] Count active MSP clients vs. prior month
- [ ] Identify any churned or at-risk clients
- [ ] Review AR aging — escalate any 60+ day invoices

### Client Health
- [ ] Dashboard → Ops: review client health scores (red/amber/green)
- [ ] Check HaaS asset ages — flag any approaching 36 months
- [ ] Review TRMM patch compliance across all clients
- [ ] Send monthly device health report to each MSP client (from TRMM)

### Marketing & Pipeline
- [ ] Add new prospects to CRM (minimum 10 new per month)
- [ ] Review Umami analytics (kecktech.net traffic trend)
- [ ] Update Google Business Profile if needed
- [ ] LinkedIn performance review: posts, engagement, connections

### Operations
- [ ] Verify daily backup ran (check backup.log)
- [ ] Review Portainer: any containers in unhealthy state?
- [ ] Check Mailcow queue: any bounced/stuck emails?
- [ ] Rotate any credentials due for rotation (Vaultwarden reminder)
- [ ] Review AP — any new recurring expenses to add?

---

## Quarterly Checklist (~4 hrs)

- [ ] Client strategy review call with each MSP client (30 min, documented)
- [ ] Senior client quarterly security report (delivered by phone or email)
- [ ] Review service pricing vs. market (any competitor changes?)
- [ ] Review ERPNext financials: gross margin by service line
- [ ] Evaluate HaaS fleet: any units needing retirement or refresh?
- [ ] Tax prep: export ERPNext P&L for accountant
- [ ] Business goal review: on track for MRR targets?
- [ ] Update BUSINESS-CONTEXT.md if anything has changed

---

## ERPNext Quick-Reference (Daily Use)

| Task | Path |
|------|------|
| Add new lead | CRM → Lead → New |
| Update lead status | CRM → Lead → [name] → edit outreach_status |
| Log billable time | Dashboard → Support → Time Entry (or HR → Timesheet → New) |
| Create invoice | Accounts → Sales Invoice → New |
| Record payment | Accounts → Sales Invoice → [name] → Make Payment |
| Add expense | Buying → Purchase Invoice → New |
| View AR dashboard | Dashboard → Billing |
| View sales pipeline | Dashboard → Sales |
| View client health | Dashboard → Ops |
| Create TRMM ticket | Dashboard → Support → AlertPanel → Create Ticket |

---

## Zammad Quick-Reference

| Task | Path |
|------|------|
| View all open tickets | tickets.kecktech.net → Overviews → My Tickets |
| Create new ticket | tickets.kecktech.net → + New Ticket |
| Assign ticket priority | Ticket → right sidebar → Priority |
| Set SLA countdown | Automatic on ticket create (by group) |
| Close ticket | Ticket → State → Closed |
| View client history | Tickets → search by customer email |

---

## Chronic Pain Day — Minimum Operations (1–2 hrs)

On days where full capacity isn't possible, complete only:

1. **P1/P2 tickets** — non-negotiable, respond within SLA
2. **Quick email scan** — client emergencies only
3. **TRMM critical alerts** — acknowledge/escalate if needed
4. **5-minute dashboard check** — anything on fire?

Everything else defers to next day. Client commitments always take priority over business development.
Document any SLA impacts proactively to clients.
