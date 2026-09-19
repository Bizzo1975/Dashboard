# ATLAS HANDOFF — Kecktech IT Solutions Dashboard Monorepo

> Generated: 2026-04-13 | Repo: `f:\Github\Dashboard` | Branch: `main`
> This document is exhaustive by design. Every claim cites a source file path.

---

## 1. One-Paragraph Purpose Summary

This repository is the complete operational infrastructure and software stack for **Kecktech IT Solutions LLC**, a family-owned, disability-led, solar-powered managed service provider (MSP) headquartered in Park City, Kansas. The stack serves four commercial service lines — White Glove Managed IT ($199/mo), Hardware-as-a-Service ($149/mo/device), AI Custom App Development ($3K–$8K), and Senior Technology Concierge ($79/mo) — alongside internal operations: a Next.js internal ops dashboard integrating ERPNext (CRM/billing), Zammad (helpdesk), and Tactical RMM (remote monitoring); a public Astro marketing website; a Next.js customer self-service portal; a custom Next.js wiki/knowledge-base to replace BookStack; a Node.js admin content editor; and a complete Docker Compose infrastructure stack with Traefik reverse proxy, Authelia SSO, LLDAP directory, Mailcow email, Vaultwarden secrets, n8n automation, Umami analytics, RustDesk remote access, and Portainer container management. The repository is in active pre-launch state as of April 2026 with a 30-day go-live ramp targeting May 12, 2026. (`docs/BUSINESS-CONTEXT.md`, `PROJECT_PLAN.md`, `docker/docker-compose.yml`)

---

## 2. Top-Level Folder Structure

| Folder | Purpose | Source |
|---|---|---|
| `.claude/` | Claude Code config, brand guide, project context | `.claude/CLAUDE.md` |
| `.cursor/` | Cursor IDE rules (`kecktech-stack.mdc`) | `.cursor/rules/` |
| `.vscode/` | VSCode workspace settings | `.vscode/` |
| `backups/` | Dated database and volume backups | `docs/restore.md` |
| `bookstack/` | BookStack migration scripts, XLSX import pipeline | `bookstack/package.json` |
| `custom-wiki/` | Custom Next.js knowledge base (BookStack fallback) | `custom-wiki/README.md` |
| `customer-portal/` | Next.js customer self-service portal | `docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md` |
| `dashboard/` | Next.js internal ops dashboard (primary app) | `dashboard/package.json` |
| `docker/` | Docker Compose stack + all service configs | `docker/docker-compose.yml` |
| `docs/` | All documentation (15+ markdown files) | `docs/` |
| `erpnext/` | ERPNext (Frappe) Docker config + README | `erpnext/README.md` |
| `img/` | Image assets | — |
| `mailcow/` | Mailcow email server config | `docker/docker-compose.yml` |
| `scripts/` | Bash automation (SSH hardening, migration, RustDesk) | `scripts/` |
| `tactical/` | Tactical RMM (remote monitoring) | `docker/docker-compose.yml` |
| `website/` | Astro public marketing site + Node.js admin console | `website/package.json` |

---

## 3. Package.json Inventory

