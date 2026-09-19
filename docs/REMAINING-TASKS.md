# Kecktech — Remaining Tasks
**Updated: April 2026** | See `BUSINESS-CONTEXT.md` for business truth.

**Legend:** `[CLI]` = terminal/code | `[BROWSER]` = manual browser | `[DONE]` = complete | `[DEFERRED]` = blocked on external

**Credentials:**
- All apps: `admin@kecktech.net` / `Kecktech2026!`
- SSO (Authelia): `keckadmin` / `Kecktech2026` (no `!` — LLDAP OPAQUE bug, do NOT change)

---

## Revenue Priority Order

| # | Service | Price | Status |
|---|---------|-------|--------|
| 1 | White Glove MSP | $199/mo | Stack ready, pre-client |
| 2 | HaaS | $149/mo/device | ERPNext configured |
| 3 | AI Custom App Dev | $3K–$8K | Pipeline building |
| 4 | Senior Concierge | $79/mo | Stack ready, pre-client |
| 5 | Sovereign Hosting | $49/mo | FUTURE — do not sell yet |

---

## ✅ Completed

| Task | Notes |
|------|-------|
| Authelia SSO live, TOTP enrolled | `keckadmin` account, 2FA active |
| Mailcow — kecktech.net domain, DKIM, mailboxes | admin@ + support@ + tickets@ created |
| Zammad deployed (6 containers) | Replaced FreeScout; SLA groups configured |
| Zammad email channel configured | tickets@kecktech.net IMAP + SMTP |
| Zammad SLA policies created | P1=2hr, P2=4hr, P3=24hr |
| ERPNext initialized | Site: localhost (needs rename — see Priority 2) |
| ERPNext service items created | 7 items + SVC-MSP-SEC |
| ERPNext HaaS templates | HAAS-L1/L2/L3, Leased Hardware asset category |
| ERPNext tax template | Kansas IT Services 0% |
| ERPNext CRM lead sources | WordPress Form, Referral, RMM Alert, Cold Call, Manual |
| LLDAP groups created | kecktech_admins, kecktech_staff, kecktech_billing, kecktech_support, kecktech_sales |
| Authelia per-route policies | Group-based access enforced |
| Tactical RMM initialized | Critical Alerts template + n8n webhook wired |
| Vaultwarden org + collections | Kecktech Field Tech org created |
| n8n owner account + 2 workflows | RMM alert + Zammad ticket flows |
| Umami — 2 sites created | kecktech.net + help.kecktech.net |
| Dashboard — all 4 views live | Support, Billing, Sales, Ops |
| BookStack theming + import scripts | help.kecktech.net, high-contrast CSS |
| Astro site live | www.kecktech.net (replaced WordPress) |
| Custom Wiki deployed | help.kecktech.net on port 3011 |
| Customer portal deployed | portal.kecktech.net — Zammad + ERPNext + RustDesk |
| Backup script registered | Daily 02:00 CT via Windows Task Scheduler |

---

## 🔴 Priority 1 — Infrastructure Migration (New Proxmox Server)

- [ ] `[CLI]` Remove WikiJS + wp-db from docker-compose.yml (dead services, ~1.2GB RAM wasted)
- [ ] `[CLI]` Remove WordPress from docker-compose.yml (Astro replaced it)
- [ ] `[CLI]` Update scripts/backup.sh — remove wikijs-db and wordpress dump targets
- [ ] `[CLI]` Create new Proxmox server (hardware arriving Apr 13)
  - ZFS mirror on 2×2TB NVMe; 1TB SSD as separate datastore
  - VM 100: kecktech-apps (Ubuntu 24.04, 8 vCPU, 32GB)
  - VM 101: willworkforlunch (Ubuntu 24.04, 4 vCPU, 8GB)
  - VM 102: mailcow-prod (Ubuntu 22.04, 4 vCPU, 16GB)
  - See `Proxmox_Day1-3_Setup_Guide.docx` for full steps
- [ ] `[CLI]` Migrate Kecktech stack to VM 100 (restore from backup)
- [ ] `[CLI]` Migrate Mailcow to VM 102 (own VM, isolated)
- [ ] `[CLI]` Update all compose extra_hosts for mail.kecktech.net → VM 102 Tailscale IP
- [ ] `[CLI]` Re-generate RustDesk keys, update RUSTDESK_SERVER_HOST + RUSTDESK_PUBLIC_KEY in .env
- [ ] `[CLI]` Migrate willworkforlunch.com to VM 101
- [ ] `[BROWSER]` Phase 8: Deploy Cloudflare Tunnel for public routes only:
  - www.kecktech.net, help.kecktech.net, tickets.kecktech.net
  - NOT: dashboard, lldap, traefik, n8n, vault, stats, rmm, ops (Tailscale only)
- [ ] `[BROWSER]` Add MX, SPF, DKIM, DMARC records for kecktech.net
- [ ] `[BROWSER]` Add willworkforlunch.com domain to Mailcow (noreply@ + support@)

---

## 🔴 Priority 2 — ERPNext Full Configuration

Full step-by-step in `ERPNEXT-SETUP-GUIDE.md`. Key items:

- [ ] `[CLI]` Rename ERPNext site from `localhost` to `ops.kecktech.net`
  - `bench rename-site localhost ops.kecktech.net`
  - Update FRAPPE_SITE_NAME_HEADER in erpnext/frappe_docker/.env
- [ ] `[BROWSER]` Update service items with correct rates (see BUSINESS-CONTEXT.md §5)
  - Add SVC-ONSITE ($125/hr), SVC-SENIOR-ONSITE ($100/hr)
  - Update SVC-REMOTE to $79/hr
  - Mark SVC-HOME and SVC-HOSTING as inactive
