# Kecktech — App-to-App Integrations
**Updated: April 2026** | See `BUSINESS-CONTEXT.md` for business truth.

---

## Service Endpoints

| App | URL | Internal Port | Role |
|-----|-----|---------------|------|
| Traefik | traefik.kecktech.net | 80/443 | Reverse proxy, TLS termination |
| Authelia | auth.kecktech.net | 9091 | SSO forward-auth gateway |
| LLDAP | lldap.kecktech.net | 17170 (web), 3890 (LDAP) | User directory |
| Mailcow | mail.kecktech.net | 25/587/993/443 | Email server (own VM post-migration) |
| Zammad | tickets.kecktech.net | 8080 (nginx) / 3000 (rails) | ITSM; REST API for dashboard + portal |
| ERPNext | erp.kecktech.net (alias: ops) | 8080 | CRM, billing, HaaS, projects, AP |
| Tactical RMM | rmm.kecktech.net | 8444 | RMM, patching, alerts |
| RustDesk | rustdesk.kecktech.net | 21115–21119 | Remote desktop / support |
| Vaultwarden | vault.kecktech.net | 80 | Password manager, client profiles |
| n8n | n8n.kecktech.net | 5678 | Workflow automation |
| Umami | umami.kecktech.net (alias: stats) | 3000 | Privacy-first analytics |
| Custom Wiki / KB | help.kecktech.net (aliases: wiki, kb, bookstack, docs) | 3011 | Public help center (BookStack retired) |
| Astro Site | www.kecktech.net | 80 | Public marketing site (nginx:alpine) |
| Admin Panel | admin.kecktech.net | 3000 | Content editor for Astro site |
| Dashboard | dash.kecktech.net (alias: dashboard) | 3000 | Internal ops dashboard + app tiles |
| Customer Portal | portal.kecktech.net | 3012 | Client account portal (Authelia-gated) |
| Portainer | portainer.kecktech.net | 9443 | Container management |
| Zammad | support.kecktech.net (alias: tickets) | 8080 | ITSM / help desk |

**Removed from stack:** ~~WordPress~~, ~~WikiJS~~, ~~FreeScout~~ — see `docs/archive/`

---

## Mail Configuration

All app containers route SMTP through Mailcow via `extra_hosts`.
**Post-migration:** Replace `mail.kecktech.net:host-gateway` with VM 102 Tailscale IP.

| App | SMTP Host | Port | Auth User | Purpose |
|-----|-----------|------|-----------|---------|
| Authelia | mail.kecktech.net | 587 (STARTTLS) | admin@kecktech.net | Password reset, 2FA notifications |
| Vaultwarden | mail.kecktech.net | 587 (STARTTLS) | admin@kecktech.net | Invite emails |
| Zammad | mail.kecktech.net | 587 (STARTTLS) | tickets@kecktech.net | Outbound ticket replies |
| Zammad IMAP | mail.kecktech.net | 993 (SSL) | tickets@kecktech.net | Inbound ticket creation |
| ERPNext | mail.kecktech.net | 587 (STARTTLS) | admin@kecktech.net | Invoice emails, notifications |

**willworkforlunch.com** (post-migration, VM 101):
- SMTP Host: mail.kecktech.net (VM 102 Tailscale IP)
- Auth: noreply@willworkforlunch.com
- Purpose: Contact form confirmations, transactional email

---

## Internal API Credentials

| Service | Env Var(s) | How to get |
|---------|------------|------------|
| ERPNext | `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET` | ERPNext → Settings → API Keys |
| Zammad | `ZAMMAD_API_TOKEN` | Zammad Admin → API → Token Access |
| Umami | `UMAMI_PASS` | Set in .env at deploy |
| Tactical RMM | `TRMM_API_KEY` | TRMM → Settings → API Keys |
| RustDesk | `RUSTDESK_SERVER_HOST`, `RUSTDESK_PUBLIC_KEY` | `docker exec rustdesk-id cat /root/id_ed25519.pub` |
| BookStack | `BOOKSTACK_APP_KEY`, `BOOKSTACK_DB_PASS` | .env file |

