# Kecktech — Remaining Tasks (Ordered by Revenue Priority)

Updated: 2026-03-22 — Gap analysis complete. All code gaps addressed. Dashboard polish, security hardening, and n8n Zammad workflow updated.

**Legend:** `[CLI]` = can be done via code/terminal | `[BROWSER]` = requires manual browser interaction | `[DONE]` = completed

**Standard admin credential (all apps):** `admin@kecktech.net` / `Kecktech2026!`

> **⚠️ LLDAP/SSO credential exception:** LLDAP 0.6.x OPAQUE-LDAP bug — `!` in passwords fails LDAP bind. SSO username/password for Authelia login: `keckadmin` / `Kecktech2026` (no `!`). All other app-specific logins still use `Kecktech2026!`. Do NOT change until upstream fixes the bug.

---

## Five Service Lines (Revenue Priority Order)

| # | Service | Price | ARR Target |
|---|---------|-------|-----------|
| 1 | White Glove Managed IT (MSP) | $199/mo/client | $477,600 |
| 2 | Hardware-as-a-Service (HaaS) | $149/mo/device | $268,200 |
| 3 | AI Custom App Development | $3K–$8K/build | $240,000 |
| 4 | Senior Technology Concierge | $79/mo/client | $94,800 |
| 5 | Sovereign Private Hosting | $49/mo/client | $17,640 |

---

## ✅ Completed

| Task | Method |
|------|--------|
| Stack started (all services healthy) | `startup-all.bat` |
| Dashboard healthcheck fixed | Config |
| Authelia LDAP auth fixed — `keckadmin` can log in via SSO | `lldap_set_password` (OPAQUE format, no `!`) |
| TOTP enrolled for `keckadmin` — QR saved at `keckadmin-totp.png` | Authelia CLI |
| Mailcow — `kecktech.net` domain created, DKIM generated | API |
| Mailcow — `admin@kecktech.net` + `support@kecktech.net` mailboxes created | API |
| Authelia SMTP notifier enabled (admin@kecktech.net via Mailcow) | Config + .env |
| Authelia SSO enforcement active (deny default, bypass public, 2FA admins, 1FA staff) | Config |
| LLDAP — `kecktech_admins` + `kecktech_staff` groups + `keckadmin` user created | API |
| n8n — owner account set, 2 workflows imported | SQLite + CLI |
| Umami — password changed, 2 websites created (kecktech.net + help.kecktech.net) | API |
| ERPNext — site `localhost` initialized with `Kecktech2026!` | bench new-site |
| Vaultwarden — signups enabled then locked (account created) | Config |
| WikiJS — 7 pages, high-contrast CSS, iframe rendering, logo, home page | API + DB |
| WordPress — 6 pages live, password reset to `Kecktech2026!` | WP-CLI |
| `scripts/backup.ps1` created | New file |
| `.cursor/rules/kecktech-stack.mdc` updated to 5-service model | CLI |
| **Ops Portal Phase 1** — Tailwind + shadcn/ui, 4-view dashboard (support/billing/sales/ops), sidebar | CLI |
| **LLDAP groups** — `kecktech_billing`, `kecktech_support`, `kecktech_sales` created | API |
| **Authelia** — per-route group policies for new roles | Config |
| **API keys** — TRMM (APIKey model), ERPNext (token), Umami (credentials) | CLI |
| **FreeScout replaced by Zammad** — full ITSM (SLA, time tracking, client portal, REST API) | Docker + CLI |
| **Zammad** — deployed (6 containers), admin account configured, API token set in dashboard | CLI |
| **Dashboard** — Zammad live ticket feed on Support Desk page, health tile on home + ops pages | CLI |
| **Gap analysis** — Full stack + business plan review; all code gaps addressed | CLI |
| **`lib/services.ts`** — Single canonical 12-service list; home/ops/health API all DRY | CLI |
| **MRR/ARR** — `getSubscriptions()` now fetches plans child table + calculates real MRR/ARR | CLI |
| **Timesheet fix** — `from_time`/`to_time` calculated correctly from hours input | CLI |
| **Sales kanban refresh** — `RefreshOnLeadCreate` wrapper calls `router.refresh()` on lead save | CLI |
| **Sidebar active state** — `NavLink` client component uses `usePathname()` for active highlight | CLI |
| **AcknowledgeButton** — Full error state machine (idle/loading/done/error), retry button | CLI |
| **Loading skeletons** — `loading.tsx` for all 4 dashboard pages (support/billing/sales/ops) | CLI |
| **n8n SMS workflow** — Rewritten for Zammad (priority_id, ticket URL, webhook path) | CLI |
| **INTEGRATIONS.md** — Full rewrite: FreeScout/Heimdall removed, Zammad/Dashboard added | CLI |
| **backup.sh** — FreeScout DB removed, Zammad DB added | CLI |
| **docker-compose.yml security** — Hardcoded passwords → env vars, Vaultwarden health check | CLI |
| **`.env.example`** — Added N8N_DEFAULT_PASS, UMAMI_PASS, STRIPE_API_KEY, TWILIO_* vars | CLI |
| **WikiJS pages script** — `scripts/create-wikijs-pages.ps1` with 3 page content blocks | CLI |

