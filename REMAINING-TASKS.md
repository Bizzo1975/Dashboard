# Kecktech — Remaining Tasks (Ordered)

Generated: 2026-03-15 from full codebase + runtime audit.

**Legend:** `[CLI]` = can be done via code/terminal | `[BROWSER]` = requires manual browser interaction | `[SUDO]` = requires terminal with sudo

---

## Bugs / Fixes (Do First)

- [ ] **`[CLI]` Fix Dashboard healthcheck** — Container is unhealthy (connection refused on `127.0.0.1:3000`). Next.js binds to `0.0.0.0:3000` in Alpine but `wget` to `127.0.0.1` fails. Change healthcheck in `docker/docker-compose.yml` from `wget -qO- http://127.0.0.1:3000/` to `wget -qO- http://0.0.0.0:3000/` or use `curl -f http://localhost:3000/`.
  - File: `docker/docker-compose.yml` line 417
- [ ] **`[CLI]` Investigate missing backups (Mar 14–15)** — Last successful backup was Mar 13. Verify cron is still installed (`crontab -l`) and check if VM was offline. Run a manual backup: `bash scripts/backup.sh`.
- [ ] **`[CLI]` Fix duplicate log lines in backup.sh** — Backup log shows every line doubled. Likely the script is being piped/teed twice. Review `scripts/backup.sh` for duplicate output.

---

## Phase 1: Infrastructure (1 item remaining)

- [ ] **`[SUDO]` 1.8 — SSH hardening + UFW firewall** — UFW is currently **inactive**. Script ready at `scripts/ssh-harden.sh`. Run: `sudo bash scripts/ssh-harden.sh`. Verify Tailscale is active first.
  - Includes: UFW rules for HTTP/HTTPS/mail/RustDesk/NATS, SSH locked to Tailscale IP, password auth disabled
  - After: test SSH from another Tailscale device before closing session
- [ ] **`[BROWSER]` 1.8 — Tailscale ACLs** — Configure ACL tags in Tailscale admin console (`login.tailscale.com/admin/acls`): tag VM as `kecktech-vm`, invite Florida contact, tag as `kecktech-staff`. See PROJECT_PLAN.md Phase 1.8 for JSON template.

---

## Phase 3: Per-App Configuration (Browser Tasks)

### SSO Foundation (do first — unblocks Phase 5)

- [ ] **`[BROWSER]` 3 — LLDAP user/group setup** (`https://lldap.kecktech.net`)
  - Login: `admin` / password in `docker/.env` → `LLDAP_ADMIN_PASS`
  - Create group: `kecktech_admins`
  - Create group: `kecktech_staff`
  - Create your personal admin user → assign to both groups
  - *(Optional improvement)* Create `service_authelia` bind user for least-privilege LDAP access. Currently Authelia uses the `admin` account which works but is over-privileged.

### App Setup Wizards

- [ ] **`[BROWSER]` 3.1 — ERPNext setup wizard** (`https://ops.kecktech.net` or `http://localhost:8080`)
  - Login: `Administrator` / `admin` → **change password immediately**
  - Run Setup Wizard: Company `Kecktech`, Country `United States`, Currency `USD`, Fiscal year Jan–Dec
  - System Settings → Timezone: `America/Chicago`
  - Create 4 Service Items: Remote Support ($45/hr), In-Home ($85/hr), Peace of Mind Monthly ($30/mo), Onboarding (TBD)
  - Create 3 HaaS Item Templates: HAAS-L1, HAAS-L2, HAAS-L3 (with attributes: RAM, Storage)
  - Asset Category: `Leased Hardware` → Straight Line depreciation
  - Tax Template: 0% Kansas IT services (verify with CPA)
  - Supplier: Florida contractor (1099 vendor)
  - CRM Lead Sources: `WordPress Form`, `Referral`, `RMM Alert`
  - CRM Campaign: `Website`, `Word of Mouth`

- [ ] **`[BROWSER]` 3.2 — FreeScout mailbox + config** (`https://helpdesk.kecktech.net`)
  - Login: `admin@kecktech.net` / `admin123` → **change password immediately**
  - Create Mailbox: `Kecktech Support`, email `support@kecktech.net`
    - IMAP: `mail.kecktech.net:993` SSL, user `support@kecktech.net`
    - SMTP: `mail.kecktech.net:587` STARTTLS, user `support@kecktech.net`
    - *(Requires `support@kecktech.net` mailbox created in Mailcow first)*
  - Enable auto-fetch every 5 minutes
  - Add tags: `urgent`, `senior`, `haas`, `billing`
  - Enable Auto Reply for Support mailbox
  - Workflow: Ticket Created → subject contains "urgent" → Set Priority High + Assign Admin
  - Install Webhooks module (Manage → Modules)
  - *(Webhook URL added in Phase 4 after n8n workflow is activated)*