---

## Active Integration Flows

### 1. Public Contact Form → Zammad Ticket
- **Flow:** kecktech.net/contact (Astro + PHP mailer) → email to tickets@kecktech.net → Mailcow IMAP → Zammad auto-ticket
- **Status:** Configured; end-to-end test pending (requires Cloudflare tunnel)
- **Zammad group:** MSP Support

### 2. Tactical RMM Alert → n8n → Zammad Ticket
- **Flow:** TRMM Critical Alert → webhook POST to n8n `/webhook/rmm-alert` → Zammad API creates ticket
- **Status:** Workflow active in n8n; Zammad API token configured
- **Workflow file:** `docs/n8n-workflows/rmm-alert-ticket.json`
- **Credential:** n8n HTTP Header Auth `Zammad API` — `Authorization: Token token=<ZAMMAD_API_TOKEN>`

### 3. Zammad High-Priority Ticket → n8n → Twilio SMS
- **Flow:** Zammad Trigger (priority >= 3) → POST to n8n `/webhook/zammad-ticket` → Twilio SMS
- **Status:** n8n workflow ready; Twilio account pending
- **Workflow file:** `docs/n8n-workflows/high-priority-ticket-sms.json`

### 4. ERPNext ↔ Stripe (Payments)
- **Flow:** Sales Invoice → Stripe Payment Gateway → ACH/CC → ERPNext payment recorded
- **Status:** NOT configured — Stripe account creation pending this week
- **Config:** ERPNext → Accounting → Payment Gateway Accounts

### 5. Umami Analytics
- **kecktech.net** Site ID: `d2427fe3-ce4b-4b9a-8e41-a8a3e9f2cd6d`
- **help.kecktech.net** Site ID: `23abf02f-dbf6-4586-aa05-475ff23ae539`
- Embed: `<script defer src="https://stats.kecktech.net/script.js" data-website-id="SITE_ID"></script>`

### 6. Customer Portal ↔ Zammad + ERPNext + RustDesk
- Portal at portal.kecktech.net fetches: open tickets (Zammad), outstanding invoices (ERPNext), RustDesk server config
- Auth: Authelia forward-auth headers (`remote-email`, `remote-name`, `remote-groups`)
- Full feature gap: see `CUSTOMER-PORTAL-GAP-ANALYSIS.md`

### 7. Dashboard ↔ ERPNext + Zammad + TRMM + Umami
- Internal ops dashboard at dashboard.kecktech.net (Tailscale only)
- Support page: Zammad tickets, TRMM alerts, RustDesk panel, time entry
- Billing page: AR/AP, timesheets, subscriptions, MRR/ARR from ERPNext
- Sales page: CRM leads, opportunities, Umami stats from ERPNext
- Ops page: TRMM client groups, HaaS assets, stack health tiles

---

## SSO Routes (Authelia)

| Route | Policy | Group |
|-------|--------|-------|
| www.kecktech.net, help.kecktech.net | bypass (public) | — |
| tickets.kecktech.net | bypass (Zammad own auth + public portal) | — |
| vault.kecktech.net | bypass (Vaultwarden own auth) | — |
| n8n.kecktech.net | bypass (own auth; webhooks must be reachable) | — |
| portal.kecktech.net | one_factor | Any authenticated user |
| dashboard.kecktech.net | one_factor / two_factor | kecktech_admins (2FA), kecktech_staff (1FA) |
| stats.kecktech.net | one_factor | kecktech_admins, kecktech_staff |
| lldap.kecktech.net | two_factor | kecktech_admins |
| traefik.kecktech.net | two_factor | kecktech_admins |
| All other *.kecktech.net | deny | — |

---

## n8n Webhook URLs

| Webhook | Path | Workflow File |
|---------|------|---------------|
| TRMM Alert → Zammad Ticket | `/webhook/rmm-alert` | rmm-alert-ticket.json |
| Zammad High-Priority → SMS | `/webhook/zammad-ticket` | high-priority-ticket-sms.json |
