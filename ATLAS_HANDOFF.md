# ATLAS HANDOFF — Kecktech IT Solutions Dashboard Monorepo (v2, Exhaustive)

> Generated: 2026-04-15 | Repo: `f:\Github\Dashboard` | Branch: `main`
> This is an expanded second pass. Scope widened to include removed/deprecated features, historical artifacts, all `docs/prompts/` specs, and files missed in v1.

---

## 0. Scope Confirmation

This pass scanned **48 project markdown files** (excluding `node_modules/`). v1 surfaced ~22. Newly discovered files include:

- `dashboard.md` at repo root (master project atlas)
- `docker/PORTS.md`, `docker/README.md`, `docker/wordpress/README.md`
- 10 custom app specs under `docs/prompts/custom-apps/`
- 3 platform service specs under `docs/prompts/platform-services/`
- Duplicate Brand Guide copies (`.claude/` and `docs/`)
- Mailcow submodule docs (4 files — likely vendor)
- Additional API routes: `/api/invoices/[id]/submit`, `/api/devices/[id]`
- Deprecated PowerShell / JS scripts (WordPress / WikiJS artifacts)

Any claim below is cited to its source file path.

---

## 1. One-Paragraph Purpose Summary

This repository is the full operational software and infrastructure stack for **Kecktech IT Solutions LLC**, a family-owned, disability-led, Kansas-based managed service provider (MSP) headquartered in Park City, KS (`docs/BUSINESS-CONTEXT.md`, `website/src/data/contact.json`). The stack serves four service lines — White Glove Managed IT ($199/mo), Hardware-as-a-Service ($149/mo/device), AI Custom App Development ($3K–$8K), and Senior Technology Concierge ($79/mo) (`website/src/data/pricing.json`) — and provides: a Next.js 15 internal ops dashboard integrating ERPNext (CRM/billing/ERP), Zammad (helpdesk), Tactical RMM (monitoring), LLDAP (directory), Umami (analytics), and RustDesk (remote support) (`dashboard/src/lib/*.ts`); an Astro 5 public marketing site with a Node.js admin content editor (`website/`); a Next.js 14 customer self-service portal (`customer-portal/`); a Next.js 15 + Prisma custom wiki/knowledge base replacing BookStack (`custom-wiki/`); a complete Docker Compose infrastructure stack on Proxmox with Traefik v3.6.10 reverse proxy, Authelia SSO, Vaultwarden secrets, n8n automation, Portainer, BookStack, Mailcow, and PHP contact-form mailer (`docker/docker-compose.yml`); and a library of 10 custom-app specs + 3 platform-service specs as future development templates (`docs/prompts/custom-apps/`, `docs/prompts/platform-services/`). As of April 15, 2026, the business is in a 30-day pre-launch ramp (Apr 13 → May 12, 2026) targeting first paying MSP client (`docs/BUSINESS-CONTEXT.md`, `docs/REMAINING-TASKS.md`).

---

## 2. Top-Level Folder Structure (Complete)

| Folder | Purpose | Source |
|---|---|---|
| `.claude/` | Claude Code project instructions + Brand Guide | `.claude/Claude.md`, `.claude/Kecktech_Brand_Guide_2025.docx.md` |
| `.cursor/` | Cursor IDE rules | `.cursor/rules/kecktech-stack.mdc` |
| `.vscode/` | VSCode workspace settings | — |
| `backups/` | Dated database/volume backups | `docs/restore.md`, `scripts/backup.sh` |
| `bookstack/` | BookStack migration + XLSX import pipeline + empty `articles/` dir | `bookstack/package.json`, `bookstack/IMPORT-RUNBOOK.md` |
| `custom-wiki/` | Custom Next.js wiki (BookStack replacement) | `custom-wiki/README.md`, `custom-wiki/prisma/schema.prisma` |
| `customer-portal/` | Next.js 14 customer self-service portal | `customer-portal/package.json` |
| `dashboard/` | Next.js 15 internal ops dashboard (primary app) | `dashboard/package.json` |
| `docker/` | Docker Compose stack + all service configs + ports doc + WordPress legacy data | `docker/docker-compose.yml`, `docker/PORTS.md`, `docker/README.md` |
| `docs/` | Primary documentation (20+ files) + `prompts/` subtree | `docs/` |
| `erpnext/` | ERPNext (Frappe Docker) setup | `erpnext/README.md` |
| `img/` | Image assets | — |
| `mailcow/` | Mailcow email server (submodule/vendor — includes vendor docs) | `mailcow/README.md`, `mailcow/SECURITY.md` |
| `scripts/` | Bash + PowerShell automation (active + deprecated) | `scripts/` |
| `tactical/` | Tactical RMM config | `docker/docker-compose.yml` |
| `website/` | Astro 5 public site + Express.js admin console | `website/package.json`, `website/admin/server.js` |

---

## 3. Complete Markdown File Inventory (48 files)

### Root (5 files)
- `dashboard.md` — **MASTER PROJECT ATLAS**: full service inventory, stack details, removed services (newly-surfaced v2)
- `PROJECT_PLAN.md` — 8-phase delivery roadmap with infrastructure setup, 62 KB
- `CUSTOMER-ONBOARDING.md` — 6-step customer account provisioning
- `bookstack-pipeline-guide.docx.md` — 6-phase BookStack XLSX import pipeline (638 lines, Mar 24 2026)

### `.claude/` (2 files)
- `.claude/Claude.md` — Workflow orchestration rules (plan mode, subagents, verification, task management)
- `.claude/Kecktech_Brand_Guide_2025.docx.md` — Brand standards (colors, typography, voice, accessibility)

### `docs/` (20 files)
- `docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md` — **OUTDATED**: references removed WordPress/WikiJS/FreeScout
- `docs/BOOKSTACK-PARITY-CONTRACT.md` — Visual parity requirements (header, nav, CTA, mobile)
- `docs/BOOKSTACK-PARITY-VALIDATION.md` — BookStack failed parity; custom-wiki chosen
- `docs/BUSINESS-CONTEXT.md` — **MASTER**: legal entity, services, 30-day launch plan (supersedes `business_launch.md`)
- `docs/business_launch.md` — **STALE / DEPRECATED**: old Florida ops, superseded
- `docs/CUSTOM-WIKI-ARCHITECTURE.md` — Runtime topology, data models, API, security
- `docs/CUSTOM-WIKI-CUTOVER.md` — Runbook for help.kecktech.net migration
- `docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md` — Portal gaps + priority build order + ready-to-deploy code
- `docs/DAILY-TASKS.md` — Solo operator checklists (189 lines)
- `docs/ERPNEXT-SETUP-GUIDE.md` — 18-step ERPNext config (404 lines)
- `docs/HTTPS-TEST-ENV.md` — mkcert cert setup for test env
- `docs/INTEGRATIONS.md` — 27 services, flows, credentials, SSO routes (131 lines)
- `docs/Kecktech_Brand_Guide_2025.docx.md` — Duplicate of `.claude/` brand guide (410 lines)
- `docs/PROCESS-MAP.md` — 8 end-to-end business processes with automation status
- `docs/REMAINING-TASKS.md` — Priority 1–4 task list with completion status (177 lines)
- `docs/RUSTDESK-ACCESS.md` — RustDesk server + client config
- `docs/TAILSCALE-TEST-ENV.md` — Private test env via Tailscale IP + hosts file
- `docs/WINDOWS-DOCKER-RECOVERY.md` — Recovery for wp-db corruption, Mailcow Dovecot
- `docs/restore.md` — Stack restore for all databases/volumes
- `docs/ssh-hardening.md` — SSH lockdown to Tailscale-only

### `docs/prompts/` (14 files — newly surfaced v2)
- `docs/prompts/PROJECT-CONTEXT.md` — Master project context for platform + apps
- `docs/prompts/.cursorrules` — Cursor IDE rules (TypeScript strict, Next.js 14+, Prisma, etc.)
- `docs/prompts/custom-apps/01-crm.md` — CRM app template
- `docs/prompts/custom-apps/02-project-management.md` — Project management template
- `docs/prompts/custom-apps/03-invoicing.md` — Invoicing template
- `docs/prompts/custom-apps/04-appointment-booking.md` — Appointment booking template
- `docs/prompts/custom-apps/05-inventory.md` — Inventory management template
- `docs/prompts/custom-apps/06-helpdesk.md` — Helpdesk template
- `docs/prompts/custom-apps/07-hr-portal.md` — HR portal template
- `docs/prompts/custom-apps/08-document-management.md` — Document management template
- `docs/prompts/custom-apps/09-form-builder.md` — Form builder template
- `docs/prompts/custom-apps/10-dashboard-reporting.md` — Dashboard/reporting template
- `docs/prompts/platform-services/bookstack-migration.md` — BookStack migration spec
- `docs/prompts/platform-services/peertube-video-platform.md` — PeerTube platform architecture
- `docs/prompts/platform-services/rocketchat-service.md` — Rocket.Chat service setup