- [ ] **`[BROWSER]` 3.3 — Vaultwarden org + collections** (`https://vault.kecktech.net`)
  - Create account if not done, or access admin panel at `/admin` with token from `.env`
  - Create Organization: `Kecktech Field Tech`
  - Create Collections: `Client Profiles`, `Service Credentials`, `Infrastructure`
  - Invite staff members, assign per-collection access (Infrastructure = admin-only)

- [ ] **`[BROWSER]` 3.4 — n8n owner account** (`https://n8n.kecktech.net`)
  - First visit → create owner account with admin email
  - Import workflow templates from `docs/n8n-workflows/`:
    - `high-priority-ticket-sms.json` (Twilio credentials deferred)
    - `rmm-alert-ticket.json` (needs FreeScout API key from step 3.2)

- [ ] **`[BROWSER]` 3.7 — Umami site creation** (`https://stats.kecktech.net`)
  - Login with changed password (default `admin`/`umami` already changed per PROJECT_PLAN)
  - Add Website: `Kecktech WordPress` → domain `kecktech.net`
  - Add Website: `Kecktech Knowledge Base` → domain `help.kecktech.net`
  - Copy tracking script `<script>` tags for each
  - Disable IP tracking + disable bot data collection for both sites

- [ ] **`[CLI]` 3.5 Step 6 — Embed Umami tracking in WordPress** — After Umami sites created, add script via WP-CLI or Insert Headers plugin. *(Blocked on Umami site creation above)*

- [ ] **`[CLI]` 3.6 Step 6 — Embed Umami tracking in WikiJS** — Add tracking code via WikiJS Administration → Analytics, or inject via DB. *(Blocked on Umami site creation above)*

- [ ] **`[BROWSER]` 3.6 Step 5 — WikiJS iframe rendering** (`https://help.kecktech.net`)
  - Administration → Rendering → HTML → Allow iframes: Enable
  - This unblocks video embedding on the Video Guides page

- [ ] **`[BROWSER]` 3.8 — Tactical RMM initial setup** (`https://rmm.kecktech.net`)
  - Login: `admin` / password from `tactical/.env` → `TRMM_PASS`
  - Complete initial wizard: create client `Kecktech Internal`, site `Kansas Office`, set timezone
  - Download + deploy TRMM agent on test Windows machine
  - Alert Templates → `Critical`: email to `admin@kecktech.net`
  - Import maintenance scripts (disk cleanup, Windows Update, malware scan)
  - Patch Policy: Sunday 2am → apply to `Kecktech Internal`

- [ ] **`[BROWSER]` 3.9 — RustDesk client configuration**
  - Install RustDesk on client device(s)
  - Configure: ID Server = VM IP, Relay Server = VM IP, Key = `XOQqU+on9AobGDLBT1ugNBr0pma1lX7yArY4EnsU8yo=`
  - Test Kansas → Florida screen-share session
  - Record each senior client's RustDesk ID in Vaultwarden `Client Profiles` collection

### Mailcow Prerequisite (if not already done)

- [ ] **`[BROWSER]` Mailcow — Create `support@kecktech.net` mailbox** (`https://mail.kecktech.net`)
  - Login as admin
  - Configuration → Mailboxes → Add: `support@kecktech.net`
  - *(Required before FreeScout IMAP setup in step 3.2)*
  - Verify `admin@kecktech.net` mailbox also exists

---

## Phase 4: Integrations

- [ ] **`[BROWSER]` 4.1 — Test WordPress → FreeScout email flow** — Submit contact form on `kecktech.net/contact/` → verify email arrives at `support@kecktech.net` in Mailcow → verify FreeScout auto-creates ticket from IMAP fetch. *(Blocked on FreeScout IMAP setup)*

- [ ] **`[BROWSER]` 4.2 — Wire FreeScout → n8n webhook** — In FreeScout: Manage → Mailboxes → Support → Webhooks → Add URL → `https://n8n.kecktech.net/webhook/freescout-ticket` → Events: `conversation.created`, `conversation.updated`. Test with "URGENT: Test" ticket. *(Twilio SMS deferred — workflow will log but not send SMS until Twilio credentials added)*

