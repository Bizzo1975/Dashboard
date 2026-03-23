// Run inside wikijs container: node /tmp/create-wikijs-pages.js
const http = require('http');

function gql(body, jwt, cb) {
  const b = JSON.stringify(body);
  const req = http.request({
    hostname: 'localhost', port: 3000, path: '/graphql', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': jwt ? 'Bearer ' + jwt : '', 'Content-Length': Buffer.byteLength(b) }
  }, (res) => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => cb(JSON.parse(d)));
  });
  req.on('error', e => console.error(e));
  req.write(b); req.end();
}

const BILLING_CONTENT = `# Billing & Revenue — How to Use

## What This View Shows

The Billing view aggregates all financial data from ERPNext into one dashboard.

## Sections

### KPI Cards (Top Row)
- **MRR** — Monthly Recurring Revenue from active subscriptions
- **ARR** — Annual Run Rate
- **Outstanding AR** — Total unpaid invoices
- **Unbilled Hours** — Draft timesheets not yet invoiced

### AR Aging
Invoices bucketed by how overdue they are:
- **Current** — not yet due
- **1–30 days** — follow up
- **31–60 days** — escalate
- **61+ days** — collection priority

Click any invoice number to open it in ERPNext.

### Billable Time (Timesheets)
All timesheet entries from ERPNext. Draft = not yet billed. Submitted = invoiced.

**Monthly billing process:**
1. Review all Draft entries
2. Group by customer
3. Open ERPNext → create Sales Invoice per customer
4. Submit the timesheets

### Accounts Payable
Open purchase invoices. Green = current, red = overdue.

## Common Questions

**Where do timesheets come from?**
Techs log time via the Support Desk Log Time panel. Each entry creates a Draft Timesheet in ERPNext.

**How do I invoice a customer?**
Open ERPNext (ops.kecktech.net), go to Accounting > Sales Invoice > New. Link the timesheet entries.
`;

const SALES_CONTENT = `# Sales & CRM — How to Use

## What This View Shows

The Sales view is your CRM pipeline. It shows leads organized by stage, flags stale follow-ups, and lets you add new leads instantly.

## Sections

### KPI Cards (Top Row)
- **In Pipeline** — active leads not yet converted or DNC
- **New This Week** — leads created in the last 7 days
- **Conversion Rate** — converted divided by total
- **Avg Days to Close** — benchmark for pipeline health
- **Website Visitors (7d)** — from Umami analytics

### Lead Pipeline (Kanban)
Columns: **New → Open → Replied → Opportunity → Quotation → Interested → Converted**

- Each card shows: Lead name, Company, Source badge, Days in stage
- Orange border = stale (3+ days without an update)
- Click **Open in CRM** to update the lead in ERPNext

**Lead sources:**

| Badge | Meaning |
|-------|---------|
| WordPress Form | Submitted the website contact form |
| Referral | Word of mouth, existing client |
| RMM Alert | TRMM flagged a prospect device |
| Manual | Cold call or direct contact |

### Follow-Up Queue
Leads not touched in 3+ days. Sort order: most stale first.

**Daily follow-up routine:**
1. Open Sales view
2. Work down the Follow-Up Queue
3. For each stale lead: call or email, then update stage in ERPNext
4. Use **Open in CRM** to log an activity note

### Add Lead (Quick Capture)
Use this form to add a new lead without opening ERPNext.

**Required:** Name
**Recommended:** Company, Phone, Email, Source, Notes

## Common Questions

**How do I mark a lead as Converted?**
Open it in ERPNext CRM, change status to Converted, and Save.
`;

const OPS_CONTENT = `# Operations Dashboard — How to Use

## What This View Shows

The Operations view is the SOC/NOC dashboard. It groups all monitored devices by client and shows full stack health.

## Sections

### Alert Summary Bar (Top)
Shows total counts by severity across all clients. A pulsing red dot means there is at least one Critical alert.

### Client Health Grid
Each client row shows:
- **Status dot** — green (all online), yellow (partial), red (offline + alerts)
- **Agent count** — online vs offline
- **Alert count** — active TRMM alerts for this client
- **Vault button** — opens Vaultwarden to find this client's RustDesk ID and credentials

Expanded per-agent rows show hostname, OS, status, last seen, active alerts, and pending actions.

Clients with issues sort to the top automatically.

### Stack Health
12-service health check. Shows each service name, up/down status, and response latency.

## Daily Ops Routine
1. Open Operations dashboard
2. Scan Alert Summary Bar — any Critical? Respond immediately
3. Check Client Health Grid — any orange/red client rows?
4. For offline agents: verify with client, check if device is powered on
5. For stack health failures: check container logs in Portainer

## Getting a Client's RustDesk ID
1. Click the Vault button on the client row
2. Log into Vaultwarden (SSO via Authelia)
3. Open the **Client Profiles** collection
4. Find the client and copy their RustDesk ID
5. Open RustDesk, enter the ID, connect

## Common Questions

**An agent shows offline but the client says their device is on.**
Check if the TRMM agent service is running: open RustDesk to the device, then run sc query tacticalrmm in PowerShell.

**Stack Health shows ERPNext as down.**
This usually means the frappe_docker container restarted. Check Portainer for the frappe_docker-frontend-1 logs.
`;