### `docker/` (3 files — v1 missed PORTS and READMEs)
- `docker/PORTS.md` — **NEW v2**: Complete port inventory (80, 8000-9443, 3000-3001, 21115-21119)
- `docker/README.md` — **NEW v2**: Stack startup, migration notes, RustDesk, WordPress branding, HTTPS
- `docker/wordpress/README.md` — **NEW v2**: WordPress branding plugin + logo config (DEPRECATED service)

### `bookstack/` (1 file)
- `bookstack/IMPORT-RUNBOOK.md` — XLSX import process (pilot, full rollout, acceptance)

### `custom-wiki/` (2 files)
- `custom-wiki/README.md` — Service overview (Next.js, PostgreSQL, API, migration path)
- `custom-wiki/THIRD_PARTY_ASSETS.md` — Attribution for Help Center hero image (Wikimedia CC BY-SA 4.0)

### `erpnext/` (1 file)
- `erpnext/README.md` — Frappe Docker setup (site creation, port 8080, 404 fix, login)

### `mailcow/` (4 files — likely vendor/submodule)
- `mailcow/CODE_OF_CONDUCT.md` — Vendor community CoC
- `mailcow/CONTRIBUTING.md` — Vendor contribution guidelines
- `mailcow/README.md` — Vendor main documentation
- `mailcow/SECURITY.md` — Vendor security policy

### Not Found
- No `tasks/todo.md` or `tasks/lessons.md` exist despite CLAUDE.md referencing them
- No `CHANGELOG.md`, `HISTORY.md`, `ARCHIVE.md`, `NOTES.md` at any level
- No `.cursorrules` at repo root (only `docs/prompts/.cursorrules`)
- No `PIV*` files; no "PIV command" references anywhere in repo
- `bookstack/articles/` directory exists but is EMPTY (KB-XXXX_slug.md generation not yet begun — `bookstack-pipeline-guide.docx.md`)

---

## 4. Package.json Inventory

### `dashboard/package.json`
- **Name**: `kecktech-dashboard` | **Version**: `1.0.0` | Private
- **Framework**: Next.js 15.5.12, React 19.1.0, TypeScript 5.8.0
- **Key deps**: `@tanstack/react-query@5.95.0`, `@dnd-kit/core` + `sortable`, `mysql2@3.20.0`, `tailwindcss@4.2.2`, `lucide-react`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `clsx`
- **Scripts**: `dev`, `build`, `start`

### `custom-wiki/package.json`
- **Name**: `custom-wiki` | **Version**: `1.0.0`
- **Description**: Custom wiki (BookStack fallback)
- **Framework**: Next.js 15.2.0, React 19.0.0
- **Key deps**: `@prisma/client@6.6.0`, `marked@15.0.12`, `sanitize-html`, `zod`, `dotenv`, `node-fetch`
- **Scripts**: `dev` (port 3011), `build`, `start`, `prisma:generate`, `prisma:migrate`, `migrate:html`, `validate:articles`, `remediate:articles`

### `customer-portal/package.json`
- **Name**: `kecktech-customer-portal` | **Version**: `1.0.0`
- **Description**: Client-facing account portal
- **Framework**: Next.js 14.2.29, React 18.3.1
- **Scripts**: `dev` (port 3012), `build`, `start`, `lint`

### `website/package.json`
- **Framework**: Astro ^5.6.1
- **Scripts**: `dev` (port 4321), `build`, `preview`

### `website/admin/package.json`
- **Deps**: `express`, `multer`
- **Purpose**: JSON content editor for Astro site with photo uploads + build trigger

### `bookstack/package.json`
- **Deps**: `dotenv`, `node-fetch`, `pg`, `xlsx`
- **Scripts**: `migrate`, `hierarchy`, `upload`, `pilot`, `full-import`, `xlsx-customwiki-dry`, `xlsx-customwiki-live`, `review-queue`, `category-corrections`

---

## 5. Current Status

### ✅ Working / Deployed

- Traefik v3.6.10 reverse proxy + TLS (`docker/docker-compose.yml`)
- Authelia SSO w/ role-based access (`docker/authelia/configuration.yml`)
- LLDAP directory w/ 6 groups (`dashboard/src/lib/auth.ts`)
- Zammad helpdesk (7 containers: db, redis, init, railsserver, nginx, websocket, scheduler) (`docker/docker-compose.yml`)
- Tactical RMM (`dashboard/src/lib/trmm.ts`)
- Vaultwarden, n8n 2.11.2, Umami, Portainer (`docker/docker-compose.yml`)
- RustDesk relay + ID server (`scripts/start-rustdesk-server.sh`)
- Astro public site (5 pages) (`website/src/pages/`)
- Dashboard pages: Home, Support, Sales, Ops, Billing, SLA Reports, Onboarding Wizard (`dashboard/src/app/`)
- Node.js admin console with live build trigger (`website/admin/server.js`)
- BookStack migration + XLSX import pipeline scripts (`bookstack/*.js`)
- Custom-wiki Prisma schema + import scripts (`custom-wiki/prisma/schema.prisma`, `bookstack/import-xlsx-to-custom-wiki.js`)
- Traefik v3 upgrade complete (Apr 2026) (`docs/BUSINESS-CONTEXT.md`)

### 🟡 Stubbed / Partial