- [ ] **`[BROWSER]` 4.4 — Wire Tactical RMM → n8n webhook** — In TRMM: Alerts → Alert Templates → Webhook URL: `https://n8n.kecktech.net/webhook/rmm-alert`. Test by triggering alert. *(Blocked on n8n + TRMM setup)*

- [ ] **`[DEFERRED]` 4.2b — Twilio SMS credentials** — Add Twilio Account SID + Auth Token to n8n credentials when account is ready. Set `TWILIO_FROM_NUMBER` and `TWILIO_ALERT_NUMBER` in n8n environment variables.

- [ ] **`[DEFERRED]` 4.3 — ERPNext ↔ Stripe** — Configure Payment Gateway in ERPNext with Stripe live/test keys when Stripe account is ready. Test invoice → payment link → charge flow.

- [ ] **`[CLI]` 4.5 — Update INTEGRATIONS.md** — After all webhooks are wired, update with actual webhook URLs and confirm all flows.

---

## Phase 5: SSO Enforcement

- [ ] **`[CLI]` 5 — Switch Authelia from bypass to enforcement** — Update `docker/authelia/configuration.yml`:
  - Change `default_policy: bypass` → `default_policy: deny`
  - Set rules: `kecktech.net` + `help.kecktech.net` → `bypass` (public)
  - `*.kecktech.net` → `two_factor` for `group:kecktech_admins`
  - `*.kecktech.net` → `one_factor` for `group:kecktech_staff`
  - Restart Authelia
  - *(Blocked on LLDAP groups/users being created first)*

- [ ] **`[BROWSER]` 5 — Enroll TOTP for admin** — After enforcement, navigate to any protected subdomain → Authelia prompts TOTP registration → scan QR with Authy/Google Authenticator.

---

## Phase 6: HaaS & Billing

- [ ] **Document TCO per device type** — Hardware COGS + support labor + overhead + target margin for each HaaS tier (L1/L2/L3). Typical term 36–48 months.
- [ ] **Define monthly HaaS prices** — From TCO analysis. Lock in before go-live.
- [ ] **`[BROWSER]` ERPNext lease agreement Print Format** — Settings → Print → Print Format → DocType `Sales Order` → build HTML with client name, hardware description, monthly rate, term, lease-to-own option, signature line. *(Requires legal review)*
- [ ] **`[BROWSER]` Test full HaaS flow** — Lead → Opportunity → Quote with HAAS-L1 → Sales Order → Lease Agreement print → Recurring Sales Invoice → Stripe payment link.

---

## Phase 7: Security & Readiness

- [ ] **`[BROWSER]` 7.3 — Access control audit** — Verify LLDAP groups have correct members, Vaultwarden collections have correct permissions, ERPNext roles are properly assigned.
- [ ] **7.6 — Readiness sign-off** — Full integration test: submit contact form → ticket created → SMS sent → Stripe payment → RMM alert → ticket. All health checks green on dashboard.

---

## Phase 8: Production Deploy (Last — Only After All Above)

- [ ] Install `cloudflared` on VM
- [ ] Create Cloudflare Tunnel (`kecktech-tunnel`)
- [ ] Configure tunnel ingress for **public apps only**: `kecktech.net`, `help.kecktech.net`, `helpdesk.kecktech.net`
- [ ] Install as systemd service
- [ ] Add CNAME records in Cloudflare DNS for public subdomains
- [ ] Add MX, SPF, DKIM, DMARC records for `kecktech.net` email
- [ ] Remove UFW rules for ports 80/443 (traffic flows through tunnel only)
- [ ] Update SITE_URL env vars to production URLs
- [ ] Verify Florida contact Tailscale access to internal apps
- [ ] Final go-live verification: public sites + internal apps + email deliverability

---

## Summary

| Category | Total | CLI | Browser | Sudo | Deferred |
|----------|-------|-----|---------|------|----------|
| Bugs/Fixes | 3 | 3 | — | — | — |
| Phase 1 | 2 | — | 1 | 1 | — |
| Phase 3 | 12 | 2 | 10 | — | — |
| Phase 4 | 5 | 1 | 2 | — | 2 |
| Phase 5 | 2 | 1 | 1 | — | — |
| Phase 6 | 4 | — | 2 | — | — |
| Phase 7 | 2 | — | 2 | — | — |
| Phase 8 | 10 | 10 | — | — | — |
| **Total** | **40** | **17** | **18** | **1** | **2** |
