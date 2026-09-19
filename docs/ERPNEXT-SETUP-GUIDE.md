# ERPNext Configuration Guide — Kecktech IT Solutions
**Version: ERPNext v16.8.2** | **Updated: April 2026**
> This guide assumes ERPNext is running via Docker at ops.kecktech.net.
> Site is currently named `localhost` — Step 1 renames it.

---

## Step 1 — Rename Site from `localhost` to `ops.kecktech.net`

```bash
# SSH into the Proxmox VM running ERPNext
cd /home/vboxuser/Dashboard/erpnext/frappe_docker

# Enter the backend container
docker compose exec backend bash

# Inside the container:
bench rename-site localhost ops.kecktech.net

# Update config to use new site name
bench --site ops.kecktech.net set-config server_script_enabled 1
exit
```

Update `.env` file:
```
FRAPPE_SITE_NAME_HEADER=ops.kecktech.net
```

Restart ERPNext stack:
```bash
cd /home/vboxuser/Dashboard
./startup-erpnext.sh
```

Verify: Browse to https://ops.kecktech.net — login should work.

---

## Step 2 — Company Setup Verification

Navigate to: **Setup → Company → Kecktech IT Solutions LLC**

Verify these settings are correct:

| Field | Value |
|-------|-------|
| Company Name | Kecktech IT Solutions LLC |
| Default Currency | USD |
| Country | United States |
| Tax ID | (enter EIN when available) |
| Fiscal Year | Jan–Dec |
| Default Warehouse | (leave blank — service company) |

---

## Step 3 — Update Service Items

Navigate to: **Stock → Items → (search each item)**

Update / create the following items:

| Item Code | Item Name | Rate | Item Group | Is Stock Item |
|-----------|-----------|------|------------|---------------|
| SVC-MSP | White Glove Managed IT | 199 | Services | No |
| SVC-MSP-SEC | Managed Security Add-On | 49 | Services | No |
| SVC-HAAS | HaaS Device Subscription | 149 | Services | No |
| SVC-AIAPP | AI Custom App Build | 3000 | Services | No |
| SVC-SENIOR | Senior Technology Concierge | 79 | Services | No |
| SVC-REMOTE | Billable Remote Support (SMB) | 79 | Services | No |
| SVC-ONSITE | Billable On-Site Support (SMB) | 125 | Services | No |
| SVC-SENIOR-ONSITE | Senior On-Site Support | 100 | Services | No |

**Disable these items** (not currently active):
- SVC-HOSTING — mark as disabled until data center is built
- SVC-HOME — deprecated (Florida on-site), disable

For SVC-REMOTE and SVC-ONSITE: Check **"Is Sales Item"**, uncheck **"Is Stock Item"**.
For SVC-AIAPP: Set Item Description to include "Discovery: $500 (credited to build)".

---

## Step 4 — CRM Custom Fields

Navigate to: **Customization → Customize Form → DocType: CRM Lead**

Add these custom fields (all type: Data unless noted):

| Field Name | Label | Type | Options |
|------------|-------|------|---------|
| priority_tier | Priority Tier | Select | A\nB\nC |
| territory | Territory | Select | Wichita-Downtown\nWichita-East\nWichita-West\nWichita-NE\nWichita-SE\nPark City\nDerby\nAndover\nBel Aire\nHaysville |
| vertical | Business Vertical | Data | — |
| kecktech_angle | Kecktech Angle | Small Text | — |
| outreach_status | Outreach Status | Select | not_contacted\nemailed\nfollowed_up_1\nfollowed_up_2\nreplied\ncall_booked\nproposal_sent\nclosed_won\nclosed_lost\nnurture |
| date_researched | Date Researched | Date | — |
| source_url | Source URL | Data | — |

After saving: **Clear Cache** (top-right menu).

---

## Step 5 — Import Prospect Leads

Navigate to: **CRM → Lead → (top-right) Import**

Map CSV columns from `Kecktech_50_Prospect_Starter_List.csv` to ERPNext fields:

| CSV Column | ERPNext Field |
|------------|---------------|
| business_name | Company Name |
| primary_contact_name | Lead Name |
| email | Email ID |
| phone | Phone |
| priority_tier | priority_tier (custom) |
| territory | territory (custom) |
| vertical | vertical (custom) |
| kecktech_angle | kecktech_angle (custom) |
| outreach_status | outreach_status (custom) |
| date_researched | date_researched (custom) |
| notes_on_fit | Notes |

Import settings: Skip existing records = Yes; Submit after import = No.

After import: verify 50 leads appear in CRM → Lead list.

---

## Step 6 — Lead Sources

Navigate to: **CRM → Setup → Lead Sources**

Ensure these exist (add any missing):

- WordPress Form
- Referral
- RMM Alert
- Cold Call
- Manual
- LinkedIn
- Chamber of Commerce
- Networking Event
- Senior Center Referral

---

## Step 7 — Create Employee Record

Required for timesheet attribution.

Navigate to: **HR → Employee → New**

| Field | Value |
|-------|-------|
| Employee Name | Jon Keck |
| Company | Kecktech IT Solutions LLC |
| Status | Active |
| Date of Joining | (your start date) |
| Department | Technology |
| Designation | Owner / Lead Developer |
| Employment Type | Owner |

Save. Note the Employee ID (e.g. EMP-00001) — used in timesheets.

---

## Step 8 — Subscription Module Configuration

Navigate to: **Subscription → Subscription Plan → New**

Create these plans:

**Plan 1: White Glove MSP**
- Plan Name: White Glove MSP
- Item: SVC-MSP
- Price: 199
- Billing Interval: Month
- Billing Interval Count: 1

**Plan 2: Managed Security Add-On**
- Plan Name: Managed Security Add-On
- Item: SVC-MSP-SEC
- Price: 49
- Billing Interval: Month
- Billing Interval Count: 1

**Plan 3: HaaS Device**
- Plan Name: HaaS Device Subscription
- Item: SVC-HAAS
- Price: 149
- Billing Interval: Month
- Billing Interval Count: 1
- Notes: Create one subscription per device (not per client)

**Plan 4: Senior Technology Concierge**
- Plan Name: Senior Technology Concierge
- Item: SVC-SENIOR
- Price: 79
- Billing Interval: Month
- Billing Interval Count: 1

For each new MSP client: Navigate to **Subscription → New**, select the customer, add the plan, set start date.

---

## Step 9 — Payment Terms

Navigate to: **Accounts → Setup → Payment Terms → New**

| Field | Value |
|-------|-------|
| Payment Term Name | Net-0 (Due on Invoice) |
| Due Date Based On | Day(s) after invoice date |
| Credit Days | 0 |
| Description | Payment due on receipt — MSP clients billed monthly |

Set as default: **Accounts → Settings → Default Payment Terms = Net-0**

---

## Step 10 — Email Account (Outbound)

Navigate to: **Settings → Email Account → New**

| Field | Value |
|-------|-------|
| Email Account Name | Kecktech Operations |
| Email ID | admin@kecktech.net |
| SMTP Server | mail.kecktech.net |
| Port | 587 |
| Use TLS | Yes |
| Login ID | admin@kecktech.net |
| Password | (from Mailcow) |
| Default Outgoing | Yes |
| Enable Incoming | No (Zammad handles inbound) |

---

## Step 11 — Invoice Letter Head

Navigate to: **Setup → Letter Head → New**

- Name: Kecktech Standard
- Content: Upload logo from `img/transparent-logo.png`
- Footer: Kecktech IT Solutions LLC | Park City, KS | jon@kecktech.net | kecktech.net

Set as default: **Company → Kecktech → Default Letter Head = Kecktech Standard**

---

## Step 12 — Stripe Payment Gateway

> **Prerequisite:** Stripe account must be created first.

Navigate to: **Accounts → Setup → Payment Gateway Account → New**

- Gateway: Stripe
- API Key: (from Stripe dashboard → Developers → API Keys → Secret Key)
- Webhook Secret: (from Stripe → Webhooks → signing secret)

After connecting: Create Payment Links in Stripe for:
- MSP Monthly: $199 recurring
- Billable Hours (one-time): $79/hr × hours
- AI App Deposit: $2,250 one-time