const pages = [
  { path: 'staff-guide/billing', title: 'Billing & Revenue — How to Use', content: BILLING_CONTENT },
  { path: 'staff-guide/sales', title: 'Sales & CRM — How to Use', content: SALES_CONTENT },
  { path: 'staff-guide/operations', title: 'Operations Dashboard — How to Use', content: OPS_CONTENT },
];

// The support-desk page was already created (id=11).
// Update it with full content.
const SUPPORT_CONTENT = `# Support Desk — How to Use

## What This View Shows

The Support Desk is your daily driver for managing client issues. It shows three columns simultaneously:

- **Left (30%):** Live TRMM alerts across all clients, sorted by severity
- **Middle (45%):** Open FreeScout tickets pulled from the database — no FreeScout login needed for viewing
- **Right (25%):** Quick Actions — Log time against a customer, plus direct links to external tools

## Daily Workflow

### Morning Check-In
1. Open Support Desk — scan the Alert column for any Critical (red) or High (orange) alerts
2. Acknowledge any alerts you are actively working — click **Acknowledge** on the alert card
3. Scan open tickets — check elapsed time badges for anything new since yesterday
4. Claim any unassigned urgent tickets by opening them in FreeScout

### Working a Ticket
1. Read the ticket preview in the middle column
2. Click **Open in FreeScout** to reply or add internal notes
   - Note: FreeScout requires one login per browser session: admin@kecktech.net / Kecktech2026!
3. When work is complete, log your time in the **Log Time** panel

### Logging Time
- Select customer from the dropdown
- Choose hours (0.25 increments)
- Write a brief description — include ticket number if applicable
- Click **Log Time** — this creates a Draft Timesheet in ERPNext

### Remote Support
1. Click **Vaultwarden (Client Profiles)** in Quick Access
2. Find the client's collection
3. Copy their RustDesk ID
4. Connect via RustDesk

## Alert Severity Guide

| Color | Severity | Response Time |
|-------|----------|---------------|
| Red | Critical | Immediate |
| Orange | High | Within 1 hour |
| Yellow | Warning | Same day |
| Blue | Info | Review this week |

## Common Questions

**The time entry customer dropdown is empty.**
ERPNext credentials may not be configured or the ERPNext container is restarting. Check the Ops page for ERPNext stack health.

**I acknowledged an alert but it reappears.**
TRMM may still be detecting the condition. The issue needs to be resolved at the source, not just acknowledged.
`;

gql({query:'mutation{authentication{login(username:"admin@kecktech.net",password:"Kecktech2026!",strategy:"local"){responseResult{succeeded}jwt}}}'}, null, (r) => {
  const JWT = r.data?.authentication?.login?.jwt;
  if (!JWT) { console.error('Login failed'); return; }

  // Update existing support-desk page (id=11)
  gql({
    query: 'mutation UP($c:String!,$i:Int!,$t:String!){pages{update(id:$i,content:$c,description:"",editor:"markdown",isPublished:true,isPrivate:false,locale:"en",path:"staff-guide/support-desk",publishEndDate:"",publishStartDate:"",scriptCss:"",scriptJs:"",tags:[],title:$t){responseResult{succeeded message}}}}',
    variables: { c: SUPPORT_CONTENT, i: 11, t: 'Support Desk — How to Use' }
  }, JWT, (r2) => {
    const res = r2.data?.pages?.update?.responseResult;
    console.log('support-desk update:', res?.succeeded ? 'OK' : JSON.stringify(res || r2.errors));

    let i = 0;
    function next() {
      if (i >= pages.length) { console.log('All pages done.'); return; }
      const p = pages[i++];
      gql({
        query: 'mutation CP($c:String!,$p:String!,$t:String!){pages{create(content:$c,description:"",editor:"markdown",isPublished:true,isPrivate:false,locale:"en",path:$p,publishEndDate:"",publishStartDate:"",scriptCss:"",scriptJs:"",tags:[],title:$t){responseResult{succeeded message}page{id}}}}',
        variables: { c: p.content, p: p.path, t: p.title }
      }, JWT, (r3) => {
        const res3 = r3.data?.pages?.create?.responseResult;
        console.log(p.path + ':', res3?.succeeded ? 'OK id=' + r3.data.pages.create.page.id : JSON.stringify(res3 || r3.errors));
        next();
      });
    }
    next();
  });
});
