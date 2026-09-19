# Kecktech IT Solutions LLC — Business Context
**Single source of truth. Updated: April 2026.**
> All other business docs defer to this file. If anything conflicts, this wins.

---

## 1. Company Identity

| Field | Value |
|-------|-------|
| Legal Name | Kecktech IT Solutions LLC |
| Location | Park City, Kansas (Sedgwick County — Wichita metro) |
| Website | kecktech.net |
| Email | jon@kecktech.net |
| Operator | Jon Keck — Owner, Lead Developer, CTO |
| Support | Wife assists on operations as needed (family-operated) |
| Disability Status | Disability-operated small business — qualifies for WOTC, SBA preferential lending |
| Founded | 2025 |
| Current Status | Pre-revenue, 30-day launch ramp active (Apr 13 – May 12, 2026) |

**Mission:** Provide sustainable, sovereign, and accessible technology services to small businesses
and senior citizens in the Wichita metro area that the mainstream IT industry consistently underserves.

---

## 2. Service Lines

### 2.1 Currently Sellable

| # | Service | Price | Target | Notes |
|---|---------|-------|--------|-------|
| 1 | White Glove Managed IT (MSP) | $199/mo | SMBs 1–15 users, Wichita metro | Priority revenue driver |
| 2 | Hardware-as-a-Service (HaaS) | $149/mo/device | MSP clients + standalone | Refurbished enterprise gear, 36-mo lease |
| 3 | AI Custom App Development | $3K–$8K/build | SMBs replacing SaaS | Discovery $500 (credited to build) |
| 4 | Senior Technology Concierge | $79/mo | Seniors 65+, household focus | Separate track from SMB MSP |
| — | Billable Remote Support (SMB) | $79/hr | Non-MSP SMB clients | Ad hoc, billed via timesheet |
| — | Billable On-Site Support (SMB) | $125/hr | Non-MSP SMB clients | Wichita metro only |
| — | Senior On-Site Support | $100/hr | Senior concierge clients | Scheduled visits |
| — | Managed Security Add-On | $49/mo | MSP clients | Enhanced endpoint + dark web monitoring |

### 2.2 Future-State (NOT currently sellable)

| Service | Blocker | Notes |
|---------|---------|-------|
| Sovereign Private Hosting ($49/mo) | Requires physical data center build | Show as roadmap on website, do not quote to clients |

### 2.3 Senior Concierge Tiers (Planned — not yet live)

| Tier | Price | Scope |
|------|-------|-------|
| Basic | TBD | PC/laptop support only |
| Intermediate | $79/mo | Devices, scam protection, video calls |
| Advanced | TBD | Smart TVs, smart home, full household electronics |

---

## 3. Target Market

- **Primary:** Small offices, 1–15 users, any vertical, Wichita metro (Sedgwick County + Derby, Andover, Bel Aire, Haysville, Park City)
- **Secondary:** Senior citizens (65+) — household tech, accessibility-first, scam protection
- **Priority verticals:** Law firms, CPA/accounting, medical/dental, home healthcare, insurance, financial advisors, independent pharmacies, senior living facilities
- **Not targeting:** Florida market (removed), national franchises, enterprise (50+ users)

---

## 4. Infrastructure Reality vs. Aspiration

| Item | Current Reality | Future Goal |
|------|-----------------|-------------|
| Server | Consumer PC (Proxmox VM) → new server arriving Apr 2026 | Dedicated server rack |
| Power | Standard grid power | Solar array + battery storage |
| Data center | No physical data center | 1,500 sq ft purpose-built outbuilding |
| Hosting for clients | Not yet offered | Sovereign Private Hosting once DC built |

**Website language:** Frame solar/data center as a stated goal and roadmap item. Do NOT present as current reality.

---

## 5. Pricing Reference (ERPNext Service Items)

| Item Code | Description | Rate | Type |
|-----------|-------------|------|------|
| SVC-MSP | White Glove Managed IT | $199/mo | Subscription |
| SVC-MSP-SEC | Managed Security Add-On | $49/mo | Subscription |
| SVC-HAAS | HaaS Device Subscription | $149/mo/device | Subscription |
| SVC-AIAPP | AI Custom App Build | $3,000–$8,000 | One-time |
| SVC-SENIOR | Senior Technology Concierge | $79/mo | Subscription |
| SVC-REMOTE | Billable Remote Support (SMB) | $79/hr | Billable hours |
| SVC-ONSITE | Billable On-Site Support (SMB) | $125/hr | Billable hours |
| SVC-SENIOR-ONSITE | Senior On-Site Support | $100/hr | Billable hours |