---

## Bugs / Fixes

- [x] **`[DONE]` Fix duplicate log lines in backup.sh** — TTY check (`[ -t 1 ]`) routes interactive runs through `tee` and cron runs directly to log file. No duplication.
- [x] **`[DONE]` n8n RMM Alert → Email workflow** — Webhook at `https://n8n.kecktech.net/webhook/rmm-alert` fires and sends email to `support@kecktech.net`. Fixed: DNS resolved to 127.0.0.1 (added `NODE_TLS_REJECT_UNAUTHORIZED=0` env, IP `192.168.65.254` in credential).

---

## Priority 1 — MSP Enablement (Highest Revenue)

### Zammad (tickets.kecktech.net)

- [x] **`[DONE]` Create `tickets@kecktech.net` mailbox in Mailcow** ✅

- [x] **`[DONE]` Configure Zammad email channel** ✅

- [x] **`[DONE]` Create Zammad groups** — `MSP Support`, `HaaS`, `Senior Care`, `Internal` ✅

- [x] **`[DONE]` Create Zammad SLA policies** ✅

- [ ] **`[BROWSER]` Re-import n8n workflow: TRMM alert → Zammad ticket**
  - JSON already updated: `docs/n8n-workflows/rmm-alert-ticket.json`
  - n8n UI → Workflows → Import → select file → create "Zammad API" HTTP Header credential → activate

### Tactical RMM (rmm.kecktech.net)

- [x] **`[DONE]` TRMM initial wizard** — Completed ✅
- [x] **`[DONE]` TRMM alert template** — `Critical Alerts` created, webhook `https://n8n.kecktech.net/webhook/rmm-alert` wired, set as global default ✅

---

## Priority 2 — HaaS Enablement

### Vaultwarden (vault.kecktech.net)

- [x] **`[DONE]` Create Organization `Kecktech Field Tech` + 3 Collections** ✅

### ERPNext (ops.kecktech.net)

- [x] **`[DONE]` Business setup wizard** — Kecktech IT Solutions LLC, USD, Jan–Dec ✅

- [x] **`[DONE]` Create 7 service items** *(via bench CLI)*:

  | Item Name | Code | Rate |
  |-----------|------|------|
  | White Glove Managed IT | SVC-MSP | $199/mo |
  | HaaS Device Subscription | SVC-HAAS | $149/mo/device |
  | AI Custom App Build | SVC-AIAPP | $3,000–$8,000 |
  | Senior Technology Concierge | SVC-SENIOR | $79/mo |
  | Sovereign Private Hosting | SVC-HOSTING | $49/mo |
  | Remote Support (hourly) | SVC-REMOTE | $45/hr |
  | In-Home Support (hourly) | SVC-HOME | $85/hr |

- [x] **`[DONE]` Additional ERPNext setup** *(CLI)*:
  - HaaS Item Templates: HAAS-L1, HAAS-L2, HAAS-L3 (attributes: RAM, Storage) ✅
  - Asset Category: `Leased Hardware` → Straight Line, 36mo ✅
  - Tax Template: `Kansas IT Services 0%` (set as default) ✅
  - Timezone: `America/Chicago` ✅
  - CRM Lead Sources added via CLI: `WordPress Form`, `Referral`, `RMM Alert`, `Cold Call`, `Manual` ✅
  - SVC-MSP-SEC item created: Managed Security Add-On, $49/mo ✅
  - HaaS Lease Agreement print format created (Sales Order) ✅

---

## Priority 3 — AI App Dev Enablement

*(ERPNext project billing is the main enabler — covered above in Priority 2)*

---

## Priority 4 — Senior Concierge Enablement

### WikiJS (help.kecktech.net)

