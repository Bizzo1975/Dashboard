# Kecktech.net — App-to-App Integrations

Document here: API base URLs, webhook URLs, and env vars used for integration. **Do not put secrets in this file**—use placeholders and reference `.env` or Vaultwarden.

## Endpoints & Roles

| App | Subdomain / URL | Internal Port | Purpose |
|-----|------------------|---------------|--------|
| Traefik | traefik.kecktech.net | 80/443 | Reverse proxy, TLS termination |
| ERPNext | ops.kecktech.net | 8080 | CRM, HaaS, billing, Stripe |
| FreeScout | helpdesk.kecktech.net | 80 (container) | Tickets; webhook source for n8n |
| n8n | n8n.kecktech.net | 5678 | Workflows: ticket → SMS |
| WordPress | kecktech.net | 80 (container) | Public website, lead capture |
| WikiJS | help.kecktech.net | 3000 | Knowledge base |
| Umami | stats.kecktech.net | 3000 | Privacy-first analytics |
| Vaultwarden | vault.kecktech.net | 80 (container) | Secrets, client profiles |
| Authelia | auth.kecktech.net | 9091 | SSO gateway (Phase 5 enforcement) |
| LLDAP | lldap.kecktech.net | 17170 (web), 3890 (LDAP) | SSO user directory |
| Tactical RMM | rmm.kecktech.net | 8444 (nginx) | RMM, patching, alerts |
| Mailcow | mail.kecktech.net | 25/587/993/443 | Self-hosted email |
| RustDesk | (direct IP) | 21115-21119 | Remote support |
| Heimdall | dashboard.kecktech.net | 80 (container) | Legacy dashboard (retiring Phase 5) |
| Portainer | 127.0.0.1:9443 | 9443 | Container management (localhost only) |
| Stripe | — | — | Payments (via ERPNext) |
| Twilio | — | — | SMS (via n8n) |

## Mail Configuration

All mail-sending containers route through Mailcow via `extra_hosts: mail.kecktech.net:host-gateway`.

| App | SMTP Host | Port | Auth User | Purpose |
|-----|-----------|------|-----------|---------|
| Authelia | mail.kecktech.net | 587 (STARTTLS) | admin@kecktech.net | Password reset, 2FA notifications |
| Vaultwarden | mail.kecktech.net | 587 (STARTTLS) | admin@kecktech.net | Invite emails, vault notifications |
| WordPress | mail.kecktech.net | 587 (TLS) | admin@kecktech.net | WPForms contact form notifications |
| FreeScout | mail.kecktech.net | 993 (IMAP) / 587 (SMTP) | support@kecktech.net | Ticket email fetch + replies |

## Integrations Status

### 1. FreeScout → n8n → Twilio (Phase 4)
- **Status:** Not yet wired
- **Trigger:** New or high-priority ticket webhook from FreeScout
- **n8n webhook URL:** `https://n8n.kecktech.net/webhook/freescout-ticket` (create in Phase 4)
- **Flow:** FreeScout webhook → n8n parses priority → if high/urgent → Twilio SMS to Florida contact
- **Prerequisites:** n8n owner account (browser), Twilio account + credentials, FreeScout webhook module

### 2. ERPNext ↔ Stripe (Phase 4)
- **Status:** Not yet configured
- **Flow:** ERPNext Payment Gateway → Stripe API (ACH + card)
- **Prerequisites:** Stripe account, ERPNext setup wizard completed

### 3. WordPress → FreeScout (Contact Form → Ticket)
- **Status:** Partially configured
- **WPForms** contact form created (ID: 3750) → notifications to `support@kecktech.net`
- **Flow:** Visitor submits form → WPForms emails support@kecktech.net → Mailcow → FreeScout IMAP fetch
- **Prerequisites:** FreeScout mailbox configured for `support@kecktech.net` IMAP (Phase 3 browser task)

### 4. Tactical RMM → FreeScout / n8n (Phase 4, optional)
- **Status:** Not yet wired
- **Method:** Webhook from TRMM alert template → n8n → FreeScout API ticket creation
- **Prerequisites:** TRMM alert template configured, n8n webhook endpoint created

### 5. Umami Analytics (Phase 3)
- **Status:** Sites need to be created in Umami UI (default password already changed)
- **Sites to create:** `kecktech.net` (WordPress), `help.kecktech.net` (WikiJS)
- **Embed:** Add tracking script to WordPress (via Insert Headers plugin or WP-CLI) and WikiJS (Administration → Analytics)

## Environment Variables (Integration-Related)

| Variable | Location | Used By |
|----------|----------|---------|
| `MAILCOW_ADMIN_PASS` | `docker/.env` | Authelia, Vaultwarden, WordPress SMTP |
| `N8N_ENCRYPTION_KEY` | `docker/.env` | n8n credential encryption |
| `VAULTWARDEN_ADMIN_TOKEN` | `docker/.env` | Vaultwarden admin panel |
| `FREESCOUT_DB_PASS` | `docker/.env` | FreeScout ↔ MariaDB |
| `UMAMI_APP_SECRET` | `docker/.env` | Umami session signing |
| `TWILIO_*` | n8n credentials (browser) | n8n → Twilio SMS |
| `STRIPE_*` | ERPNext (browser) | ERPNext → Stripe payments |

## Docker Networks

| Network | Purpose | Connected Services |
|---------|---------|-------------------|
| `kecktech_front` | Traefik-routable services | All web-facing containers |
| `kecktech_internal` | Backend-only communication | Databases, app ↔ DB connections |

Update this file as you add or change integrations.