- **Custom-wiki application** — schema + import done; Next.js app routes scaffolded; cutover not executed (`docs/CUSTOM-WIKI-CUTOVER.md`)
- **ERPNext configuration** — 18-step guide partially done; Stripe + letterhead + email templates + subscriptions pending (`docs/ERPNEXT-SETUP-GUIDE.md`, `docs/REMAINING-TASKS.md`)
- **Customer portal** — scaffold exists; NOT built: RustDesk route, contracts card, invoice history, TRMM device panel, Stripe, BookStack gating (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- **Contact form → Zammad webhook** — documented but not end-to-end tested (`docs/INTEGRATIONS.md`, `docs/REMAINING-TASKS.md` P3)
- **Stripe payments** — env vars in `.env.example`; not wired (`docker/.env.example`, `docs/REMAINING-TASKS.md` P3)
- **MSA (Master Service Agreement)** — listed as go-live blocker, not drafted (`docs/REMAINING-TASKS.md` P3)
- **Mailcow production DNS** — SMTP works; MX/SPF/DKIM/DMARC pending (`docs/REMAINING-TASKS.md`)
- **HTTPS local test env** — mkcert documented, not confirmed (`docs/HTTPS-TEST-ENV.md`, `scripts/setup-mkcert-traefik.ps1`)
- **BookStack articles directory** — empty; 505+ article generation not commenced (`bookstack/articles/`, `bookstack-pipeline-guide.docx.md`)
- **`startup-all`** still echoes "WordPress, WikiJS, Heimdall" in output (stale — services not actually started) (`startup-all:20-21`)

### ⛔ Removed / Deprecated (See §12 for full detail)

- **WordPress** — removed Apr 2026, replaced by Astro. `./data/wp_data/` (~1.5 GB) still on disk pending cleanup (`docker/docker-compose.yml:5-6`, `docs/REMAINING-TASKS.md:55-56`)
- **WikiJS** — removed Apr 2026, replaced by BookStack + Custom Wiki (`docker/docker-compose.yml:728`, `scripts/backup.sh:4,75-76`)
- **FreeScout** — replaced by Zammad (`vboxuser_freescout_data` volume preserved) (`scripts/backup.sh:105-106`)
- **Heimdall** — pre-Apr 2026 removal; home page replaced by Traefik + Custom Dashboard (`scripts/migrate-to-project.sh:11-18`)
- **Florida operations** — removed from business model (`docs/BUSINESS-CONTEXT.md:166`)
- **SVC-HOME ERPNext service item** — deprecated Apr 2026, replaced by SVC-SENIOR-ONSITE (`docs/ERPNEXT-SETUP-GUIDE.md:76`)
- **Traefik v2** — upgraded to v3.6.10 Apr 2026 (`docker/docker-compose.yml`)
- **`docs/STACK-ISSUES-REMEDIATION-PLAN.md`** — deleted (git status `D`)
- **`docs/TROUBLESHOOTING.md`** — deleted
- **`docs/WORDPRESS-RESTORE-WINDOWS.md`** — deleted

---

## 6. Exhaustive Feature List (with citations)

> Features are grouped by area. Deprecated features are noted inline.

### 6.1 Dashboard — Internal Ops App

- Service health status dashboard with per-service latency + up/down (`dashboard/src/app/page.tsx`)
- Drag-and-drop reordering with localStorage persistence (`dashboard/src/components/TileGrid.tsx`)
- Header "X/Y services up" summary (`dashboard/src/app/page.tsx`)
- Chicago timezone "last checked" timestamp (`dashboard/src/app/page.tsx`)
- Role-based sidebar nav (`dashboard/src/components/Sidebar.tsx`)
- TRMM alert panel with severity badges (critical/high/warning/info) (`dashboard/src/app/support/page.tsx`)
- One-click "create ticket from alert" (`dashboard/src/app/api/alerts/[id]/ticket/route.ts`)
- Zammad ticket queue with expandable threads (`dashboard/src/components/TicketPanel.tsx`)
- Inline ticket reply (external + internal) (`dashboard/src/app/api/tickets/[id]/reply/route.ts`)
- Ticket state change dropdown inline (`dashboard/src/components/TicketPanel.tsx`)
- SLA countdown timer: high 4h, normal 24h, low 72h (`dashboard/src/lib/zammad.ts`)
- RustDesk remote session request — posts instructions as ticket article (`dashboard/src/app/support/page.tsx`)
- RustDesk server config display + copy buttons (`dashboard/src/components/RustDeskPanel.tsx`)
- Zammad live chat active sessions list (`dashboard/src/app/support/page.tsx`)
- Billable time entry form with customer dropdown → ERPNext (`dashboard/src/components/TimeEntryForm.tsx`)
- Quick links: ERPNext, Zammad, Vault, docs (`dashboard/src/app/support/page.tsx`)
- Sales KPI cards: pipeline, new leads this week, conversion, opportunities, weighted forecast, avg deal size, Umami visitors (`dashboard/src/app/sales/page.tsx`)
- Lead kanban: New → Open → Replied → Opportunity → Quotation → Interested (`dashboard/src/components/SalesBoard.tsx`)
- Drag-drop lead stage transitions (updates ERPNext) (`dashboard/src/components/SalesBoard.tsx`)
- Lead detail drawer: notes, contact info, convert to opportunity, create quote (`dashboard/src/components/SalesBoard.tsx`)
- Opportunity pipeline with amount × probability forecast (`dashboard/src/app/sales/page.tsx`)
- Follow-up queue for stale leads (3+ days no contact) (`dashboard/src/app/sales/page.tsx`)
- Add lead form (`dashboard/src/components/NewLeadForm.tsx`)
- Ops alert summary bar (`dashboard/src/app/ops/page.tsx`)
- Customer health overview table: offline %, alerts, overdue, health score (`dashboard/src/app/ops/page.tsx`)
- Health scoring: red if critical alerts OR >50% offline OR (overdue + alerts); amber if any (`dashboard/src/app/ops/page.tsx`)
- Expandable client device cards (`dashboard/src/components/ClientGroupCard.tsx`)
- HaaS device lifecycle table with 48/36 month thresholds (`dashboard/src/app/ops/page.tsx`)
- Stack health grid on ops page (`dashboard/src/app/ops/page.tsx`)
- Customer onboarding wizard — 5 steps (`dashboard/src/app/ops/onboarding/page.tsx`)
- Auto-generate 18-char password (show/hide/copy/regenerate) (`dashboard/src/app/ops/onboarding/page.tsx`)
- Auto-derive username from full name (`dashboard/src/app/ops/onboarding/page.tsx`)
- LLDAP GraphQL user + group create (`dashboard/src/app/api/ops/onboard/lldap/route.ts`)
- Zammad org lookup + customer user create (`dashboard/src/app/api/ops/onboard/zammad/route.ts`)
- ERPNext customer verification (`dashboard/src/app/api/ops/onboard/erpnext/route.ts`)
- Onboarding credentials summary with deep links (`dashboard/src/app/ops/onboarding/page.tsx`)
- Billing KPIs: MRR, ARR, outstanding AR, unbilled hours, net AR-AP, 30-day collections (`dashboard/src/app/billing/page.tsx`)
- AR aging buckets (current / 1-30 / 31-60 / 61+) (`dashboard/src/app/billing/page.tsx`)
- Overdue follow-up queue with email reminder mailto (`dashboard/src/app/billing/page.tsx`)
- AR invoice table + record payment (`dashboard/src/components/InvoiceActions.tsx`)
- "Bill Unbilled Hours" batch invoice from timesheets (`dashboard/src/components/InvoiceActions.tsx`)
- New Invoice modal with line items + service codes (`dashboard/src/components/InvoiceActions.tsx`)
- Invoice submit action (**NEW v2**) (`dashboard/src/app/api/invoices/[id]/submit/route.ts`)
- Timesheets table (date, tech, customer, hours, billed status) (`dashboard/src/app/billing/page.tsx`)
- AP purchase invoice table + mark paid (`dashboard/src/components/InvoiceActions.tsx`)
- New Bill modal for vendor expenses (`dashboard/src/components/InvoiceActions.tsx`)
- AI dev projects table with progress, milestone invoice link (`dashboard/src/app/billing/page.tsx`)
- MRR/ARR from ERPNext subscription plan child tables (`dashboard/src/lib/erpnext.ts`)
- SLA compliance report with date range, per-client table, per-ticket table (`dashboard/src/app/reports/sla/page.tsx`)
- SLA CSV export (`dashboard/src/components/SlaExportButton.tsx`)
- Device/agent detail API (**NEW v2**) (`dashboard/src/app/api/devices/[id]/route.ts`)
- Alert acknowledge action (`dashboard/src/components/AcknowledgeButton.tsx`, `dashboard/src/app/api/trmm-alert/[id]/route.ts`)
- Services registry with 15+ services (`dashboard/src/lib/services.ts`)
- TRMM https module with Host header override (undici workaround) (`dashboard/src/lib/trmm.ts`)
- Umami JWT auth + 7-day metrics (`dashboard/src/lib/umami.ts`)
- Next.js standalone output mode for Docker (`dashboard/next.config.ts`)

### 6.2 Public Website

- 5-page Astro static site: index, about, services, pricing, contact (`website/src/pages/`)
- "Kansas IT That Actually Cares" hero + CTAs (`website/src/data/home.json`)
- 4 service cards on home page with pricing (`website/src/data/home.json`)
- 4 value propositions: solar-powered, disability-led, Kansas data, real humans (`website/src/data/home.json`)
- About page: mission, 5 values, team, facility fundraising goal (`website/src/data/about.json`)
- Solar facility goal: 25 kW array, 100 kWh battery, 1,500 sq ft, $250K fundraising, PayPal (`website/src/data/about.json`)
- Services detail with feature checklists (`website/src/data/services.json`)
- Pricing with 4 cards, 6-item FAQ (`website/src/data/pricing.json`)
- Contact form (4 request types), 2-hour response target (`website/src/data/contact.json`)
- Phone (316) 768-0034, email support@kecktech.net, Mon–Fri 8am–6pm CST + emergency (`website/src/data/contact.json`)
- Node.js Express admin editor with recursive form rendering (`website/admin/server.js`)
- Photo upload widget with Multer (JPG/PNG/WebP, 10 MB limit) (`website/admin/server.js`)
- Build trigger + live build log streaming via polling (`website/admin/server.js`)
- Admin routes: `/page/:name`, `/save/:name`, `/preview/:name`, `/upload/photo`, `/build`, `/build/status` (`website/admin/server.js`)

### 6.3 Infrastructure

- Traefik v3.6.10 reverse proxy (`docker/docker-compose.yml`)
- Authelia SSO + LLDAP (`docker/authelia/configuration.yml`)
- Mailcow email (external SMTP relay mail.kecktech.net:587) (`docker/authelia/configuration.yml`)
- Zammad 7-container stack (`docker/docker-compose.yml`)
- Vaultwarden, n8n, Umami, RustDesk, Portainer, BookStack, Custom Wiki, PHP mailer (`docker/docker-compose.yml`)
- ERPNext/Frappe separate Docker stack (`erpnext/README.md`)
- Tailscale-only SSH lockdown (`scripts/ssh-harden.sh`)
- UFW: 80, 443, SMTP/IMAP/POP3, RustDesk 21115-21119, NATS 4222 (`scripts/ssh-harden.sh`)
- Complete port inventory documentation (**NEW v2**) (`docker/PORTS.md`)
- Docker project name `vboxuser` (preserves legacy volumes) (`docker/docker-compose.yml`)
- Networks `kecktech_front` + `kecktech_internal` (external, pre-created) (`docker/docker-compose.yml`)
- Env var template with all credentials (`docker/.env.example`)
- Authelia access rules (§11)

### 6.4 BookStack / Knowledge Base

- WikiJS → BookStack migration via REST API (`bookstack/migrate-wikijs.js`)
- XLSX → BookStack hierarchy (shelf/book/chapter) (`bookstack/create-hierarchy.js`)
- XLSX → BookStack articles w/ markdown + tags (`bookstack/upload-articles.js`)
- Pilot mode (25 articles) vs full (`bookstack/run-import.js`, `bookstack/IMPORT-RUNBOOK.md`)
- WikiJS → Custom Wiki migration (`bookstack/migrate-wikijs-to-custom-wiki.js`)
- XLSX → Custom Wiki with structured markdown (7 sections: Quick Summary, When To Use, Readiness Check, Step-by-Step, Advanced Checks, Safety Notes, Escalation) (`bookstack/import-xlsx-to-custom-wiki.js`)
- Category remediation for Windows PC, Laptops, Smartphones, Business Tech (`bookstack/apply-category-corrections.js`)
- Review queue markdown generation (`bookstack/generate-review-queue.js`)
- System import user seeding (`bookstack/seed-custom-wiki-token.js`)
- Page/book/shelf/chapter count utilities (`bookstack/count-custom-wiki.js`, `list-custom-wiki-pages.js`)
- Dry-run mode across all importers
- BookStack pipeline 6-phase guide: Deploy → Hierarchy → AI Content Gen → Review → Bulk Upload → Maintenance (`bookstack-pipeline-guide.docx.md`, 638 lines)
- Visual parity contract with kecktech.net (failed, led to custom-wiki) (`docs/BOOKSTACK-PARITY-CONTRACT.md`)

### 6.5 Custom Wiki

- Next.js 15 + PostgreSQL + Prisma (`custom-wiki/package.json`)
- 14-model Prisma schema (§9)
- Soft deletes on most models
- RBAC with optional content-scoped permissions
- Threaded comments on pages
- Page revision history with versioning
- Dual Markdown + HTML storage per page
- Review workflow: DRAFT → IN_REVIEW → APPROVED → NEEDS_FIX
- Visibility: PUBLIC / AUTHENTICATED / PRIVATE
- Fact checklist JSON per page
- API tokens with hash storage
- Audit log with 7 action types
- HTML migration, article validation, article remediation scripts

### 6.6 Customer Portal (planned — not built)

- Authelia-gated portal at portal.kecktech.net (`docker/authelia/configuration.yml`)
- **Planned** (not built, per `docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`):
  - RustDesk API route
  - Contracts card (view/sign MSA)
  - Invoice history + PDF download
  - TRMM device panel (customer's devices)
  - Stripe payment integration
  - BookStack/wiki content gating
  - Ready-to-deploy code samples provided in gap analysis doc

### 6.7 Business Processes (`docs/PROCESS-MAP.md`, 8 processes)

- Customer acquisition: lead → discovery → proposal → MSA → payment → onboarding
- MSP onboarding: LLDAP → Vaultwarden → Zammad → ERPNext → TRMM → RustDesk → portal
- Daily support ops: n8n morning briefing → dashboard → tickets → alerts → time logging
- Monthly billing cycle: timesheet review → invoice draft → payment → AP reconciliation
- HaaS lifecycle: selection → lease → monitoring → 48-mo refresh → recycling
- AI app development: discovery → proposal → build → review → deploy → support
- Senior concierge: onboarding call → monthly check-ins → scam alerts → device cleanup
- Accounts payable: vendor bills → approval → payment via ERPNext

### 6.8 Custom App Specs (future templates, `docs/prompts/custom-apps/`)

- **CRM** (`01-crm.md`)
- **Project Management** (`02-project-management.md`)
- **Invoicing** (`03-invoicing.md`)
- **Appointment Booking** (`04-appointment-booking.md`)
- **Inventory Management** (`05-inventory.md`)
- **Helpdesk** (`06-helpdesk.md`)
- **HR Portal** (`07-hr-portal.md`)
- **Document Management** (`08-document-management.md`)
- **Form Builder** (`09-form-builder.md`)
- **Dashboard/Reporting** (`10-dashboard-reporting.md`)

### 6.9 Platform Service Specs (`docs/prompts/platform-services/`)

- **BookStack Migration** (`bookstack-migration.md`)
- **PeerTube Video Platform** architecture (`peertube-video-platform.md`)
- **Rocket.Chat** service setup (`rocketchat-service.md`)

### 6.10 Operational Runbooks

- Customer onboarding runbook (`CUSTOMER-ONBOARDING.md`)
- ERPNext 18-step config guide (`docs/ERPNEXT-SETUP-GUIDE.md`)
- Daily/weekly/monthly/quarterly checklists (`docs/DAILY-TASKS.md`)
- Backup/restore all services (`docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md`, `docs/restore.md`)
- SSH hardening (`docs/ssh-hardening.md`, `scripts/ssh-harden.sh`)
- RustDesk setup (`docs/RUSTDESK-ACCESS.md`)
- HTTPS/mkcert local env (`docs/HTTPS-TEST-ENV.md`)
- Tailscale private test env (`docs/TAILSCALE-TEST-ENV.md`)
- Windows Docker recovery (`docs/WINDOWS-DOCKER-RECOVERY.md`)
- Custom wiki cutover (`docs/CUSTOM-WIKI-CUTOVER.md`)
- BookStack XLSX import runbook (`bookstack/IMPORT-RUNBOOK.md`)

### 6.11 Scripts

**Active**:
- `scripts/ssh-harden.sh` — UFW + sshd lockdown with Tailscale safety check + rollback
- `scripts/disable-ssh-password.sh` — disable password auth
- `scripts/enable-ssh-password-temp.sh` — temp enable for key upload
- `scripts/install-rustdesk-client.sh` — Ubuntu/Debian RustDesk client (amd64/arm64/armhf)
- `scripts/start-rustdesk-server.sh` — relay + ID server + print public key
- `scripts/migrate-to-project.sh` — one-time home dir → `docker/data/` migration (references Heimdall)
- `scripts/run-migration-and-cleanup.sh` — full migration orchestration
- `scripts/verify-and-logs.sh` — status/logs for main + ERPNext stacks
- `scripts/backup.sh` + `scripts/backup.ps1` — daily backups
- `scripts/pull-backups-from-vm.ps1` — backup retrieval from VM
- `scripts/setup-mkcert-traefik.ps1` — local HTTPS cert setup
- `scripts/apply-logo-transparency.py` — image processing

**Deprecated** (WordPress/WikiJS artifacts — scheduled for removal):
- `scripts/apply-wordpress-branding.sh` + `.ps1`
- `scripts/create-wikijs-pages.js` + `.ps1`
- `scripts/reinit-wordpress-db-data.ps1`
- `scripts/restore-wordpress-from-backup.ps1`
- `scripts/revert-homepage-changes.ps1`
- `scripts/update-billing-page.js`

---

## 7. Architectural Decisions & Tech Choices

| Decision | Choice | Source |
|---|---|---|
| Dashboard framework | Next.js 15.5 + React 19, App Router, server components | `dashboard/package.json` |
| Dashboard auth | Header passthrough from Authelia (Remote-User/Email/Groups) | `dashboard/src/lib/auth.ts` |
| Dashboard data access | Direct HTTP to service APIs (no ORM) | `dashboard/src/lib/*.ts` |
| TRMM TLS workaround | Node `https` with Host header override (not undici/fetch) | `dashboard/src/lib/trmm.ts` |
| Custom wiki ORM | Prisma 6.6 + PostgreSQL | `custom-wiki/package.json` |
| Customer portal framework | Next.js 14 | `customer-portal/package.json` |
| Public site | Astro 5 static output | `website/package.json` |
| Reverse proxy | Traefik v3.6.10 w/ Docker labels (upgraded from v2) | `docker/docker-compose.yml` |
| SSO | Authelia + LLDAP | `docker/authelia/configuration.yml` |
| Directory | LLDAP (not OpenLDAP) | `docker/docker-compose.yml` |
| ERP/CRM/Billing | ERPNext/Frappe Docker | `erpnext/README.md`, `docs/ERPNEXT-SETUP-GUIDE.md` |
| Helpdesk | Zammad (replaced FreeScout) | `docker/docker-compose.yml` |
| RMM | Tactical RMM | `dashboard/src/lib/trmm.ts` |
| Remote access | RustDesk (self-hosted) | `docs/RUSTDESK-ACCESS.md` |
| Secrets | Vaultwarden (Bitwarden compat) | `docker/docker-compose.yml` |
| Automation | n8n 2.11.2 | `docker/docker-compose.yml` |
| Analytics | Umami (GDPR-friendly) | `dashboard/src/lib/umami.ts` |
| Email | Mailcow (vendored submodule) + PHP mailer | `mailcow/README.md` |
| Container management | Portainer | `docker/docker-compose.yml` |
| Infrastructure | Docker Compose on Proxmox VMs | `docs/BUSINESS-CONTEXT.md` |
| Network VPN | Tailscale for SSH | `docs/TAILSCALE-TEST-ENV.md` |
| Drag & drop | @dnd-kit (not react-beautiful-dnd) | `dashboard/package.json` |
| State mgmt | TanStack React Query 5 + React hooks (no Redux) | `dashboard/package.json` |
| Styling | Tailwind v4 + shadcn/ui (base-nova style) | `dashboard/package.json` |
| TypeScript | Strict, path alias `@/*` → `./src/*` | `dashboard/tsconfig.json` |
| Next.js output | Standalone (for Docker) | `dashboard/next.config.ts` |
| Cache strategy | `no-store` on all external API calls | `dashboard/src/lib/*.ts` |
| Timeouts | 5s Zammad/health, 8s onboarding | `dashboard/src/lib/zammad.ts` |
| Content editing | JSON data files via Express admin panel | `website/admin/server.js` |
| Knowledge base | Custom Next.js wiki (BookStack failed parity) | `docs/BOOKSTACK-PARITY-VALIDATION.md` |
| Git LF/CRLF | `.gitattributes` — shell=LF, bat=CRLF, rest=auto | `.gitattributes` |
| Code conventions | UUIDs, createdAt/updatedAt, soft deletes, API-first, env vars only | `.cursor/rules/kecktech-stack.mdc`, `docs/prompts/.cursorrules` |
| File naming | PascalCase components/models, camelCase utils, kebab-case API routes | `.cursor/rules/kecktech-stack.mdc` |
| Brand color palette | Navy, gold, teal, green, violet with WCAG AAA | `docs/Kecktech_Brand_Guide_2025.docx.md` |
| Business sovereignty | Self-hosted replacements for SaaS; Kansas data residency | `website/src/data/home.json` |

---

## 8. TODOs & Known Gaps

> Primary source: `docs/REMAINING-TASKS.md`

### Priority 1 — Infrastructure Migration (Blocking)
- [ ] Migrate stack to new Proxmox server
- [ ] Ubuntu 24.04 VM setup
- [ ] Transfer Docker volumes + data
- [ ] Verify all services
- [ ] Update DNS to new IP
- [ ] Remove WikiJS + wp-db from `docker-compose.yml` (dead services, ~1.2 GB RAM wasted) (`docs/REMAINING-TASKS.md:55`)
- [ ] Remove WordPress from `docker-compose.yml` (`docs/REMAINING-TASKS.md:56`)
- [ ] Delete `./data/wp_data/` and `./data/db_data/` directories (~1.5 GB) (`docker/docker-compose.yml:729`)
- [ ] Archive deprecated scripts (WordPress/WikiJS)

### Priority 2 — ERPNext Configuration
- [ ] Complete 18 steps (`docs/ERPNEXT-SETUP-GUIDE.md`)
- [ ] Configure Stripe payment integration
- [ ] Invoice letterhead + email templates
- [ ] Subscription auto-renewal workflow
- [ ] Import leads from prospecting data
- [ ] AP workflow + payment terms
- [ ] Disable SVC-HOME service item (Florida on-site deprecated) (`docs/ERPNEXT-SETUP-GUIDE.md:76`)

### Priority 3 — Go-Live Blockers
- [ ] Test contact form → Zammad via n8n webhook
- [ ] Stripe payment link working for new clients
- [ ] MSA drafted + signed for first client
- [ ] Mailcow production DNS (MX/SPF/DKIM/DMARC)
- [ ] End-to-end portal access test for real customer

### Priority 4 — Customer Portal
- [ ] RustDesk API route (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- [ ] Contracts card (view/sign MSA)
- [ ] Invoice history + PDF
- [ ] TRMM device panel
- [ ] Stripe payment integration
- [ ] BookStack/wiki content gating

### Custom Wiki
- [ ] Complete Next.js app routes
- [ ] Execute cutover runbook (`docs/CUSTOM-WIKI-CUTOVER.md`)
- [ ] Complete article review queue
- [ ] Apply category corrections

### BookStack Articles
- [ ] Generate 505+ articles (6-phase pipeline, `bookstack-pipeline-guide.docx.md`)
- [ ] Populate `bookstack/articles/` (currently empty)

### Dashboard
- [ ] Move hardcoded Umami site ID to env var (`dashboard/src/lib/umami.ts`)
- [ ] TRMM self-signed cert: consider proper cert or env toggle (`dashboard/src/lib/trmm.ts`)
- [ ] Clean `startup-all` echo of removed services (WordPress, WikiJS, Heimdall) (`startup-all:20-21`)

### Business / Sales (30-day launch Apr 13 → May 12, 2026)
- [ ] 50 prospects identified
- [ ] 60+ outreach touches
- [ ] 5+ discovery calls
- [ ] 1+ MSP client signed
- [ ] Billable consulting hours logged
(Source: `docs/BUSINESS-CONTEXT.md`)

### Operational
- [ ] Verify n8n morning briefing end-to-end (`docs/DAILY-TASKS.md`)
- [ ] Confirm backup automation on new server (`scripts/backup.sh`)
- [ ] Test Authelia 2FA for admin routes (`docker/authelia/configuration.yml`)
- [ ] Update `docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md` (currently references removed services)
- [ ] Update `docs/Kecktech_Brand_Guide_2025.docx.md` (references WikiJS)

### No TODO/FIXME in source code
Full repo scan for TODO/FIXME/XXX/HACK/DEPRECATED in `.ts`, `.tsx`, `.js`, `.yml`, `.sh` returned **no results** — all deprecation notes live in docs or comments of docker-compose.

---

## 9. Integration Points

### APIs Consumed by Dashboard

| System | Base URL (env) | Auth | Functions | Source |
|---|---|---|---|---|
| **ERPNext** | `ERPNEXT_URL` (default `http://frappe_docker-frontend-1:8080`) | Token header `token api_key:api_secret` | getOpenInvoices, getPurchaseInvoices, getLeads, createLead, addLeadNote, getOpportunities, createOpportunity, getTimesheets, createTimesheet, createInvoice, createPaymentEntry, createPurchaseInvoice, getSubscriptions, getHaasAssets, getCustomers, getSuppliers | `dashboard/src/lib/erpnext.ts` |
| **Zammad** | `ZAMMAD_URL` (default `http://zammad-railsserver:3000`) | `Authorization: Token token=XXX` | getOpenTickets, getTicketDetail, createTicket, replyToTicket, updateTicket, getClosedTickets, getUsers, getOrganizations | `dashboard/src/lib/zammad.ts` |
| **Tactical RMM** | `TRMM_URL` (default `https://trmm-nginx:4443`) | `X-API-KEY` header | getActiveAlerts, acknowledgeAlert, getAgents, getAgentDetail, getClientGroups | `dashboard/src/lib/trmm.ts` |
| **LLDAP** | `LLDAP_URL` (default `http://lldap:17170`) | GraphQL w/ admin creds → JWT | createUser, addUserToGroup (onboarding only) | `dashboard/src/app/api/ops/onboard/lldap/route.ts` |
| **Umami** | `UMAMI_URL` (default `http://umami:3000`) | User/pass → JWT | getWebsiteStats (7-day rolling: pageviews, visitors, bounces, total time) | `dashboard/src/lib/umami.ts` |
| **RustDesk** | N/A — env vars only | N/A | config string gen, server info display | `dashboard/src/lib/rustdesk.ts` |

### APIs Exposed by Dashboard (Internal — Authelia gated)

| Route | Method(s) | Purpose | Source |
|---|---|---|---|
| `/api/health` | GET | Service health (all or `?service=X`) | `dashboard/src/app/api/health/route.ts` |
| `/api/rustdesk/info` | GET | RustDesk server config | `dashboard/src/app/api/rustdesk/info/route.ts` |
| `/api/tickets` | GET, POST | List open tickets / create ticket | `dashboard/src/app/api/tickets/route.ts` |
| `/api/tickets/[id]` | GET, PATCH | Ticket + articles / update state/priority | `dashboard/src/app/api/tickets/[id]/route.ts` |
| `/api/tickets/[id]/reply` | POST | Add article (external/internal) | `dashboard/src/app/api/tickets/[id]/reply/route.ts` |
| `/api/alerts/[id]/ticket` | POST | Create Zammad ticket from TRMM alert | `dashboard/src/app/api/alerts/[id]/ticket/route.ts` |
| `/api/trmm-alert/[id]` | PATCH | Acknowledge TRMM alert | `dashboard/src/app/api/trmm-alert/[id]/route.ts` |
| `/api/leads` | POST | Create lead | `dashboard/src/app/api/leads/route.ts` |
| `/api/leads/[id]` | GET, PATCH | Lead details / update status | `dashboard/src/app/api/leads/[id]/route.ts` |
| `/api/leads/[id]/notes` | POST | Add note to lead | `dashboard/src/app/api/leads/[id]/notes/route.ts` |
| `/api/opportunities` | POST | Create opportunity from lead | `dashboard/src/app/api/opportunities/route.ts` |
| `/api/invoices` | POST | Create sales invoice | `dashboard/src/app/api/invoices/route.ts` |
| `/api/invoices/[id]/submit` | POST | **NEW v2** — Submit/post invoice | `dashboard/src/app/api/invoices/[id]/submit/route.ts` |
| `/api/invoices/[id]/payment` | POST | Record payment | `dashboard/src/app/api/invoices/[id]/payment/route.ts` |
| `/api/purchase-invoices` | POST | Create purchase invoice | `dashboard/src/app/api/purchase-invoices/route.ts` |
| `/api/purchase-invoices/[id]/payment` | POST | Mark bill paid | `dashboard/src/app/api/purchase-invoices/[id]/payment/route.ts` |
| `/api/timesheet` | POST | Log billable hours | `dashboard/src/app/api/timesheet/route.ts` |
| `/api/devices/[id]` | GET | **NEW v2** — Get device/agent details | `dashboard/src/app/api/devices/[id]/route.ts` |
| `/api/ops/onboard/erpnext` | GET | Customer lookup/verify | `dashboard/src/app/api/ops/onboard/erpnext/route.ts` |
| `/api/ops/onboard/zammad` | POST | Create Zammad customer | `dashboard/src/app/api/ops/onboard/zammad/route.ts` |
| `/api/ops/onboard/lldap` | POST | Create LLDAP user + group | `dashboard/src/app/api/ops/onboard/lldap/route.ts` |

**Total: 21 endpoints, ~24 HTTP methods.**

### n8n Automation Flows (documented; some not verified)

| Flow | Trigger | Action | Source |
|---|---|---|---|
| Contact form → Zammad | Webhook from PHP mailer | Create ticket + auto-reply | `docs/INTEGRATIONS.md` |
| TRMM alert → Zammad ticket | Webhook from TRMM | Create ticket w/ alert details | `docs/INTEGRATIONS.md` |
| RMM SMS alerts | TRMM critical | Twilio SMS to on-call | `docs/INTEGRATIONS.md` |
| Morning briefing | Cron daily | Aggregate metrics → notification | `docs/DAILY-TASKS.md` |

### External Services

| Service | Purpose | Credentials | Source |
|---|---|---|---|
| Stripe | Payment processing | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | `docker/.env.example` |
| Twilio | SMS alerts | `TWILIO_*` | `docker/.env.example` |
| PayPal | Solar facility donations | Hardcoded link | `website/src/data/about.json` |
| Tailscale | VPN / SSH access | — | `docs/TAILSCALE-TEST-ENV.md` |

---

## 10. Data Model Summary

### Custom Wiki Prisma Schema — 14 Models

**Provider**: PostgreSQL | **File**: `custom-wiki/prisma/schema.prisma`

**Enums (4)**:
- `ContentType`: SHELF | BOOK | CHAPTER | PAGE
- `Visibility`: PUBLIC | AUTHENTICATED | PRIVATE
- `AuditAction`: CREATE | UPDATE | DELETE | RESTORE | LOGIN | IMPORT | PERMISSION_CHANGE
- `ReviewStatus`: DRAFT | IN_REVIEW | APPROVED | NEEDS_FIX

**Models**:

| Model | Key Fields | Relations | Notes |
|---|---|---|---|
| `User` | email (unique), name, externalId, deletedAt | roles, comments, revisions, apiTokens, auditLogs | Soft delete |
| `Role` | name (unique), description, deletedAt | bindings, permissions | Soft delete |
| `Permission` | roleId, resource, action, conditions (JSON) | role | Soft delete |
| `RoleBinding` | userId, roleId, scopeType?, scopeId? | user, role | Scoped RBAC |
| `Shelf` | title, slug (unique), description, visibility, sortOrder | books, tags, attachments | |
| `Book` | shelfId, title, slug (per shelf), visibility, sortOrder | shelf, chapters, pages, tags, attachments | |
| `Chapter` | bookId, title, slug (per book), visibility, sortOrder | book, pages, tags, attachments | |
| `Page` | bookId, chapterId?, title, slug, markdown, html, summary, kbId, category, subcategory, reviewStatus, reviewNotes, reviewerId, sourceReferences, factChecklist (JSON), visibility, publishedAt, deletedAt | book, chapter, revisions, comments, tags, attachments | Dual MD+HTML, soft delete |
| `PageRevision` | pageId, version (unique per page), title, markdown, html, authorId | page, author | |
| `Comment` | pageId, authorId, body, parentId? | page, author, parent, replies | Threaded |
| `ContentTag` | name, value | shelves, books, chapters, pages | Polymorphic |
| `Attachment` | fileName, mimeType, fileSize, storagePath | shelf?, book?, chapter?, page? | Polymorphic |
| `ApiToken` | userId, name, tokenHash (unique), expiresAt, lastUsedAt | user | Hashed |
| `AuditLog` | actorId?, action, resourceType, resourceId, payload (JSON), createdAt | actor? | Immutable |

### ERPNext Doctypes Accessed

| Doctype | Purpose | Reference |
|---|---|---|
| `Sales Invoice` | AR invoices, aging, payments | `dashboard/src/lib/erpnext.ts` |
| `Purchase Invoice` | AP vendor bills | `dashboard/src/lib/erpnext.ts` |
| `Payment Entry` | AR/AP payment recording | `dashboard/src/lib/erpnext.ts` |
| `Lead` | CRM pipeline | `dashboard/src/lib/erpnext.ts` |
| `CRM Note` | Lead notes | `dashboard/src/lib/erpnext.ts` |
| `Opportunity` | Sales pipeline | `dashboard/src/lib/erpnext.ts` |
| `Customer` | Customer master | `dashboard/src/lib/erpnext.ts` |
| `Supplier` | Vendor master | `dashboard/src/lib/erpnext.ts` |
| `Timesheet` | Billable hours | `dashboard/src/lib/erpnext.ts` |
| `Subscription` | MRR/ARR calc | `dashboard/src/lib/erpnext.ts` |
| `Subscription Plan Detail` | Child table w/ plan amounts | `dashboard/src/lib/erpnext.ts` |
| `Asset` | HaaS fleet | `dashboard/src/lib/erpnext.ts` |
| `Project` | AI dev project tracking | `dashboard/src/app/billing/page.tsx` |

### LLDAP Groups (from dashboard auth)

- `kecktech_admins` — full access
- `kecktech_support` — support desk + ops
- `kecktech_billing` — billing + sales
- `kecktech_sales` — sales CRM
- `kecktech_staff` — support desk access
- `kecktech_customers` — portal access only

---

## 11. Configuration & Command Files

### `.claude/Claude.md` — Claude Code Project Rules

Workflow Orchestration:
1. Plan mode for any non-trivial task (3+ steps)
2. Subagents for research/exploration (keep main context clean)
3. Self-improvement loop → update `tasks/lessons.md` after corrections
4. Verification before done — "Would a staff engineer approve this?"
5. Demand elegance (non-trivial changes)
6. Autonomous bug fixing

Task Management:
1. Plan → `tasks/todo.md`
2. Verify before implementation
3. Track progress
4. Document results
5. Capture lessons in `tasks/lessons.md`

Core Principles: Simplicity First | No Laziness | Minimal Impact

### `.cursor/rules/kecktech-stack.mdc` + `docs/prompts/.cursorrules`

Tech Stack: TypeScript strict | Next.js 14+ | PostgreSQL + Prisma | NextAuth.js | Tailwind | Docker Compose | Proxmox

Code Standards: UUIDs | createdAt/updatedAt | soft deletes | error boundaries | loading states | mobile-first | API-first | env vars only

File Conventions: PascalCase components/models | camelCase utilities | kebab-case API routes

Security: input validation at boundaries | RBAC via LLDAP groups | CSRF | rate limiting | no hardcoded secrets | SQL injection prevention | XSS prevention

Project Context: `docs/prompts/PROJECT-CONTEXT.md`, `platform-services/`, `custom-apps/01-10/`

### `docker/.env.example` — Credential Template

```
ZAMMAD_API_TOKEN
MAILCOW_SMTP_USER, MAILCOW_SMTP_PASS
LLDAP_LDAP_USER_PASS
AUTHELIA_JWT_SECRET, AUTHELIA_SESSION_SECRET, AUTHELIA_STORAGE_ENCRYPTION_KEY
N8N_ENCRYPTION_KEY, N8N_BASIC_AUTH_PASSWORD
UMAMI_APP_SECRET
VAULTWARDEN_ADMIN_TOKEN
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
CUSTOM_WIKI_API_TOKEN
```

### `docker/authelia/configuration.yml` — Access Rules

- Backend: LDAP → `lldap:3890`, base DN `dc=kecktech,dc=net`, admin DN `uid=admin,ou=people,dc=kecktech,dc=net`
- Session: 12h max, 1h inactivity
- Rules (priority order):
  1. PUBLIC bypass: `kecktech.net`, `www.kecktech.net`, `help.kecktech.net`, `wiki.kecktech.net`
  2. `admin.kecktech.net` → `kecktech_admins` + `two_factor`
  3. `portal.kecktech.net` → customers `one_factor` / admins `two_factor`
  4. `*.kecktech.net` → staff/billing/support `one_factor` / admins `two_factor`
- Notifier: SMTP via `mail.kecktech.net:587`

### Dashboard Environment Variables

```bash
ERPNEXT_URL, ERPNEXT_API_KEY, ERPNEXT_API_SECRET
ZAMMAD_URL, ZAMMAD_API_TOKEN
TRMM_URL, TRMM_API_KEY
RUSTDESK_SERVER_HOST, RUSTDESK_PUBLIC_KEY
UMAMI_URL, UMAMI_USER, UMAMI_PASS, UMAMI_SITE_ID
LLDAP_URL, LLDAP_ADMIN_USER, LLDAP_ADMIN_PASS
```

### PIV / PIN / Verified Inputs

**None found.** Full repo scan returned no files named `PIV*`, no "PIV command" references. Not applicable to this codebase.

---

## 12. Removed / Deprecated — Detailed Ledger

> Important: These items are still referenced in various files but are no longer part of the active stack. Flag any reference to them in future work.

### WordPress
- **Removed**: April 2026
- **Replacement**: Astro static site at `www.kecktech.net`
- **Evidence**:
  - `docker/docker-compose.yml:5-6` — `# REMOVED 2026-04: wordpress + wp-db (replaced by Astro kecktech-web)`
  - `scripts/backup.sh:4,75-76` — "Updated: April 2026 — removed WordPress/WikiJS"
  - `docs/REMAINING-TASKS.md:55-56` — marked for compose cleanup
  - `docs/INTEGRATIONS.md:29` — `~~WordPress~~`
  - `docs/BUSINESS-CONTEXT.md:145-147` — explicit replacement note
  - `docker/wordpress/README.md` — **EXISTS**, vestigial branding plugin docs
- **Pending cleanup**:
  - `./docker/data/wp_data/` (~1.5 GB bind mount, still on disk)
  - `./docker/data/db_data/`
  - 5 deprecated scripts (`apply-wordpress-branding.{sh,ps1}`, `reinit-wordpress-db-data.ps1`, `restore-wordpress-from-backup.ps1`, `revert-homepage-changes.ps1`, `update-billing-page.js`)
  - `docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md` references are OUTDATED
  - `startup-all:20-21` still echoes WordPress

### WikiJS
- **Removed**: April 2026
- **Replacement**: BookStack (internal) + Custom Wiki (public `help.kecktech.net`)
- **Evidence**:
  - `docker/docker-compose.yml:728` — `# NOTE: wikijs_data, wikijs_db_data removed — WikiJS replaced by BookStack + Custom Wiki`
  - `scripts/backup.sh:105-106` — "REMOVED: wikijs_data"
  - `bookstack/migrate-wikijs.js` + `bookstack/migrate-wikijs-to-custom-wiki.js` — migration artifacts
  - `docs/Kecktech_Brand_Guide_2025.docx.md` — STILL references WikiJS (stale)
- **Pending cleanup**: 2 deprecated scripts (`create-wikijs-pages.{js,ps1}`)

### FreeScout
- **Removed**: April 2026
- **Replacement**: Zammad at `tickets.kecktech.net`
- **Evidence**:
  - `scripts/backup.sh` — "REMOVED: vboxuser_freescout_data (replaced by Zammad)"
  - `docker/docker-compose.yml` — project name `vboxuser` preserved to protect legacy volume
  - `docs/BUSINESS-CONTEXT.md:145` — `~~FreeScout~~ → replaced by Zammad`

### Heimdall
- **Removed**: Pre-April 2026
- **Replacement**: Traefik routing + custom Next.js dashboard home page
- **Evidence**:
  - `scripts/migrate-to-project.sh:11-18` — migration script references `heimdall` dir from home
  - `startup-all:20-21` — stale echo

### Florida Operations
- **Removed**: April 2026 (business model change)
- **Evidence**: `docs/BUSINESS-CONTEXT.md:166` — "No Florida operations (removed)"
- **Affected**: `docs/business_launch.md` marked STALE

### SVC-HOME (ERPNext service item)
- **Removed/Deprecated**: April 2026
- **Replacement**: `SVC-SENIOR-ONSITE`
- **Evidence**: `docs/ERPNEXT-SETUP-GUIDE.md:76`
- **Status**: Still in ERPNext, disabled

### Traefik v2
- **Removed/Upgraded**: April 2026
- **Replacement**: Traefik v3.6.10
- **Evidence**: `docker/docker-compose.yml`

### Deleted Documentation
- `docs/STACK-ISSUES-REMEDIATION-PLAN.md` — deleted (git status `D`)
- `docs/TROUBLESHOOTING.md` — deleted
- `docs/WORDPRESS-RESTORE-WINDOWS.md` — deleted

### Stale but Present
- `docs/business_launch.md` — marked STALE, content superseded by `docs/BUSINESS-CONTEXT.md`
- `docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md` — OUTDATED (references removed services' restore paths)
- `docs/Kecktech_Brand_Guide_2025.docx.md` — references WikiJS (needs update)
- `docker/wordpress/README.md` — vestigial
- `startup-all` — stale echo of removed services

---

## 13. Business Context

- **Legal entity**: Kecktech IT Solutions LLC (`docs/BUSINESS-CONTEXT.md`)
- **Location**: Park City, Kansas (`website/src/data/contact.json`)
- **Phone**: (316) 768-0034 | **Email**: support@kecktech.net
- **Hours**: Mon–Fri 8am–6pm CST + emergency for managed clients
- **Founder**: Jon Keck (Co-Founder & Lead Engineer) (`website/src/data/about.json`)
- **Positioning**: Family-owned, disability-led, solar-powered
- **Values**: Human-First | Sovereign & Private | Solar & Circular | Radically Accessible | White Glove (`website/src/data/about.json`)
- **Facility goal**: 25 kW solar + 100 kWh battery, 1,500 sq ft, $250K fundraising with PayPal
- **Service lines & pricing**:
  - White Glove Managed IT — $199/mo
  - Hardware-as-a-Service — $149/mo/device
  - AI Custom App Development — $3K–$8K
  - Senior Technology Concierge — $79/mo
- **30-day launch plan (Apr 13 → May 12, 2026)**: 50 prospects, 60+ touches, 5+ discovery calls, 1+ MSP client, billable hours

---

## 14. Complete Service Inventory (27 services)

Source: `docs/INTEGRATIONS.md`, `docker/docker-compose.yml`, `docker/PORTS.md`

| Service | URL | Port | Category | Status |
|---|---|---|---|---|
| Traefik dashboard | traefik.kecktech.net | 8080 | Infra | ✅ Active |
| Authelia | auth.kecktech.net | — | SSO | ✅ Active |
| LLDAP | lldap.kecktech.net | 17170 | Directory | ✅ Active |
| Portainer | portainer.kecktech.net | — | Management | ✅ Active |
| ERPNext | erp.kecktech.net | 8080 | ERP/CRM | ✅ Active |
| Zammad | zammad.kecktech.net / tickets.kecktech.net | — | Helpdesk | ✅ Active |
| Vaultwarden | vault.kecktech.net | — | Secrets | ✅ Active |
| n8n | n8n.kecktech.net | — | Automation | ✅ Active |
| Umami | umami.kecktech.net | — | Analytics | ✅ Active |
| BookStack | docs.kecktech.net | — | Internal Wiki | ✅ Active |
| Custom Wiki | help.kecktech.net | 3011 | Public KB | 🟡 Partial |
| RustDesk (relay + ID) | — | 21115-21119 | Remote | ✅ Active |
| Tactical RMM | trmm.kecktech.net | 4443 | RMM | ✅ Active |
| Dashboard | dash.kecktech.net | 3000 | Internal | ✅ Active |
| Customer Portal | portal.kecktech.net | 3012 | External | 🟡 Scaffold |
| Admin console | admin.kecktech.net | — | Content | ✅ Active |
| Public site (Astro) | kecktech.net / www.kecktech.net | — | Public | ✅ Active |
| Mailcow | mail.kecktech.net | 587/993 | Email | ✅ Active |
| NATS | — | 4222 | Messaging (TRMM) | ✅ Active |
| Tailscale | — | — | VPN | ✅ Active |
| PostgreSQL (Zammad/Umami/Custom Wiki) | internal | 5432 | DB | ✅ Active |
| MariaDB (BookStack) | internal | 3306 | DB | ✅ Active |
| Redis (Zammad) | internal | 6379 | Cache | ✅ Active |
| PHP contact mailer | internal | — | Form | ✅ Active |
| ~~WordPress~~ | ~~kecktech.net~~ | — | ~~Public~~ | ⛔ REMOVED Apr 2026 |
| ~~WikiJS~~ | ~~wiki.kecktech.net~~ | — | ~~Wiki~~ | ⛔ REMOVED Apr 2026 |
| ~~FreeScout~~ | ~~tickets.kecktech.net~~ | — | ~~Helpdesk~~ | ⛔ REMOVED Apr 2026 |
| ~~Heimdall~~ | ~~start.kecktech.net~~ | — | ~~Landing~~ | ⛔ REMOVED pre-Apr 2026 |

---

## 15. Documentation Index (complete, all 48 files)

> Order: status (current → stale → deleted), then alphabetical within status.

### Current — Master Documents
- `dashboard.md` — **NEW v2**: Master project atlas (root)
- `PROJECT_PLAN.md` — 8-phase delivery roadmap
- `docs/BUSINESS-CONTEXT.md` — **MASTER**: legal, services, launch plan
- `docs/INTEGRATIONS.md` — 27 services, integration flows
- `docs/REMAINING-TASKS.md` — Priority 1–4 action items
- `docs/PROCESS-MAP.md` — 8 business processes
- `.claude/Claude.md` — Workflow rules
- `.claude/Kecktech_Brand_Guide_2025.docx.md` — Brand standards

### Current — Runbooks
- `CUSTOMER-ONBOARDING.md`
- `docs/ERPNEXT-SETUP-GUIDE.md` — 18-step
- `docs/DAILY-TASKS.md`
- `docs/restore.md`
- `docs/ssh-hardening.md`
- `docs/RUSTDESK-ACCESS.md`
- `docs/HTTPS-TEST-ENV.md`
- `docs/TAILSCALE-TEST-ENV.md`
- `docs/WINDOWS-DOCKER-RECOVERY.md`
- `docs/CUSTOM-WIKI-CUTOVER.md`
- `docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`
- `bookstack/IMPORT-RUNBOOK.md`
- `bookstack-pipeline-guide.docx.md`

### Current — Architecture / Reference
- `docs/CUSTOM-WIKI-ARCHITECTURE.md`
- `docs/BOOKSTACK-PARITY-CONTRACT.md`
- `docs/BOOKSTACK-PARITY-VALIDATION.md`
- `docker/PORTS.md` — **NEW v2**
- `docker/README.md` — **NEW v2**
- `custom-wiki/README.md`
- `custom-wiki/THIRD_PARTY_ASSETS.md`
- `erpnext/README.md`

### Current — Spec Templates (`docs/prompts/`)
- `docs/prompts/PROJECT-CONTEXT.md`
- `docs/prompts/custom-apps/01-crm.md` through `10-dashboard-reporting.md` (10 files)
- `docs/prompts/platform-services/bookstack-migration.md`
- `docs/prompts/platform-services/peertube-video-platform.md`
- `docs/prompts/platform-services/rocketchat-service.md`

### Stale / Needs Update
- `docs/business_launch.md` — STALE (superseded)
- `docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md` — references removed services
- `docs/Kecktech_Brand_Guide_2025.docx.md` — duplicate; references WikiJS
- `docker/wordpress/README.md` — vestigial (WordPress removed)

### Deleted (git status `D`)
- `docs/STACK-ISSUES-REMEDIATION-PLAN.md`
- `docs/TROUBLESHOOTING.md`
- `docs/WORDPRESS-RESTORE-WINDOWS.md`

### Vendor / Submodule (not Kecktech-authored)
- `mailcow/README.md`
- `mailcow/CODE_OF_CONDUCT.md`
- `mailcow/CONTRIBUTING.md`
- `mailcow/SECURITY.md`

### Referenced but Missing
- `tasks/todo.md` — referenced in `.claude/Claude.md` but **does not exist**
- `tasks/lessons.md` — referenced but **does not exist**
- `docs/archive/` — referenced in `docs/INTEGRATIONS.md:29` as location for removed service docs but **directory state unverified in v2 pass**

---

## 16. v1 → v2 Diff Summary

Items added in this pass that were missing from v1 `ATLAS_HANDOFF.md`:

1. 26 additional markdown files surfaced
2. Dedicated §12 for removed/deprecated ledger with line-level evidence
3. `docker/PORTS.md`, `docker/README.md`, `docker/wordpress/README.md`
4. 10 custom app specs + 3 platform service specs (`docs/prompts/`)
5. `dashboard.md` root-level master atlas
6. Duplicate Brand Guide noted (`.claude/` + `docs/`)
7. Mailcow vendor docs noted (4 files, non-authored)
8. Two newly discovered API routes: `/api/invoices/[id]/submit`, `/api/devices/[id]`
9. 6 additional deprecated scripts (WordPress/WikiJS) listed
10. SVC-HOME ERPNext service deprecation
11. Heimdall historical removal
12. Traefik v2 → v3 upgrade noted
13. Florida operations removal
14. `bookstack/articles/` confirmed empty
15. Explicit note: no `tasks/todo.md`, no `tasks/lessons.md`, no `PIV` files exist
16. v2 confirmation that TODO/FIXME scan across code returned no results

---

*End of ATLAS_HANDOFF.md v2 — Exhaustive pass completed 2026-04-15*
