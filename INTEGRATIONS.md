# Kecktech.net — App-to-App Integrations

Document here: API base URLs, webhook URLs, and env vars used for integration. **Do not put secrets in this file** — use placeholders and reference `.env` or Vaultwarden.

## Endpoints & Roles

| App | Subdomain / URL | Internal Port | Purpose |
|-----|------------------|---------------|---------|
| Traefik | traefik.kecktech.net | 80/443 | Reverse proxy, TLS termination |
| ERPNext | ops.kecktech.net | 8080 | CRM, HaaS, billing, Stripe |
| Zammad | tickets.kecktech.net | 8080 (nginx) / 3000 (rails) | ITSM tickets; REST API source for n8n |
| n8n | n8n.kecktech.net | 5678 | Workflows: ticket → SMS, RMM → ticket |
| WordPress | kecktech.net / www.kecktech.net | 80 | Public website, lead capture |
| WikiJS | help.kecktech.net | 3000 | Knowledge base (senior + SMB) |
| Umami | stats.kecktech.net | 3000 | Privacy-first analytics |
| Vaultwarden | vault.kecktech.net | 80 | Secrets, client profiles |
| Authelia | auth.kecktech.net | 9091 | SSO gateway (forward-auth) |
| LLDAP | lldap.kecktech.net | 17170 (web), 3890 (LDAP) | SSO user directory |
| Tactical RMM | rmm.kecktech.net | 8444 (nginx) | RMM, patching, alerts |
| Mailcow | mail.kecktech.net | 25/587/993/443 | Self-hosted email |
| RustDesk | (direct IP) | 21115–21119 | Remote support (senior + MSP) |
| Dashboard | dashboard.kecktech.net | 3000 | Ops dashboard (Next.js, Tailscale-only) |
| Portainer | 127.0.0.1:9443 | 9443 | Container management (localhost only) |
| Stripe | — | — | Payments (via ERPNext payment gateway) |
| Twilio | — | — | SMS alerts (via n8n) |

## Mail Configuration

All mail-sending containers route through Mailcow via `extra_hosts: mail.kecktech.net:host-gateway`.

| App | SMTP Host | Port | Auth User | Purpose |
|-----|-----------|------|-----------|---------|
| Authelia | mail.kecktech.net | 587 (STARTTLS) | admin@kecktech.net | Password reset, 2FA notifications |
| Vaultwarden | mail.kecktech.net | 587 (STARTTLS) | admin@kecktech.net | Invite emails, vault notifications |
| WordPress | mail.kecktech.net | 587 (TLS) | admin@kecktech.net | WPForms contact form notifications |
| Zammad | mail.kecktech.net | 587 (STARTTLS) | tickets@kecktech.net | Outbound ticket replies |
| Zammad IMAP | mail.kecktech.net | 993 (SSL) | tickets@kecktech.net | Inbound ticket creation from email |

## Internal API Credentials

| Service | Env Var | Notes |
|---------|---------|-------|
| ERPNext | `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET` | Token-based auth; generate in ERPNext → Settings → API Keys |
| Zammad | `ZAMMAD_API_TOKEN` | Token Access → Admin → API; create persistent token with `ticket.agent` + `admin` permissions |
| Umami | `UMAMI_PASS` | Umami admin password; dashboard uses `admin` username |
| Tactical RMM | `TRMM_API_KEY` | Generated in TRMM → Settings → API Keys |

## Integrations Status

### 1. Zammad → n8n → Twilio (High-Priority Ticket SMS)

- **Status:** Workflow updated for Zammad; Twilio account pending
- **Trigger:** Zammad Trigger (Admin → Triggers) fires on high-priority ticket creation
- **n8n webhook URL:** `https://n8n.kecktech.net/webhook/zammad-ticket` (copy from n8n after activation)
- **Flow:** Zammad Trigger → HTTP POST to n8n → priority_id check → if >= 3 → Twilio SMS to `$TWILIO_ALERT_NUMBER`
- **Zammad priority IDs:** 1=low, 2=normal, 3=high
- **Workflow file:** `docs/n8n-workflows/high-priority-ticket-sms.json`
- **Prerequisites:** Twilio account + API credentials in n8n; set `TWILIO_FROM_NUMBER` and `TWILIO_ALERT_NUMBER` as n8n Variables

### 2. ERPNext ↔ Stripe (Payments)

- **Status:** Not yet configured
- **Flow:** ERPNext Payment Gateway Account → Stripe API → ACH/CC charge
- **Prerequisites:** Stripe account; `STRIPE_API_KEY` in `.env`; configure in ERPNext → Accounting → Payment Gateway

### 3. WordPress → Zammad (Lead/Support Tickets via Email)

- **Status:** Configured; end-to-end test pending
- **Flow:** WPForms (contact form ID 3750) → email to `tickets@kecktech.net` → Mailcow IMAP → Zammad auto-creates ticket
- **Verify:** Submit `kecktech.net/contact/` → check `tickets@kecktech.net` in Mailcow → check Zammad for new ticket

### 4. Tactical RMM → n8n → Zammad (RMM Alert Tickets)

- **Status:** Workflow active in n8n; Zammad API token configured; group permissions assigned
- **Trigger:** TRMM Alert Template `Critical Alerts` → webhook POST to `https://n8n.kecktech.net/webhook/rmm-alert`
- **Flow:** TRMM webhook → n8n → `POST /api/v1/tickets` on zammad-railsserver → ticket in MSP Support group
- **Workflow file:** `docs/n8n-workflows/rmm-alert-ticket.json`
- **Credential:** n8n HTTP Header Auth credential `Zammad API` (`Authorization: Token token=<ZAMMAD_API_TOKEN>`)

### 5. Umami Analytics (WordPress + WikiJS)

- **Status:** Active
- **WordPress:** MU-plugin `kecktech-umami.php` injects tracking script on all pages — Site ID: `d2427fe3-ce4b-4b9a-8e41-a8a3e9f2cd6d`
- **WikiJS:** Tracking script in admin panel — Site ID: `23abf02f-dbf6-4586-aa05-475ff23ae539`
- **Embed script:** `<script defer src="https://stats.kecktech.net/script.js" data-website-id="SITE_ID"></script>`

## n8n Webhook URLs

| Webhook | Path | Workflow |
|---------|------|----------|
| TRMM Alert → Zammad Ticket | `/webhook/rmm-alert` | rmm-alert-ticket.json |
| Zammad High-Priority → SMS | `/webhook/zammad-ticket` | high-priority-ticket-sms.json |

## SSO Protected Routes (Authelia Forward-Auth)

| Route | Policy | Group Required |
|-------|--------|----------------|
| `kecktech.net`, `www.kecktech.net`, `help.kecktech.net` | bypass (public) | — |
| `tickets.kecktech.net` | bypass (Zammad own auth + public portal) | — |
| `vault.kecktech.net` | bypass (Vaultwarden own auth) | — |
| `n8n.kecktech.net` | bypass (n8n own auth; webhooks must be reachable) | — |
| `dashboard.kecktech.net` | one_factor / two_factor | kecktech_admins (2FA), kecktech_staff (1FA) |
| `stats.kecktech.net` | one_factor | kecktech_admins, kecktech_staff |
| `lldap.kecktech.net` | two_factor | kecktech_admins |
| `traefik.kecktech.net` | two_factor | kecktech_admins |
| All other `*.kecktech.net` | deny | — |