Configure ERPNext to send invoice emails with Stripe payment links.

---

## Step 13 — HaaS Asset Category Verification

Navigate to: **Assets → Asset Category**

Verify `Leased Hardware` exists with:
- Enable Depreciation: Yes
- Depreciation Method: Straight Line
- Total Number of Depreciations: 36
- Frequency of Depreciation: Monthly

When a new HaaS device is acquired:
1. Create Purchase Order → receive → create Fixed Asset from receipt
2. Assign asset to customer (custom field: Customer)
3. Create Subscription for that customer's HaaS plan

---

## Step 14 — Tax Template Verification

Navigate to: **Accounts → Taxes and Charges → Sales Taxes**

Verify `Kansas IT Services 0%` exists:
- Tax Type: On Net Total
- Rate: 0%
- Account: Output Tax

Set as default on Company: **Company → Default Sales Tax Template = Kansas IT Services 0%**

---

## Step 15 — CRM Workflow: Lead → Customer

Standard workflow for new MSP client:

```
CRM Lead (outreach_status: not_contacted)
  → research + contact → (outreach_status: emailed)
  → reply received → (outreach_status: replied)
  → call booked → (status: Open)
  → discovery call complete → Convert to Opportunity
  → proposal sent → (outreach_status: proposal_sent)
  → signed → Convert Opportunity to Customer
  → Create Subscription (MSP plan)
  → Create first Sales Invoice
  → Send invoice email with Stripe payment link
  → Payment received → mark invoice paid
  → Create TRMM client group (client onboarding)
  → Create Vaultwarden collection for client
  → Create Zammad customer account
```

---

## Step 16 — Project Module (AI App Dev)

Navigate to: **Project → Project → New** for each AI app engagement.

| Field | Value |
|-------|-------|
| Project Name | [Client] — [App Name] Build |
| Customer | (link to ERPNext customer) |
| Status | Open |
| Expected Start | (discovery complete date) |
| Expected End | (build + 30-day support end) |
| % Complete | 0 |

Milestones to create as Tasks:
1. Discovery complete (50% deposit collected)
2. Week 2 demo delivered
3. Build complete (50% balance collected)
4. Launch + staff training
5. 30-day post-launch support window closes

Log time via **Timesheet → New** — link to Project and Customer.
Invoice milestones via Billing page "Milestone Invoice" button.

---

## Step 17 — AP / Expense Tracking

Navigate to: **Buying → Suppliers → New** for each vendor.

Common Kecktech vendors to create:
- Internet Provider (fiber + LTE failover)
- Insurance (E&O, GL, Cyber)
- Software licenses (Cursor AI, dev tools)
- Hardware vendors (refurb sources for HaaS)
- Chamber of Commerce membership

Log expenses: **Buying → Purchase Invoice → New**
- Link to Supplier
- Use Expense Account matching the category

---

## Step 18 — Dashboard Integration Verification

The internal dashboard at dashboard.kecktech.net reads from ERPNext via API.
After completing Steps 1–17, verify dashboard shows live data:

1. **Billing page:** MRR/ARR should reflect active subscriptions
2. **Sales page:** Leads should appear in pipeline kanban
3. **Ops page:** HaaS assets should appear in lifecycle table
4. **Support page:** Time entry form should show customer dropdown

If any panel shows errors: check `.env` ERPNEXT_API_KEY + ERPNEXT_API_SECRET are set.

---

## ERPNext Troubleshooting

**Site not found / "localhost does not exist"**
```bash
cd erpnext/frappe_docker
docker compose exec backend bench --site ops.kecktech.net list-apps
# If site doesn't exist, it needs to be renamed (Step 1)
```

**Restart ERPNext stack:**
```bash
cd /home/vboxuser/Dashboard
./startup-erpnext.sh
```

**Check ERPNext logs:**
```bash
cd erpnext/frappe_docker
docker compose logs frontend --tail=50
docker compose logs backend --tail=50
```

**Reset admin password:**
```bash
docker compose exec backend bench --site ops.kecktech.net set-admin-password Kecktech2026!
```