### `dashboard/package.json`
- **Name**: `kecktech-dashboard`
- **Version**: `1.0.0`
- **Description**: Internal ops dashboard
- **Framework**: Next.js 15.5.12, React 19.1.0
- **Key dependencies**: `@tanstack/react-query@5.95.0`, `@dnd-kit/core`, `@dnd-kit/sortable`, `mysql2@3.20.0`, `tailwindcss@4.2.2`, `lucide-react`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`
- **Scripts**: `dev`, `build`, `start`

### `custom-wiki/package.json`
- **Name**: `custom-wiki`
- **Version**: `1.0.0`
- **Description**: Custom wiki (BookStack fallback)
- **Framework**: Next.js 15.2.0, React 19.0.0
- **Key dependencies**: `@prisma/client@6.6.0`, `marked@15.0.12`, `sanitize-html`, `zod`, `dotenv`, `node-fetch`
- **Scripts**: `dev` (port 3011), `build`, `start`, `prisma:generate`, `prisma:migrate`, `migrate:html`, `validate:articles`, `remediate:articles`

### `customer-portal/package.json`
- **Name**: `kecktech-customer-portal`
- **Version**: `1.0.0`
- **Description**: Client-facing account portal
- **Framework**: Next.js 14.2.29, React 18.3.1
- **Scripts**: `dev` (port 3012), `build`, `start`, `lint`

### `website/package.json`
- **Name**: (unnamed Astro project)
- **Framework**: Astro `^5.6.1`
- **Scripts**: `dev` (port 4321), `build`, `preview`

### `website/admin/package.json`
- **Name**: (Node.js Express admin)
- **Dependencies**: `express`, `multer`
- **Purpose**: WYSIWYG JSON content editor for Astro site

### `bookstack/package.json`
- **Key dependencies**: `dotenv`, `node-fetch`, `pg`, `xlsx`
- **Scripts**: `migrate`, `hierarchy`, `upload`, `pilot`, `full-import`, `xlsx-customwiki-dry`, `xlsx-customwiki-live`, `review-queue`, `category-corrections`

---

## 4. Current Status

### Working / Deployed

- **Traefik v3 reverse proxy** — all `*.kecktech.net` routes, TLS termination (`docker/docker-compose.yml`)
- **Authelia SSO** — LLDAP-backed, role-based access rules, 1FA/2FA per route (`docker/authelia/configuration.yml`)
- **LLDAP directory** — groups: `kecktech_admins`, `kecktech_support`, `kecktech_billing`, `kecktech_sales`, `kecktech_staff`, `kecktech_customers` (`dashboard/src/lib/auth.ts`)
- **Zammad helpdesk** — tickets, articles, SLA tracking, live chat (`dashboard/src/lib/zammad.ts`)
- **Tactical RMM (TRMM)** — agent monitoring, alerts, client groups (`dashboard/src/lib/trmm.ts`)
- **Vaultwarden** — secrets manager, in docker stack (`docker/docker-compose.yml`)
- **n8n 2.11.2** — workflow automation, morning briefing workflow (`docker/docker-compose.yml`, `docs/DAILY-TASKS.md`)
- **Umami analytics** — website stats dashboard widget (`dashboard/src/lib/umami.ts`)
- **RustDesk** — relay + ID server, client install script (`scripts/install-rustdesk-client.sh`, `dashboard/src/lib/rustdesk.ts`)
- **Astro public website** — 5 pages (home, about, services, pricing, contact) (`website/src/pages/`)
- **Dashboard — Home page** — service health tiles with drag-drop ordering (`dashboard/src/app/page.tsx`)
- **Dashboard — Support page** — ticket queue, alert panel, time entry, RustDesk panel (`dashboard/src/app/support/page.tsx`)
- **Dashboard — Sales/CRM page** — lead kanban, opportunity pipeline, follow-up queue, Umami widget (`dashboard/src/app/sales/page.tsx`)
- **Dashboard — Ops/SOC page** — client health table, HaaS lifecycle, stack health, onboarding wizard (`dashboard/src/app/ops/page.tsx`)
- **Dashboard — Billing page** — MRR/ARR KPIs, AR/AP tables, timesheet logging, project billing (`dashboard/src/app/billing/page.tsx`)
- **Dashboard — SLA Reports** — compliance by client and ticket, CSV export (`dashboard/src/app/reports/sla/page.tsx`)
- **Dashboard — Customer Onboarding Wizard** — automated LLDAP + Zammad + ERPNext provisioning (`dashboard/src/app/ops/onboarding/page.tsx`)
- **Node.js admin console** — JSON content editor for Astro site with photo uploads and build trigger (`website/admin/server.js`)
- **BookStack migration scripts** — hierarchy creation, article upload from XLSX catalog (`bookstack/create-hierarchy.js`, `bookstack/upload-articles.js`)
- **Custom-wiki Prisma schema** — 14 models defined, migrations ready (`custom-wiki/prisma/schema.prisma`)
- **Custom-wiki import pipeline** — XLSX → Custom Wiki importer with structured markdown generation (`bookstack/import-xlsx-to-custom-wiki.js`)

### Stubbed / Partially Complete

- **Custom-wiki application** — schema and import scripts exist; the Next.js app itself is scaffolded but cutover not done (`docs/CUSTOM-WIKI-CUTOVER.md`: "prerequisites not yet complete")
- **ERPNext configuration** — 18-step guide written; partially completed — Stripe, email templates, invoice letterhead, and subscription workflow not finished (`docs/ERPNEXT-SETUP-GUIDE.md`, `docs/REMAINING-TASKS.md` Priority 2)
- **Customer portal** — scaffold exists at `customer-portal/`; gap analysis written; the following features are NOT built: RustDesk API route, contracts card, invoice history, TRMM device panel, Stripe payments, BookStack-gated content (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- **Contact form → Zammad webhook** — n8n webhook documented but test not confirmed (`docs/INTEGRATIONS.md`, `docs/REMAINING-TASKS.md` Priority 3)
- **Stripe payment integration** — listed in `.env.example` (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) and ERPNext setup guide but not yet wired up (`docs/REMAINING-TASKS.md` Priority 3)
- **MSA (Master Service Agreement)** — listed as go-live blocker (`docs/REMAINING-TASKS.md` Priority 3)
- **Mailcow full configuration** — SMTP relay working; full mail server setup and DNS MX records for production TBD (`docs/REMAINING-TASKS.md`)
- **HTTPS local test environment** — mkcert setup documented but not confirmed complete (`docs/HTTPS-TEST-ENV.md`)

### Deprecated / Removed

- **WordPress** — removed April 2026; replaced by Astro static site. Branding script preserved for reference at `scripts/apply-wordpress-branding.sh` (noted deprecated in header)
- **FreeScout** — replaced by Zammad; `vboxuser_freescout_data` volume preserved in docker project name (`docker/docker-compose.yml`)
- **BookStack as primary wiki** — being superseded by custom-wiki; parity contract written and failed exact match (`docs/BOOKSTACK-PARITY-VALIDATION.md`)
- **WikiJS** — previously in use; migration scripts written to move to BookStack and Custom Wiki (`bookstack/migrate-wikijs.js`, `bookstack/migrate-wikijs-to-custom-wiki.js`)
- **`docs/business_launch.md`** — marked STALE, superseded by `docs/BUSINESS-CONTEXT.md`
- **`docs/STACK-ISSUES-REMEDIATION-PLAN.md`** — deleted (git status shows `D`)
- **`docs/TROUBLESHOOTING.md`** — deleted
- **`docs/WORDPRESS-RESTORE-WINDOWS.md`** — deleted

---

## 5. Every Feature Mentioned (Flat List with Source)

### Dashboard — Internal Ops App (`dashboard/`)

- Service health status dashboard with per-service latency and up/down indicators (`dashboard/src/app/page.tsx`)
- Drag-and-drop reordering of service tiles with localStorage persistence (`dashboard/src/app/page.tsx`, `dashboard/src/components/TileGrid.tsx`)
- Auto-refresh last-checked timestamp in Chicago timezone (`dashboard/src/app/page.tsx`)
- Role-based sidebar navigation (support/sales/billing/admin) (`dashboard/src/components/Sidebar.tsx`)
- Header summary: "X/Y services up" (`dashboard/src/app/page.tsx`)
- TRMM alert panel with severity badges (critical/high/warning/info) and one-click "create ticket" from alert (`dashboard/src/app/support/page.tsx`)
- Zammad ticket queue with expandable thread view (`dashboard/src/app/support/page.tsx`)
- Inline ticket reply (external and internal notes) without leaving dashboard (`dashboard/src/app/support/page.tsx`)
- Ticket state change dropdown (new → open → pending → closed) inline (`dashboard/src/app/support/page.tsx`)
- SLA countdown timer per ticket (high: 4h, normal: 24h, low: 72h) (`dashboard/src/lib/zammad.ts`, `dashboard/src/components/TicketPanel.tsx`)
- RustDesk remote session request: posts instructions as a ticket article (`dashboard/src/app/support/page.tsx`)
- RustDesk server config display with copy buttons (`dashboard/src/components/RustDeskPanel.tsx`)
- Zammad live chat active sessions list (`dashboard/src/app/support/page.tsx`)
- Billable time entry form with customer dropdown, log directly to ERPNext (`dashboard/src/app/support/page.tsx`)
- Quick links to external tools (ERPNext, Zammad, Vault, docs) (`dashboard/src/app/support/page.tsx`)
- Sales KPI cards: leads in pipeline, new leads this week, conversion rate, open opportunities, weighted forecast, avg deal size, website visitors (`dashboard/src/app/sales/page.tsx`)
- Lead kanban board with columns: New → Open → Replied → Opportunity → Quotation → Interested (`dashboard/src/app/sales/page.tsx`, `dashboard/src/components/SalesBoard.tsx`)
- Drag-and-drop lead stage transitions (updates ERPNext immediately) (`dashboard/src/components/SalesBoard.tsx`)
- Lead detail drawer with notes, contact info, convert-to-opportunity action, create-quote link, add CRM notes (`dashboard/src/components/SalesBoard.tsx`)
- Opportunity pipeline with stages, amount × probability, weighted forecast total (`dashboard/src/app/sales/page.tsx`)
- Follow-up queue for stale leads (3+ days no contact) with source badges (`dashboard/src/app/sales/page.tsx`)
- Add lead form: name, company, email, phone, source, notes (`dashboard/src/components/NewLeadForm.tsx`)
- Ops alert summary bar (critical/high/warning/info counts) (`dashboard/src/app/ops/page.tsx`)
- Customer health overview table: offline devices, alert count, overdue invoices, health score (green/amber/red) (`dashboard/src/app/ops/page.tsx`)
- Health scoring logic: red if critical alerts OR >50% offline OR (overdue + any alerts); amber if any offline/alerts/overdue (`dashboard/src/app/ops/page.tsx`)
- Expandable client device cards with per-agent status and pending actions (`dashboard/src/components/ClientGroupCard.tsx`, `dashboard/src/app/ops/page.tsx`)
- HaaS device lifecycle table: asset name, customer, purchase date, age in months, lifecycle flag (>48mo=replace, >36mo=aging, ≤36mo=good) (`dashboard/src/app/ops/page.tsx`)
- Stack health grid on ops page (same data as home, ops context) (`dashboard/src/app/ops/page.tsx`)
- "Onboard New Customer" button linking to wizard (`dashboard/src/app/ops/page.tsx`)
- Customer onboarding wizard — 5-step: customer info form, LLDAP user creation, Zammad account creation, ERPNext verification, credentials summary (`dashboard/src/app/ops/onboarding/page.tsx`)
- Auto-generate secure 18-character password with show/hide/copy/regenerate (`dashboard/src/app/ops/onboarding/page.tsx`)
- Auto-derive username from full name (sanitized, editable) (`dashboard/src/app/ops/onboarding/page.tsx`)
- LLDAP GraphQL user create + group assignment (`dashboard/src/app/api/ops/onboard/lldap/route.ts`)
- Zammad org lookup + customer-role user create (`dashboard/src/app/api/ops/onboard/zammad/route.ts`)
- ERPNext customer record lookup/verification (`dashboard/src/app/api/ops/onboard/erpnext/route.ts`)
- Onboarding credentials summary with Vaultwarden/portal/Zammad/ERPNext deep links (`dashboard/src/app/ops/onboarding/page.tsx`)
- Billing KPI cards: MRR, ARR, outstanding AR, unbilled hours, net AR-AP, 30-day collections (`dashboard/src/app/billing/page.tsx`)
- AR aging buckets (current, 1-30d, 31-60d, 61+d overdue) (`dashboard/src/app/billing/page.tsx`)
- Overdue invoice follow-up queue with email reminder mailto links (`dashboard/src/app/billing/page.tsx`)
- AR invoice table: customer, number, grand total, outstanding, due date, status, record payment (`dashboard/src/app/billing/page.tsx`)
- "Bill Unbilled Hours" — batch creates invoice from draft timesheets (`dashboard/src/components/InvoiceActions.tsx`)
- New Invoice modal with line items and service codes (`dashboard/src/components/InvoiceActions.tsx`)
- Timesheet table: date, tech, customer, hours, notes, billed status (`dashboard/src/app/billing/page.tsx`)
- AP purchase invoice table: vendor, number, amount, outstanding, status (`dashboard/src/app/billing/page.tsx`)
- Mark AP paid button (`dashboard/src/components/InvoiceActions.tsx`)
- New Bill modal for quick vendor expenses (`dashboard/src/components/InvoiceActions.tsx`)
- AI dev projects table with progress bar, target date, milestone invoice link (`dashboard/src/app/billing/page.tsx`)
- MRR/ARR calculated from ERPNext subscription plan child tables (`dashboard/src/lib/erpnext.ts`)
- SLA compliance report: date range picker, summary KPIs, per-client table, per-ticket table (`dashboard/src/app/reports/sla/page.tsx`)
- SLA CSV export (`dashboard/src/components/SlaExportButton.tsx`)
- Alert acknowledge action (TRMM API call) (`dashboard/src/components/AcknowledgeButton.tsx`)
- Create Zammad ticket from TRMM alert (`dashboard/src/app/api/alerts/[id]/ticket/route.ts`)
- Alert acknowledge API route (`dashboard/src/app/api/trmm-alert/[id]/route.ts`)
- All API routes: `/api/tickets`, `/api/leads`, `/api/opportunities`, `/api/invoices`, `/api/purchase-invoices`, `/api/timesheet`, `/api/rustdesk/info`, `/api/health` (`dashboard/src/app/api/`)
- Leads API with CREATE support (`dashboard/src/app/api/leads/route.ts`, `dashboard/src/app/api/leads/[id]/route.ts`)
- ERPNext MRR subscription calculation from plan child table (`dashboard/src/lib/erpnext.ts`)
- Umami JWT auth + 7-day rolling metrics fetch (`dashboard/src/lib/umami.ts`)
- Services registry: 15+ services with health endpoint, icon, color, logo path (`dashboard/src/lib/services.ts`)
- TRMM https client with Host header override for self-signed cert (`dashboard/src/lib/trmm.ts`)

### Public Website (`website/`)

- 5-page Astro static site: home, about, services, pricing, contact (`website/src/pages/`)
- "Kansas IT That Actually Cares" hero with CTA buttons (`website/src/data/home.json`)
- 4 service cards with pricing on home page (`website/src/data/home.json`)
- 4 value propositions (solar, disability-led, Kansas data sovereignty, human accountability) (`website/src/data/home.json`)
- About page with mission, 5 values, team section, facility fundraising goal (`website/src/data/about.json`)
- Solar facility goal: 25kW array, 100kWh battery, 1,500 sq ft, $250K fundraising, PayPal donate (`website/src/data/about.json`)
- Services detail page with feature checklists per service (`website/src/data/services.json`)
- Pricing page with 4 cards, 6 FAQ items, CTA (`website/src/data/pricing.json`)
- Contact page with form (4 request types), contact info, 2-hour response target (`website/src/data/contact.json`)
- Phone number: (316) 768-0034, email: support@kecktech.net, Park City KS (`website/src/data/contact.json`)
- Hours: Mon–Fri 8am–6pm CST + emergency support for managed clients (`website/src/data/contact.json`)
- Node.js admin content editor (Express + Multer): edit JSON data files, photo upload, build trigger, live build log (`website/admin/server.js`)
- Admin editor routes: `/page/:name`, `/save/:name`, `/preview/:name`, `/upload/photo`, `/build`, `/build/status` (`website/admin/server.js`)

### Infrastructure (`docker/`)

- Traefik v3.6.10 reverse proxy with TLS (`docker/docker-compose.yml`)
- Authelia SSO with LLDAP backend, role-based access rules (`docker/authelia/configuration.yml`)
- LLDAP directory server on port 17170 (web), 3890 (LDAP) (`docker/docker-compose.yml`)
- Mailcow email server (external, SMTP relay via mail.kecktech.net:587) (`docker/authelia/configuration.yml`)
- Zammad helpdesk with PostgreSQL + Redis (`docker/docker-compose.yml`)
- Vaultwarden secrets manager (`docker/docker-compose.yml`)
- n8n 2.11.2 workflow automation (`docker/docker-compose.yml`)
- Umami analytics with PostgreSQL (`docker/docker-compose.yml`)
- RustDesk relay + ID server (`docker/docker-compose.yml`)
- Portainer container management (`docker/docker-compose.yml`)
- PHP Apache contact form mailer (`docker/docker-compose.yml`)
- BookStack with MariaDB (`docker/docker-compose.yml`)
- Custom-wiki with PostgreSQL (`docker/docker-compose.yml`)
- ERPNext / Frappe Docker (separate docker-compose stack in `erpnext/`) (`erpnext/README.md`)
- Tailscale-only SSH access (port 22 locked to Tailscale IP) (`scripts/ssh-harden.sh`, `docs/ssh-hardening.md`)
- UFW firewall rules: 80, 443, SMTP/IMAP/POP3, RustDesk 21115-21119, NATS 4222, Tailscale SSH (`scripts/ssh-harden.sh`)
- Authelia access rules: public bypass for kecktech.net, help.kecktech.net; admin.kecktech.net = 2FA admins only; portal.kecktech.net = customers 1FA / admins 2FA; *.kecktech.net = staff 1FA / admins 2FA (`docker/authelia/configuration.yml`)
- Authelia session: 12h expiry, 1h inactivity (`docker/authelia/configuration.yml`)
- Docker project name `vboxuser` (preserves legacy FreeScout volume) (`docker/docker-compose.yml`)
- Docker networks: `kecktech_front`, `kecktech_internal` (both external, pre-created) (`docker/docker-compose.yml`)
- Environment variable template with all service credentials (`docker/.env.example`)

### BookStack / Knowledge Base (`bookstack/`)

- WikiJS → BookStack migration script via REST API (`bookstack/migrate-wikijs.js`)
- XLSX catalog → BookStack hierarchy creation (shelf/book/chapter) (`bookstack/create-hierarchy.js`)
- XLSX catalog → BookStack article upload with markdown files and tags (`bookstack/upload-articles.js`)
- Pilot mode (25 articles) vs full rollout (`bookstack/run-import.js`, `bookstack/IMPORT-RUNBOOK.md`)
- WikiJS → Custom Wiki migration (`bookstack/migrate-wikijs-to-custom-wiki.js`)
- XLSX → Custom Wiki bulk import with structured markdown (Quick Summary, When To Use, Readiness Check, Step-by-Step, Advanced Checks, Safety Notes, Escalation Criteria) (`bookstack/import-xlsx-to-custom-wiki.js`)
- Category-specific remediation (Windows PC, Laptops, Smartphones, Business Tech) with validation checks (`bookstack/apply-category-corrections.js`)
- Review queue markdown generation from Custom Wiki DB (`bookstack/generate-review-queue.js`)
- System import user seeding for automation (`bookstack/seed-custom-wiki-token.js`)
- Dry-run mode for all import operations (`bookstack/create-hierarchy.js`, `bookstack/import-xlsx-to-custom-wiki.js`)
- BookStack → kecktech.net visual parity contract (header, nav, CTA, mobile) — failed, led to custom-wiki build (`docs/BOOKSTACK-PARITY-CONTRACT.md`, `docs/BOOKSTACK-PARITY-VALIDATION.md`)

### Custom Wiki (`custom-wiki/`)

- Next.js 15 wiki application with PostgreSQL + Prisma (`custom-wiki/package.json`)
- 14-model Prisma schema: User, Role, Permission, RoleBinding, Shelf, Book, Chapter, Page, PageRevision, Comment, ContentTag, Attachment, ApiToken, AuditLog (`custom-wiki/prisma/schema.prisma`)
- Soft deletes on most models (`custom-wiki/prisma/schema.prisma`)
- RBAC with optional scope (per-content-item permissions) (`custom-wiki/prisma/schema.prisma`)
- Threaded comments on pages (`custom-wiki/prisma/schema.prisma`)
- Page revision history with versioning (`custom-wiki/prisma/schema.prisma`)
- Markdown + HTML dual storage per page (`custom-wiki/prisma/schema.prisma`)
- Review workflow: DRAFT → IN_REVIEW → APPROVED → NEEDS_FIX (`custom-wiki/prisma/schema.prisma`)
- Visibility levels: PUBLIC, AUTHENTICATED, PRIVATE (`custom-wiki/prisma/schema.prisma`)
- Fact checklist JSON field on pages (`custom-wiki/prisma/schema.prisma`)
- API tokens with hash storage (`custom-wiki/prisma/schema.prisma`)
- Audit log (CREATE, UPDATE, DELETE, RESTORE, LOGIN, IMPORT, PERMISSION_CHANGE) (`custom-wiki/prisma/schema.prisma`)
- HTML migration script, article validation, article remediation (`custom-wiki/package.json` scripts)

### Customer Portal (`customer-portal/`)

- Next.js 14 scaffold at port 3012 (`customer-portal/package.json`)
- Gated by Authelia (customers 1FA, admins 2FA) (`docker/authelia/configuration.yml`)
- Planned features (NOT built): RustDesk remote support API route, contracts card, invoice history, TRMM device panel, Stripe payment integration, BookStack/wiki content gating (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- Ready-to-deploy code provided in gap analysis doc (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)

### Business Processes (`docs/PROCESS-MAP.md`)

- Customer acquisition: lead → discovery call → proposal → MSA → payment → onboarding (documented)
- MSP onboarding: LLDAP → Vaultwarden → Zammad → ERPNext → TRMM → RustDesk → portal
- Daily support ops: n8n morning briefing → dashboard review → ticket queue → alerts → time logging
- Monthly billing cycle: timesheet review → invoice draft → payment → AP reconciliation
- HaaS lifecycle: device selection → lease → monitoring → refresh (48-month cycle) → recycling
- AI app development: discovery → proposal → build → review → deploy → support
- Senior concierge: onboarding call → monthly check-ins → scam alerts → device cleanup
- Accounts payable: vendor bills → approval → payment via ERPNext

### Operational Runbooks / Docs

- Customer onboarding runbook (LLDAP, Vaultwarden, Zammad, ERPNext, portal test) (`CUSTOMER-ONBOARDING.md`)
- ERPNext 18-step configuration guide (`docs/ERPNEXT-SETUP-GUIDE.md`)
- Daily/weekly/monthly/quarterly checklist for solo operator (`docs/DAILY-TASKS.md`)
- Backup/restore procedures for all services (MariaDB, PostgreSQL, volumes, Authelia) (`docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md`, `docs/restore.md`)
- SSH hardening to Tailscale-only (`docs/ssh-hardening.md`, `scripts/ssh-harden.sh`)
- RustDesk server setup and client config (`docs/RUSTDESK-ACCESS.md`)
- HTTPS local test environment with mkcert (`docs/HTTPS-TEST-ENV.md`)
- Private test environment via Tailscale (`docs/TAILSCALE-TEST-ENV.md`)
- Windows Docker recovery (db_data corruption, Mailcow Dovecot) (`docs/WINDOWS-DOCKER-RECOVERY.md`)
- Custom wiki architecture overview (`docs/CUSTOM-WIKI-ARCHITECTURE.md`)
- Custom wiki cutover runbook (`docs/CUSTOM-WIKI-CUTOVER.md`)
- BookStack import runbook (`bookstack/IMPORT-RUNBOOK.md`)
- BookStack pipeline guide 6-phase (`bookstack-pipeline-guide.docx.md`)

### Scripts (`scripts/`)

- `ssh-harden.sh` — UFW + sshd lockdown to Tailscale, with rollback on validation failure
- `ssh-harden.sh` — Safety check: verifies Tailscale is online before locking SSH
- `disable-ssh-password.sh` — disables SSH password auth
- `enable-ssh-password-temp.sh` — temporarily enables for key upload
- `install-rustdesk-client.sh` — installs RustDesk on Ubuntu/Debian (amd64/arm64/armhf)
- `start-rustdesk-server.sh` — starts relay + ID server, prints public key
- `migrate-to-project.sh` — moves home directory container data into `docker/data`
- `run-migration-and-cleanup.sh` — full stack migration (stop old → move data → clean orphans → start new)
- `verify-and-logs.sh` — shows status/logs for main stack + ERPNext stack
- `backup.sh` — (modified, in git status) backup automation

---

## 6. Architectural Decisions & Tech Choices

| Decision | Choice | Rationale / Source |
|---|---|---|
| Dashboard framework | Next.js 15.5 + React 19, App Router, server components | `dashboard/package.json`; Next 15 server components used for data fetching |
| Dashboard auth | Header-based passthrough (Remote-User/Remote-Groups from Authelia) | `dashboard/src/lib/auth.ts`; no JWT in dashboard itself |
| Dashboard data access | Direct HTTP to service APIs (no database ORM in dashboard) | `dashboard/src/lib/erpnext.ts`, `zammad.ts`, `trmm.ts` |
| TRMM TLS workaround | Node.js `https` module with Host header override (not undici/fetch) | `dashboard/src/lib/trmm.ts`; undici can't override Host header for self-signed certs |
| Custom wiki ORM | Prisma 6.6 + PostgreSQL | `custom-wiki/package.json`; type-safe schema with migrations |
| Customer portal framework | Next.js 14 (older than dashboard) | `customer-portal/package.json` |
| Public website | Astro 5 (static output) | `website/package.json`; no server needed, purely static |
| Reverse proxy | Traefik v3 with Docker labels | `docker/docker-compose.yml`; auto-discovers containers |
| SSO/Auth | Authelia + LLDAP | `docker/authelia/configuration.yml`; self-hosted, no vendor lock-in |
| Directory | LLDAP (lightweight LDAP) | `docker/docker-compose.yml`; simpler than OpenLDAP |
| ERP/CRM/Billing | ERPNext (Frappe Docker) | `docs/ERPNEXT-SETUP-GUIDE.md`; covers leads, invoices, subscriptions, assets |
| Helpdesk | Zammad | `docker/docker-compose.yml`; replaces FreeScout, has live chat and SLA |
| RMM | Tactical RMM | `dashboard/src/lib/trmm.ts`; self-hosted alternative to ConnectWise |
| Remote access | RustDesk | `docs/RUSTDESK-ACCESS.md`; self-hosted TeamViewer alternative |
| Secrets | Vaultwarden (Bitwarden compat) | `docker/docker-compose.yml`; self-hosted |
| Automation | n8n 2.11.2 | `docker/docker-compose.yml`; open-source Zapier alternative |
| Analytics | Umami | `dashboard/src/lib/umami.ts`; GDPR-friendly, self-hosted |
| Email | Mailcow (external) + PHP mailer | `docker/docker-compose.yml`, `docker/authelia/configuration.yml` |
| Container management | Portainer | `docker/docker-compose.yml` |
| Infrastructure | Docker Compose on Proxmox VMs | `docs/BUSINESS-CONTEXT.md`; single-node initially |
| DNS/tunnel | Tailscale for SSH access | `docs/TAILSCALE-TEST-ENV.md`, `scripts/ssh-harden.sh` |
| Drag & drop | @dnd-kit (not react-beautiful-dnd) | `dashboard/package.json` |
| State management | TanStack React Query 5 + React hooks | `dashboard/package.json`; no Redux |
| Styling | Tailwind CSS v4 + shadcn/ui (base-nova) | `dashboard/package.json`; dark theme slate-900 palette |
| TypeScript | Strict mode, path alias `@/*` → `./src/*` | `dashboard/tsconfig.json` |
| Next.js output | Standalone (for Docker) | `dashboard/next.config.ts` |
| Cache strategy | `no-store` on all external API calls | `dashboard/src/lib/erpnext.ts` et al.; always fresh data |
| Timeouts | 5s for Zammad/health, 8s for onboarding ops | `dashboard/src/lib/zammad.ts`, `dashboard/src/app/ops/onboarding/page.tsx` |
| Content editing | JSON data files edited via Node.js admin panel | `website/admin/server.js`; non-technical-friendly |
| Knowledge base | Custom Next.js wiki (BookStack replacement) | `docs/BOOKSTACK-PARITY-VALIDATION.md`; BookStack failed visual parity |
| Git LF/CRLF | .gitattributes: shell=LF, bat=CRLF, rest=auto | `.gitattributes` |
| Security model | Input validation at boundaries, RBAC via LLDAP groups | `.cursor/rules/kecktech-stack.mdc` |
| Code conventions | UUIDs for IDs, createdAt/updatedAt, soft deletes, API-first | `.cursor/rules/kecktech-stack.mdc` |
| File naming | PascalCase components, camelCase utils, kebab-case routes | `.cursor/rules/kecktech-stack.mdc` |

---

## 7. TODOs and Known Gaps

> Source: `docs/REMAINING-TASKS.md` unless noted otherwise.

### Priority 1 — Infrastructure Migration (Blocking)
- [ ] Migrate entire stack from current server to new Proxmox server
- [ ] Set up new Proxmox VM with Ubuntu 24.04
- [ ] Transfer all Docker volumes and data
- [ ] Verify all services on new server
- [ ] Update DNS to point to new IP

### Priority 2 — ERPNext Full Configuration
- [ ] Complete all 18 steps in `docs/ERPNEXT-SETUP-GUIDE.md`
- [ ] Configure Stripe payment integration in ERPNext
- [ ] Set up invoice letterhead and email templates
- [ ] Configure subscription automatic renewal workflow
- [ ] Import leads from prospecting data
- [ ] Set up AP workflow and payment terms

### Priority 3 — Go-Live Blockers
- [ ] Test contact form → Zammad ticket via n8n webhook
- [ ] Stripe payment link working for new clients
- [ ] MSA (Master Service Agreement) drafted and signed for first client
- [ ] Confirm Mailcow production DNS (MX, SPF, DKIM, DMARC)
- [ ] Test portal access for a real customer account end-to-end

### Priority 4 — Customer Portal Features
- [ ] RustDesk API route in portal (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- [ ] Contracts card (view/sign MSA) (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- [ ] Invoice history with download PDF (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- [ ] TRMM device panel (customer's devices + status) (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- [ ] Stripe payment integration in portal (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)
- [ ] BookStack/wiki content gating for customers (`docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md`)

### Custom Wiki
- [ ] Complete Next.js app routes and pages (only schema+import done)
- [ ] Execute cutover runbook: validate DNS, swap help.kecktech.net (`docs/CUSTOM-WIKI-CUTOVER.md`)
- [ ] Complete article review queue (ARTICLE_REVIEW_QUEUE.md generated by `bookstack/generate-review-queue.js`)
- [ ] Apply category corrections for Windows/Mobile/Business articles (`bookstack/apply-category-corrections.js`)

### Dashboard
- [ ] Umami site ID is hardcoded — should move to env var (`dashboard/src/lib/umami.ts`)
- [ ] TRMM uses self-signed cert workaround — consider proper cert or env toggle (`dashboard/src/lib/trmm.ts`)
- [ ] `dashboard/src/app/api/leads/route.ts` and `leads/[id]/route.ts` modified (git status) — verify completeness

### Business / Sales (30-day launch plan ending May 12, 2026)
- [ ] 50 prospects identified and researched (`docs/BUSINESS-CONTEXT.md`)
- [ ] 60+ outreach touches sent (`docs/BUSINESS-CONTEXT.md`)
- [ ] 5+ discovery calls conducted (`docs/BUSINESS-CONTEXT.md`)
- [ ] 1+ MSP client signed (`docs/BUSINESS-CONTEXT.md`)
- [ ] Billable consulting hours logged (`docs/BUSINESS-CONTEXT.md`)

### Operations
- [ ] n8n morning briefing workflow verified end-to-end (`docs/DAILY-TASKS.md`)
- [ ] Backup automation confirmed working on new server (`scripts/backup.sh`)
- [ ] Authelia 2FA fully tested for admin routes (`docker/authelia/configuration.yml`)

---

## 8. Integration Points

### APIs Consumed by Dashboard

| System | Base URL | Auth Method | Key Functions | Source |
|---|---|---|---|---|
| **ERPNext** | `http://frappe_docker-frontend-1:8080` (env: `ERPNEXT_URL`) | Token header (`token api_key:api_secret`) | getOpenInvoices, getPurchaseInvoices, getLeads, createLead, addLeadNote, getOpportunities, createOpportunity, getTimesheets, createTimesheet, createInvoice, createPaymentEntry, createPurchaseInvoice, getSubscriptions, getHaasAssets, getCustomers | `dashboard/src/lib/erpnext.ts` |
| **Zammad** | `http://zammad-railsserver:3000` (env: `ZAMMAD_URL`) | `Authorization: Token token=XXX` | getOpenTickets, getTicketDetail, createTicket, replyToTicket, updateTicket, getClosedTickets, getUsers, getOrganizations | `dashboard/src/lib/zammad.ts` |
| **Tactical RMM** | `https://trmm-nginx:4443` (env: `TRMM_URL`) | `X-API-KEY` header | getActiveAlerts, acknowledgeAlert, getAgents, getAgentDetail, getClientGroups | `dashboard/src/lib/trmm.ts` |
| **LLDAP** | `http://lldap:17170` (env: `LLDAP_URL`) | GraphQL with admin credentials + JWT | createUser, addUserToGroup (onboarding only) | `dashboard/src/app/api/ops/onboard/lldap/route.ts` |
| **Umami** | `http://umami:3000` (env: `UMAMI_URL`) | Username/password → JWT | getWebsiteStats (pageviews, visitors, bounces, total time — 7-day window) | `dashboard/src/lib/umami.ts` |
| **RustDesk** | N/A — env vars only | N/A | Config string generation, server info display | `dashboard/src/lib/rustdesk.ts` |

### APIs Exposed by Dashboard

All routes are internal (no public exposure). Authenticated via Authelia header passthrough.

| Route | Method | Description | Source |
|---|---|---|---|
| `/api/health` | GET | Health check for all services (or `?service=X`) | `dashboard/src/app/api/health/` |
| `/api/tickets` | GET, POST | List open tickets / create ticket | `dashboard/src/app/api/tickets/` |
| `/api/tickets/[id]` | GET | Ticket + articles | `dashboard/src/app/api/tickets/[id]/` |
| `/api/tickets/[id]` | PATCH | Update state/priority | `dashboard/src/app/api/tickets/[id]/` |
| `/api/tickets/[id]/reply` | POST | Add article (external/internal) | `dashboard/src/app/api/tickets/[id]/reply/` |
| `/api/alerts/[id]/ticket` | POST | Create Zammad ticket from TRMM alert | `dashboard/src/app/api/alerts/[id]/ticket/` |
| `/api/trmm-alert/[id]` | PATCH | Acknowledge TRMM alert | `dashboard/src/app/api/trmm-alert/[id]/` |
| `/api/leads` | GET, POST | List / create leads in ERPNext | `dashboard/src/app/api/leads/route.ts` |
| `/api/leads/[id]` | Various | Lead detail operations | `dashboard/src/app/api/leads/[id]/route.ts` |
| `/api/leads/[id]/notes` | POST | Add CRM note to lead | `dashboard/src/app/api/leads/[id]/` |
| `/api/opportunities` | GET, POST | List / create opportunities | `dashboard/src/app/api/opportunities/` |
| `/api/invoices` | GET, POST | Sales invoices | `dashboard/src/app/api/invoices/` |
| `/api/invoices/[id]/payment` | POST | Record payment | `dashboard/src/app/api/invoices/[id]/payment/` |
| `/api/purchase-invoices` | GET, POST | Vendor bills | `dashboard/src/app/api/purchase-invoices/` |
| `/api/purchase-invoices/[id]/payment` | POST | Mark bill paid | `dashboard/src/app/api/purchase-invoices/[id]/payment/` |
| `/api/timesheet` | POST | Log billable hours | `dashboard/src/app/api/timesheet/` |
| `/api/rustdesk/info` | GET | RustDesk server config | `dashboard/src/app/api/rustdesk/info/` |
| `/api/ops/onboard/lldap` | POST | Create LLDAP user | `dashboard/src/app/api/ops/onboard/lldap/` |
| `/api/ops/onboard/zammad` | POST | Create Zammad customer | `dashboard/src/app/api/ops/onboard/zammad/` |
| `/api/ops/onboard/erpnext` | GET | Verify ERPNext customer | `dashboard/src/app/api/ops/onboard/erpnext/` |

### n8n Automation Flows (Documented, Not Verified)

| Flow | Trigger | Action | Source |
|---|---|---|---|
| Contact form → Zammad | Webhook from PHP mailer | Create Zammad ticket + auto-reply | `docs/INTEGRATIONS.md` |
| TRMM alert → Zammad ticket | Webhook from TRMM | Create ticket with alert details | `docs/INTEGRATIONS.md` |
| RMM SMS alerts | TRMM critical alert | Twilio SMS to on-call | `docs/INTEGRATIONS.md` |
| Morning briefing | Cron (daily) | Aggregate metrics → notification | `docs/DAILY-TASKS.md` |

### External Services Referenced

| Service | Purpose | Credentials Location | Source |
|---|---|---|---|
| Stripe | Payment processing | `docker/.env.example` (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) | `docs/REMAINING-TASKS.md`, `docker/.env.example` |
| Twilio | SMS alerts | `docker/.env.example` (`TWILIO_*`) | `docs/INTEGRATIONS.md`, `docker/.env.example` |
| PayPal | Solar facility donations | Hardcoded link in about page | `website/src/data/about.json` |
| Tailscale | Private network / SSH access | Installed on server | `docs/TAILSCALE-TEST-ENV.md` |

### Service-to-Service Communication

All services communicate on Docker internal networks (`kecktech_front`, `kecktech_internal`). Services reference each other by container name (e.g., `zammad-railsserver`, `frappe_docker-frontend-1`, `lldap`, `umami`). (`docker/docker-compose.yml`)

---

## 9. Data Model Summary

### Custom Wiki Prisma Schema (`custom-wiki/prisma/schema.prisma`)

**Provider**: PostgreSQL

**Enums**:
- `ContentType`: `SHELF | BOOK | CHAPTER | PAGE`
- `Visibility`: `PUBLIC | AUTHENTICATED | PRIVATE`
- `AuditAction`: `CREATE | UPDATE | DELETE | RESTORE | LOGIN | IMPORT | PERMISSION_CHANGE`
- `ReviewStatus`: `DRAFT | IN_REVIEW | APPROVED | NEEDS_FIX`

**Models (14)**:

| Model | Key Fields | Relations | Notes |
|---|---|---|---|
| `User` | id, email (unique), name, externalId, deletedAt | roles (RoleBinding), comments, revisions, apiTokens, auditLogs | Soft delete |
| `Role` | id, name (unique), description, deletedAt | bindings (RoleBinding), permissions | Soft delete |
| `Permission` | id, roleId, resource, action, conditions (JSON), deletedAt | role | Soft delete |
| `RoleBinding` | id, userId, roleId, scopeType (ContentType?), scopeId, deletedAt | user, role | Optional scope for per-resource RBAC |
| `Shelf` | id, title, slug (unique), description, visibility, sortOrder | books, tags, attachments | Top-level hierarchy |
| `Book` | id, shelfId, title, slug (unique per shelf), visibility, sortOrder | shelf, chapters, pages, tags, attachments | |
| `Chapter` | id, bookId, title, slug (unique per book), visibility, sortOrder | book, pages, tags, attachments | |
| `Page` | id, bookId, chapterId?, title, slug, markdown, html, summary, kbId, category, subcategory, reviewStatus, reviewNotes, reviewerId, sourceReferences, factChecklist (JSON), visibility, publishedAt, deletedAt | book, chapter, revisions, comments, tags, attachments | Soft delete, dual Markdown+HTML |
| `PageRevision` | id, pageId, version, title, markdown, html, authorId | page, author | Unique per pageId+version |
| `Comment` | id, pageId, authorId, body, parentId?, deletedAt | page, author, parent, replies | Threaded |
| `ContentTag` | id, name, value, deletedAt | shelves, books, chapters, pages | Polymorphic tagging |
| `Attachment` | id, fileName, mimeType, fileSize, storagePath, deletedAt | shelf?, book?, chapter?, page? | Polymorphic |
| `ApiToken` | id, userId, name, tokenHash (unique), expiresAt, lastUsedAt, deletedAt | user | Hashed tokens |
| `AuditLog` | id, actorId?, action, resourceType, resourceId, payload (JSON), createdAt | actor? | Immutable audit trail |

### ERPNext Doctypes Referenced by Dashboard

(Not a Prisma schema — these are ERPNext/Frappe doctypes accessed via REST API)

| Doctype | Used For | Dashboard Reference |
|---|---|---|
| `Sales Invoice` | AR invoices, aging, payment recording | `dashboard/src/lib/erpnext.ts:getOpenInvoices` |
| `Purchase Invoice` | AP vendor bills | `dashboard/src/lib/erpnext.ts:getPurchaseInvoices` |
| `Payment Entry` | AR/AP payment recording | `dashboard/src/lib/erpnext.ts:createPaymentEntry` |
| `Lead` | CRM pipeline | `dashboard/src/lib/erpnext.ts:getLeads, createLead` |
| `CRM Note` | Lead notes | `dashboard/src/lib/erpnext.ts:addLeadNote` |
| `Opportunity` | Sales pipeline | `dashboard/src/lib/erpnext.ts:getOpportunities` |
| `Customer` | Customer master | `dashboard/src/lib/erpnext.ts:getCustomers` |
| `Supplier` | Vendor master | `dashboard/src/lib/erpnext.ts:getSuppliers` |
| `Timesheet` | Billable hours | `dashboard/src/lib/erpnext.ts:getTimesheets` |
| `Subscription` | MRR/ARR calculation | `dashboard/src/lib/erpnext.ts:getSubscriptions` |
| `Subscription Plan Detail` | Child table with plan amounts | `dashboard/src/lib/erpnext.ts:getSubscriptions` |
| `Asset` | HaaS device fleet | `dashboard/src/lib/erpnext.ts:getHaasAssets` |
| `Project` | AI dev project tracking | `dashboard/src/app/billing/page.tsx` |

---

## 10. Configuration & Command Files

### `.claude/CLAUDE.md` (Project Instructions)

```
Location: f:\Github\Dashboard\.claude\CLAUDE.md

Rules:
1. Workflow Orchestration
   - Plan mode for any non-trivial task (3+ steps)
   - Stop and re-plan if something goes sideways
   - Use subagents for research/exploration

2. Subagent Strategy
   - Offload research to subagents to keep main context clean
   - One task per subagent

3. Self-Improvement Loop
   - After any user correction: update tasks/lessons.md
   - Review lessons at session start

4. Verification Before Done
   - Never mark complete without proving it works
   - Ask: "Would a staff engineer approve this?"

5. Demand Elegance
   - For non-trivial changes: "is there a more elegant way?"
   - Skip for simple obvious fixes

6. Autonomous Bug Fixing
   - Just fix bugs, don't ask for hand-holding

Task Management:
1. Plan to tasks/todo.md with checkable items
2. Check in before implementation
3. Mark items complete as you go
4. Add review to tasks/todo.md
5. Update tasks/lessons.md after corrections
```

### `.cursor/rules/kecktech-stack.mdc`

```
Location: f:\Github\Dashboard\.cursor\rules\kecktech-stack.mdc

Tech Stack:
- TypeScript strict
- Next.js 14+
- PostgreSQL + Prisma
- NextAuth.js
- Tailwind CSS
- Docker Compose
- Self-hosted Proxmox

Code Standards:
- UUIDs for all IDs
- createdAt/updatedAt on all models
- Soft deletes (deletedAt)
- Error boundaries and loading states
- Mobile-first
- API-first
- Env vars only (no hardcoded secrets)

File Conventions:
- PascalCase: components, models
- camelCase: utilities
- kebab-case: API routes

Security Checklist:
- Input validation at boundaries
- RBAC via LLDAP groups
- CSRF protection
- Rate limiting
- No secrets in code
- SQL injection prevention
- XSS prevention

Project Context Files:
- docs/prompts/PROJECT-CONTEXT.md
- docs/prompts/platform-services/
- docs/prompts/custom-apps/ (01-10)
```

### `docker/.env.example` (Credential Template)

```
Sections:
- ZAMMAD_API_TOKEN
- MAILCOW_SMTP_USER, MAILCOW_SMTP_PASS
- LLDAP_LDAP_USER_PASS, AUTHELIA_JWT_SECRET, AUTHELIA_SESSION_SECRET, AUTHELIA_STORAGE_ENCRYPTION_KEY
- N8N_ENCRYPTION_KEY, N8N_BASIC_AUTH_PASSWORD
- UMAMI_APP_SECRET
- VAULTWARDEN_ADMIN_TOKEN
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
- CUSTOM_WIKI_API_TOKEN
```

### `docker/authelia/configuration.yml` (Access Rules)

```
Authentication backend: LDAP → lldap:3890
Base DN: dc=kecktech,dc=net
Admin DN: uid=admin,ou=people,dc=kecktech,dc=net

Access rules (in priority order):
1. PUBLIC bypass: kecktech.net, www.kecktech.net, help.kecktech.net, wiki.kecktech.net
2. admin.kecktech.net: groups=kecktech_admins, policy=two_factor
3. portal.kecktech.net:
   - customers → one_factor
   - admins → two_factor
4. *.kecktech.net:
   - staff/billing/support → one_factor
   - admins → two_factor

Session: max_lifetime=12h, inactivity=1h
Notifier: SMTP via mail.kecktech.net:587
```

### Environment Variables (Dashboard, from lib files)

```bash
# ERPNext
ERPNEXT_URL=http://frappe_docker-frontend-1:8080
ERPNEXT_API_KEY=
ERPNEXT_API_SECRET=

# Zammad
ZAMMAD_URL=http://zammad-railsserver:3000
ZAMMAD_API_TOKEN=

# TRMM
TRMM_URL=https://trmm-nginx:4443
TRMM_API_KEY=

# RustDesk
RUSTDESK_SERVER_HOST=
RUSTDESK_PUBLIC_KEY=

# Umami
UMAMI_URL=http://umami:3000
UMAMI_USER=
UMAMI_PASS=
UMAMI_SITE_ID=

# LLDAP (onboarding only)
LLDAP_URL=http://lldap:17170
LLDAP_ADMIN_USER=admin
LLDAP_ADMIN_PASS=
```

---

## 11. Service Inventory (All 27 Services from `docs/INTEGRATIONS.md`)

| Service | URL | Port | Category |
|---|---|---|---|
| Traefik dashboard | traefik.kecktech.net | 8080 | Infrastructure |
| Authelia | auth.kecktech.net | — | SSO |
| LLDAP | lldap.kecktech.net | 17170 | Directory |
| Portainer | portainer.kecktech.net | — | Management |
| ERPNext | erp.kecktech.net | 8080 | ERP/CRM |
| Zammad | zammad.kecktech.net | — | Helpdesk |
| Vaultwarden | vault.kecktech.net | — | Secrets |
| n8n | n8n.kecktech.net | — | Automation |
| Umami | umami.kecktech.net | — | Analytics |
| BookStack | docs.kecktech.net | — | Internal Wiki |
| Custom Wiki | help.kecktech.net | 3011 | Public KB |
| RustDesk | (server IP) | 21115-21119 | Remote Access |
| Tactical RMM | trmm.kecktech.net | 4443 | RMM |
| Dashboard | dash.kecktech.net | 3000 | Internal |
| Customer Portal | portal.kecktech.net | 3012 | External |
| Admin console | admin.kecktech.net | — | Content editing |
| Kecktech website | kecktech.net | — | Public |
| Mailcow | mail.kecktech.net | 587/993 | Email |
| NATS | — | 4222 | Messaging (TRMM) |
| Tailscale | — | — | VPN |
| PostgreSQL (Zammad) | internal | 5432 | Database |
| PostgreSQL (Umami) | internal | 5432 | Database |
| PostgreSQL (Custom Wiki) | internal | 5432 | Database |
| MariaDB (BookStack) | internal | 3306 | Database |
| Redis (Zammad) | internal | 6379 | Cache |
| ERPNext (Frappe) | internal | 8080 | ERP |
| PHP mailer | internal | — | Contact form |

---

## 12. Business Context

**Legal entity**: Kecktech IT Solutions LLC (`docs/BUSINESS-CONTEXT.md`)
**Location**: Park City, Kansas (`docs/BUSINESS-CONTEXT.md`, `website/src/data/contact.json`)
**Founded by**: Jon Keck (Co-Founder & Lead Engineer) (`website/src/data/about.json`)
**Mission**: Replace expensive SaaS with self-hosted alternatives, provide White Glove IT for underserved markets, build solar-powered facility (`website/src/data/about.json`)
**Brand values**: Human-First, Sovereign & Private, Solar & Circular, Radically Accessible, White Glove (`website/src/data/about.json`)
**Phone**: (316) 768-0034 (`website/src/data/contact.json`)
**Email**: support@kecktech.net (`website/src/data/contact.json`)
**Facility goal**: 25kW solar array, 100kWh battery, 1,500 sq ft, $250K fundraising (`website/src/data/about.json`)

### Service Lines & Pricing

| Service | Price | Description | Source |
|---|---|---|---|
| White Glove Managed IT | $199/mo | 24/7 monitoring, dedicated tech, security patching, SLA | `website/src/data/pricing.json` |
| Hardware-as-a-Service | $149/mo/device | Refurbished hardware, 48-month refresh, recycling | `website/src/data/pricing.json` |
| AI Custom App Development | $3K–$8K | Fixed-price, customer owns code, no license fees | `website/src/data/pricing.json` |
| Senior Technology Concierge | $79/mo | Scam protection, device setup, monthly check-ins | `website/src/data/pricing.json` |

### 30-Day Launch Plan (Apr 13 – May 12, 2026)

- 50 prospects identified (`docs/BUSINESS-CONTEXT.md`)
- 60+ outreach touches (`docs/BUSINESS-CONTEXT.md`)
- 5+ discovery calls (`docs/BUSINESS-CONTEXT.md`)
- 1+ MSP client signed (`docs/BUSINESS-CONTEXT.md`)
- Billable consulting hours logged (`docs/BUSINESS-CONTEXT.md`)

---

## 13. Docs Directory Index

| File | Purpose | Status |
|---|---|---|
| `docs/BACKUP-TRANSFER-RESTORE-WINDOWS.md` | Backup/restore for all services on Windows Docker | Current |
| `docs/BOOKSTACK-PARITY-CONTRACT.md` | Visual parity requirements for BookStack → custom-wiki | Reference |
| `docs/BOOKSTACK-PARITY-VALIDATION.md` | Results: BookStack failed, custom-wiki chosen | Reference |
| `docs/BUSINESS-CONTEXT.md` | **MASTER** business document — legal, services, stack, 30-day plan | Current |
| `docs/business_launch.md` | Old Florida ops — **STALE, superseded** | Deprecated |
| `docs/CUSTOM-WIKI-ARCHITECTURE.md` | Custom-wiki runtime topology, data models, API, security, migration | Current |
| `docs/CUSTOM-WIKI-CUTOVER.md` | Cutover runbook for help.kecktech.net | Current (not executed) |
| `docs/CUSTOMER-PORTAL-GAP-ANALYSIS.md` | Portal gap analysis + ready-to-deploy code | Current |
| `docs/DAILY-TASKS.md` | Solo operator daily/weekly/monthly/quarterly checklists | Current |
| `docs/ERPNEXT-SETUP-GUIDE.md` | 18-step ERPNext configuration guide | Current (in-progress) |
| `docs/HTTPS-TEST-ENV.md` | Local HTTPS cert setup with mkcert | Reference |
| `docs/INTEGRATIONS.md` | App-to-app integration map, 27 services, active flows | Current |
| `docs/PROCESS-MAP.md` | 8 end-to-end business processes with automation status | Current |
| `docs/REMAINING-TASKS.md` | Priority 1-4 task list with completion status | Current |
| `docs/restore.md` | Stack restore procedures (databases, volumes, full DR) | Current |
| `docs/RUSTDESK-ACCESS.md` | RustDesk server setup and client config | Reference |
| `docs/ssh-hardening.md` | SSH hardening to Tailscale-only | Reference |
| `docs/TAILSCALE-TEST-ENV.md` | Private test environment setup | Reference |
| `docs/WINDOWS-DOCKER-RECOVERY.md` | Windows Docker recovery for db corruption | Reference |
| `docs/STACK-ISSUES-REMEDIATION-PLAN.md` | **DELETED** | Removed |
| `docs/TROUBLESHOOTING.md` | **DELETED** | Removed |
| `docs/WORDPRESS-RESTORE-WINDOWS.md` | **DELETED** (WordPress removed) | Removed |
| `docs/prompts/PROJECT-CONTEXT.md` | Claude/Cursor project context prompt | Current |
| `docs/prompts/.cursorrules` | Cursor IDE rules for this codebase | Current |

---

*End of ATLAS_HANDOFF.md — Generated from full codebase scan on 2026-04-13*