- [ ] `[BROWSER]` Configure ERPNext CRM custom fields (priority_tier, territory, vertical, kecktech_angle)
- [ ] `[BROWSER]` Import 50 prospect leads from Kecktech_50_Prospect_Starter_List.csv
- [ ] `[BROWSER]` Create Employee record for Jon Keck (required for timesheets)
- [ ] `[BROWSER]` Configure Subscription module — MSP and Senior recurring billing
- [ ] `[BROWSER]` Configure ERPNext Payment Terms — Net-0 for MSP (charge same day)
- [ ] `[DEFERRED]` Connect Stripe payment gateway (create Stripe account first)
- [ ] `[BROWSER]` Configure ERPNext email — outbound via Mailcow SMTP
- [ ] `[BROWSER]` Set default letter head + company logo on invoice print format

---

## 🔴 Priority 3 — Go-Live Blockers

- [ ] `[BROWSER]` Create Stripe account + connect to ERPNext
  - Products: MSP $199/mo recurring, Billable Hours one-time, AI App Deposit $2,250
- [ ] `[BROWSER]` Draft and finalize MSP Service Agreement (MSA)
  - Key clauses: scope, SLA, $199/mo net-0, 30-day cancel, Kansas jurisdiction
- [ ] `[BROWSER]` Test full contact form → Zammad ticket flow (kecktech.net/contact → tickets@)
- [ ] `[BROWSER]` Test Astro site on www.kecktech.net via Cloudflare tunnel (post Phase 8)
- [ ] `[BROWSER]` Enroll Twilio account, add creds to n8n for SMS alerts
- [ ] `[BROWSER]` Configure Google Business Profile for Kecktech (Wichita/Park City)
- [ ] `[BROWSER]` Publish MSP one-pager to kecktech.net/services/msp
- [ ] `[BROWSER]` Publish AI App one-pager to kecktech.net/services/ai-apps

---

## 🟡 Priority 4 — Customer Portal Full Build

Full gap analysis in `CUSTOMER-PORTAL-GAP-ANALYSIS.md`. Key missing features:

- [ ] `[CLI]` Add /api/rustdesk/route.ts (missing — RustDesk info endpoint 404s)
- [ ] `[CLI]` Add active contracts section (ERPNext Subscription API)
- [ ] `[CLI]` Add TRMM device health panel (agent status per client)
- [ ] `[CLI]` Add BookStack paywall content access (token-gated articles)
- [ ] `[CLI]` Add payment link integration (Stripe checkout for outstanding invoices)
- [ ] `[CLI]` Add invoice history (all invoices, not just outstanding)
- [ ] `[CLI]` Add service plan summary card (what's included in their MSP plan)

---

## 🟡 Priority 5 — Knowledge Base Content

- [ ] `[CLI]` Execute BookStack pilot import (25 articles): `cd bookstack && npm run pilot -- --pilot-limit=25`
- [ ] `[CLI]` Execute full BookStack import: `npm run full-import` (after pilot sign-off)
- [ ] `[BROWSER]` Configure each client device for RustDesk:
  - ID Server = new Proxmox server host (VM 100 Tailscale IP)
  - Record RustDesk ID in Vaultwarden Client Profiles

---

## 🟢 Deferred (Blocked on External)

- `[DEFERRED]` Twilio SMS — needs Twilio account + creds
- `[DEFERRED]` Stripe — needs Stripe account (create this week)
- `[DEFERRED]` Data center / solar — capital required; show as future goal on website only
- `[DEFERRED]` Sovereign Hosting service line — blocked on data center

---

## Stale / Archived Tasks (removed)

The following are no longer relevant and have been removed:
- Florida contractor setup in ERPNext
- FreeScout configuration (replaced by Zammad)
- WikiJS setup (replaced by BookStack + Custom Wiki)
- WordPress content (replaced by Astro)
- Phase 8 "Florida contractor Tailscale access" item

## ✅ Completed in This Session (April 2026)

| Task | Notes |
|------|-------|
| BUSINESS-CONTEXT.md created | Single source of truth, replaces business_launch.md |
| INTEGRATIONS.md rewritten | Stale services removed, all current services documented |
| REMAINING-TASKS.md rewritten | This file — accurate, stale items removed |
| ERPNEXT-SETUP-GUIDE.md created | 18-step guide covering all modules |
| CUSTOMER-PORTAL-GAP-ANALYSIS.md created | Full gap + prioritized build list + ready-to-deploy code |
| PROCESS-MAP.md created | All 8 business processes mapped end-to-end |
| DAILY-TASKS.md created | Solo operator daily/weekly/monthly checklists |
| .cursor/rules/kecktech-stack.mdc updated | Corrected service items, ERPNext ownership, removed stale refs |
| business_launch.md marked stale | Superseded by BUSINESS-CONTEXT.md |
| WORDPRESS-RESTORE-WINDOWS.md marked stale | WordPress removed from stack |
| STACK-ISSUES-REMEDIATION-PLAN.md marked stale | Issues resolved |
| customer-portal/app/api/rustdesk/route.ts created | Fixed broken 404 — RustDesk info endpoint now works |
| customer-portal/app/api/rustdesk/info/route.ts created | /api/rustdesk/info path also fixed |
| docker/docker-compose.yml cleaned | WordPress + wp-db + WikiJS + wikijs-db REMOVED (~1.2GB RAM freed) |
| scripts/backup.sh updated | Removed WordPress/WikiJS dumps; added BookStack + Custom Wiki |
| docs/n8n-workflows/morning-briefing.json created | Import to n8n — sends 7:30am CT daily briefing email |
| CUSTOMER-PORTAL-GAP-ANALYSIS.md — code appended | contracts/route.ts + devices/route.ts ready to deploy |