**SVC-HOSTING ($49/mo)** — item exists in ERPNext but is NOT active until data center is built.
**SVC-HOME** — deprecated (Florida on-site). Replaced by SVC-SENIOR-ONSITE.

---

## 6. 30-Day Launch Plan (Apr 13 – May 12, 2026)

**Goal:** Close first 1–3 MSP clients + first billable engagement by May 12.
**Focus order:** MSP ($199/mo) → Billable Hours ($79/hr remote) → AI Apps ($3K+ build)

| Week | Dates | Focus |
|------|-------|-------|
| 1 | Apr 13–19 | New Proxmox server + stack migration + Stripe + contracts |
| 2 | Apr 20–26 | 50 prospects researched, 35+ cold emails, LinkedIn launch |
| 3 | Apr 27–May 3 | Discovery calls, first close attempt (target Apr 30) |
| 4 | May 4–12 | Deliver, outreach wave 4, billable close, AI app scoping |

**Day 30 success criteria:**
- New Proxmox server live, stack migrated
- 50+ prospects in CRM
- 60+ outreach touches sent
- 5+ discovery calls completed
- 1+ MSP client signed ($199/mo MRR)
- 1+ billable hours engagement
- First AI app scoping call completed

---

## 7. Stack Summary

Full detail in `INTEGRATIONS.md`. Current services:

| Service | Role | URL |
|---------|------|-----|
| Traefik v3 | Reverse proxy | traefik.kecktech.net |
| Authelia | SSO / forward-auth | auth.kecktech.net |
| LLDAP | User directory | lldap.kecktech.net |
| Mailcow | Email server | mail.kecktech.net |
| Zammad | Help desk / ITSM | tickets.kecktech.net |
| ERPNext v16 | CRM, billing, HaaS, projects, AP | ops.kecktech.net |
| Tactical RMM | Remote monitoring + management | rmm.kecktech.net |
| RustDesk | Remote desktop / support tool | ports 21115–21119 |
| Vaultwarden | Password manager | vault.kecktech.net |
| n8n | Workflow automation | n8n.kecktech.net |
| Umami | Analytics | stats.kecktech.net |
| BookStack | Internal knowledge base | bookstack.kecktech.net |
| Custom Wiki | Public help center (seniors + SMB) | help.kecktech.net |
| Astro (kecktech-web) | Public marketing site | www.kecktech.net |
| Custom Dashboard | Internal ops dashboard | dashboard.kecktech.net |
| Customer Portal | Client-facing account portal | portal.kecktech.net |
| Portainer | Container management | Tailscale:9443 |

**Dead / removed from stack:**
- ~~FreeScout~~ → replaced by Zammad
- ~~WikiJS~~ → replaced by BookStack + Custom Wiki
- ~~WordPress~~ → replaced by Astro (still in compose, pending removal)

---

## 8. SLA Commitments (MSP)

| Priority | Response | Definition |
|----------|----------|------------|
| P1 — Critical | 2 hours | Total outage, data loss risk, active breach |
| P2 — High | 4 hours | Major function impaired, multiple users affected |
| P3 — Standard | 24 hours | Single user, non-critical |

Business hours: 8am–6pm CT, Monday–Friday. Emergency P1 after-hours by phone.

---

## 9. Legal & Compliance

- Kansas LLC, Sedgwick County
- No Florida operations (removed)
- Kansas IT services: 0% sales tax (non-taxable service)
- WOTC eligible — disability-owned
- MSP contracts: Month-to-month, 30-day cancellation, Kansas jurisdiction
- MSA required before first service delivery

---

## 10. Prospect Pipeline

50-prospect starter list defined in `Kecktech_50_Prospect_Starter_List.csv`.
Priority tiers: A (law, medical, insurance, financial, pharmacy, senior living) → B (nonprofits, contractors, manufacturers) → C (retail, restaurants, misc).
Managed in ERPNext CRM Lead module. See `ERPNEXT-SETUP-GUIDE.md` for custom field configuration.