- [x] **`[DONE]` Core setup** — 7 pages, high-contrast CSS, iframe rendering, home page ✅
- [x] **`[DONE]` Add 3 new pages** — Created via GraphQL API ✅
  - `/what-is-managed-it` (id=8), `/ai-custom-apps` (id=9), `/your-private-hosting` (id=10)

### RustDesk — Configure client devices

- [ ] **`[BROWSER]` Configure each client device**:
  - Install RustDesk on each senior/client device
  - ID Server = Windows host Tailscale IP, Relay = same, Key = from `docker/data/rustdesk_data/`
  - Record each senior client's RustDesk ID in Vaultwarden `Client Profiles`

---

## Phase 4 — Integrations

- [ ] **`[BROWSER]` Test WordPress → Zammad email flow**
  - Submit contact form on `kecktech.net/contact/` → verify email arrives at `tickets@kecktech.net` → verify Zammad auto-creates ticket

- [ ] **`[BROWSER]` Wire Tactical RMM → n8n webhook** *(verify still active after Zammad migration)*
  - TRMM: Alerts → Alert Templates → confirm Webhook URL: `https://n8n.kecktech.net/webhook/rmm-alert`

- [x] **`[DONE]` Embed Umami tracking in WordPress** — mu-plugin `kecktech-umami.php` injects script on all pages

- [x] **`[DONE]` Embed Umami tracking in WikiJS** — Umami v2, Site ID `23abf02f-dbf6-4586-aa05-475ff23ae539`

- [ ] **`[DEFERRED]` Twilio SMS** — Add Account SID + Auth Token to n8n credentials when ready.
- [ ] **`[DEFERRED]` Stripe** — Configure ERPNext payment gateway with Stripe keys when account is ready.

---

## WordPress Content Update (5-Service Model)

- [x] **`[DONE]` Update WordPress content** *(CLI via WP-CLI)*
  - **Home**: Hero → "IT That Works. Priced for Business." + 5-service overview
  - **Services**: 5-card grid (MSP, HaaS, AI App Dev, Senior Concierge, Private Hosting)
  - **Pricing**: 5 pricing cards + hourly add-ons bar + updated FAQ
  - **About**: Disability-led family IT, Park City KS, 30+ yrs enterprise IT

---

## Windows Backup Setup

- [x] **`[DONE]` Register backup with Windows Task Scheduler** — Task `KecktechBackup` registered, runs daily at 02:00 ✅
- [x] **`[DONE]` Backup tested manually** — Confirmed working ✅

---

## Phase 8 — Production Deploy (Last — Do Not Start Until All Above Done)

- [ ] Install `cloudflared` on Windows host (or dedicated device)
- [ ] Create Cloudflare Tunnel (`kecktech-tunnel`)
- [ ] Configure tunnel ingress for **public apps only**: `kecktech.net`, `help.kecktech.net`, `tickets.kecktech.net`
- [ ] Configure as Windows service (or Task Scheduler)
- [ ] Add CNAME records in Cloudflare DNS for public subdomains
- [ ] Add MX, SPF, DKIM, DMARC records for `kecktech.net` email
- [ ] Update SITE_URL env vars to production URLs
- [ ] Verify Florida contractor Tailscale access to internal apps
- [ ] Final go-live verification: public sites + internal apps + email deliverability

---

## Umami Tracking Script IDs

| Site | Domain | Umami ID |
|------|--------|----------|
| Kecktech WordPress | kecktech.net | `d2427fe3-ce4b-4b9a-8e41-a8a3e9f2cd6d` |
| Kecktech Knowledge Base | help.kecktech.net | `23abf02f-dbf6-4586-aa05-475ff23ae539` |

Embed script (replace `SITE_ID`):
```html
<script defer src="https://stats.kecktech.net/script.js" data-website-id="SITE_ID"></script>
```

---

## Summary

| Category | Remaining | CLI | Browser | Deferred |
|----------|-----------|-----|---------|----------|
| Bugs/Fixes | 0 | — | — | — |
| Priority 1 (MSP/Zammad) | 1 | — | 1 | — |
| Priority 2 (HaaS/ERPNext) | 0 | — | — | — |
| Priority 4 (Senior/WikiJS) | 0 | — | — | — |
| Phase 4 (Integrations) | 4 | — | 2 | 2 |
| Backup setup | 0 | — | — | — |
| Phase 8 (Production) | 9 | — | 9 | — |
| **Total** | **14** | **0** | **12** | **2** |
