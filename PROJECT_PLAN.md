# Kecktech.net — Full Application Stack Project Plan

Single linear plan to build and operate the senior citizen IT support stack: website, knowledge base (with video), backend ERP, help desk, billing, HaaS, remote access, and integrated operations.

**Environment:**
- **All containers run on this VM and are managed from the project folder.** Main stack: `Dashboard/docker/` (docker-compose.yml). ERPNext: `Dashboard/erpnext/frappe_docker/`. Start everything from Dashboard with `./startup-all` (Linux) or `startup-all.bat` (Windows). Shut down the full dev stack on Windows with `shutdown-all.bat` (reverse order: ERPNext → Tactical → Mailcow → main `docker/` stack).
- **Build in test first.** All application deployment, configuration, integrations, dashboard, and SSO are done in the test environment on this VM.
- **Do not configure Cloudflare until all applications are configured and ready to deploy.** Cloudflare Tunnel and public DNS are set up in a final "Production deploy" phase, after the full stack is working in test.

**Configuration decisions locked:**
| Decision | Choice |
|----------|--------|
| Mail server | Mailcow (self-hosted, own compose stack at `Dashboard/mailcow/`) |
| SSO identity backend | LLDAP (lightweight LDAP in Docker, added to main stack) |
| SSO gatekeeper | Authelia (added to main stack) |
| Custom dashboard | Next.js (API routes for health checks; Docker-deployed) |
| Tactical RMM | Self-hosted now, same VM (proxied through Traefik) |
| Umami DB | Dedicated Postgres container (isolated from BookStack) |
| WordPress theme | Astra + Spectra/Gutenberg blocks (free tier) |
| Service prices | Placeholder — confirm before go-live |
| Remote network access | **Tailscale** — VM joined to workspace; provides secure mesh access for staff and admin without opening inbound ports |

---

## Scope Summary

| Deliverable | Description |
|-------------|-------------|
| **Backend** | ERPNext (CRM, HaaS, accounting, HR, billing), Zammad (ITSM tickets), Tactical RMM |
| **Website** | WordPress: services, pricing, "About the Founder," lead capture |
| **Knowledge base** | BookStack: senior-friendly articles, API import pipeline, high-contrast theme |
| **Integrations** | n8n (SMS dispatch), Stripe via ERPNext (payments), Vaultwarden (client secrets), Umami (analytics) |
| **Remote** | RustDesk for remote support |
| **Unified access** | Custom Next.js dashboard with tiles + health checks; SSO (Authelia + LLDAP) for all internal apps |
| **App-to-app** | Documented and implemented communication (webhooks, APIs) between all relevant apps |

Reference: *business_launch.md* holds the 5-step business launch plan and the Kecktech Implementation Guide summary (legal, operations, service mix, marketing, onboarding).

---

## Prerequisites (Before Starting)

- [x] **VM available** — Ubuntu 24.04.4 LTS; all containers run on this VM. Cursor IDE running directly on the VM.
- [x] **Docker + Compose v2 installed** — Docker 29.3.0, Compose v5.1.0, confirmed running.
- [x] **Repo cloned on VM** — `Dashboard/` present; all config-as-code managed here.
- [x] **Tailscale installed and joined to workspace** — VM hostname `kecktech-1`, Tailscale IP `100.73.237.44`. Workspace: `Bizzo1975@`. Active peers: `alisha-pc` (Windows, online), `kecktech` (Linux, online), two offline dev machines.
- [x] **Domain kecktech.net reserved** — registered and DNS managed via Cloudflare. **Do not configure Cloudflare Tunnel or public DNS records until Phase 8.**
- [ ] **Twilio account** — needed for n8n SMS dispatch; fill in credentials when ready.
- [ ] **Stripe account** — needed for ERPNext payments; confirm account is created.
- [x] **Decisions locked** — see configuration table above.

> **Tailscale note:** Use `100.73.237.44` (or `kecktech-1`) as `YOUR_VM_IP` in `/etc/hosts` on all Tailscale-connected test machines. The VM itself should use `127.0.0.1` for its own `/etc/hosts` entries.

> **Cloudflare note:** The domain is already with Cloudflare. Do not add any DNS records, tunnels, or proxied entries until Phase 8. The Cloudflare account is ready for when that time comes — no additional setup needed now.

> **Cleanup needed:** `pwd-*` containers (a second ERPNext instance from `pwd.yml`) are currently restarting in a crash loop. These should be stopped and removed before proceeding with Phase 1. Run from `Dashboard/erpnext/frappe_docker/`: `docker compose -f pwd.yml down` to clean them up.

*For production deploy only (Phase 8):* Cloudflare Tunnel configured; public DNS records added. All internal apps remain Tailscale-only.

---

## Phase 1: Infrastructure & Security Foundation (Test Environment)

**Goal:** Stable host, Docker networking, Traefik reverse proxy, self-hosted mail, local DNS, and Tailscale mesh for secure remote access. **No Cloudflare in this phase.**

| Step | Action | Details |
|------|--------|---------|
| ~~1.1~~ ✅ | Harden Ubuntu VM | Ubuntu 24.04.4 LTS; UFW **pending** — requires terminal sudo (see command below). |
| ~~1.2~~ ✅ | Install Docker + Compose | Docker 29.3.0 + Compose v5.1.0 confirmed. |
| ~~1.3~~ ✅ | Create Docker networks | `kecktech_front` and `kecktech_internal` created. |
| ~~1.4~~ ✅ | Reverse proxy (Traefik) | Traefik latest deployed; all 8 hostnames routing correctly via self-signed TLS. |
| ~~1.5~~ ✅ | Local DNS (/etc/hosts) | 15 entries added to VM `/etc/hosts`. Windows steps documented in section 1.5. |
| ~~1.6~~ ✅ | Self-hosted mail (Mailcow) | 18 containers running; `mail.kecktech.net → 200` via Traefik. Subnet 172.23.1.0/24. ClamAV/Solr skipped (low RAM). |
| ~~1.7~~ ✅ | Backups | `scripts/backup.sh` dumps all DBs + volumes; cron at 02:00 daily; 14-day retention. |
| 1.8 ⚠️ | Tailscale ACLs + SSH lockdown | **Requires terminal sudo.** Full guide: `docs/ssh-hardening.md`. |

**Exit criteria:** VM updated; Docker and Traefik run reliably ✅; apps reachable on test hostnames ✅; Mailcow operational ✅; backups scheduled ✅; Tailscale access verified from remote machine ⬜.

---

### 1.1 — Harden Ubuntu VM

```
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw curl git
# Allow SSH and needed ports (adjust as you add services)
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
# Disable root SSH login: edit /etc/ssh/sshd_config → PermitRootLogin no; PasswordAuthentication no
# Add your public key to ~/.ssh/authorized_keys before applying
sudo systemctl restart ssh
```

---

### 1.2 — Install Docker + Compose

```
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# Log out and back in, then verify:
docker --version
docker compose version
```

---

### 1.3 — Create Docker Networks

Add the following top-level `networks:` block to `docker/docker-compose.yml` and declare the networks as external (create them once on the host):

```
docker network create kecktech_front
docker network create kecktech_internal
docker network create kecktech_mail
```

In `docker/docker-compose.yml`, add at the bottom:

```yaml
networks:
  kecktech_front:
    external: true
  kecktech_internal:
    external: true
```

Each service that needs reverse-proxy access gets `networks: [kecktech_front]`. Services that communicate only with each other get `networks: [kecktech_internal]`.

---

### 1.4 — Traefik Reverse Proxy

Add the Traefik service to `docker/docker-compose.yml`. Create `docker/traefik/traefik.yml` (static config) and `docker/traefik/dynamic/` (dynamic config directory).

**`docker/traefik/traefik.yml`:**

```yaml
api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    exposedByDefault: false
    network: kecktech_front
  file:
    directory: /etc/traefik/dynamic
    watch: true

log:
  level: INFO
```

**`docker/traefik/dynamic/tls.yml`** (self-signed TLS for test):

```yaml
tls:
  options:
    default:
      minVersion: VersionTLS12
```

**Traefik service block in `docker/docker-compose.yml`:**

```yaml
  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./traefik/dynamic:/etc/traefik/dynamic:ro
      - traefik_certs:/certs
    networks:
      - kecktech_front
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik-dashboard.rule=Host(`traefik.kecktech.net`)"
      - "traefik.http.routers.traefik-dashboard.entrypoints=websecure"
      - "traefik.http.routers.traefik-dashboard.tls=true"
      - "traefik.http.routers.traefik-dashboard.service=api@internal"
      - "traefik.http.routers.traefik-dashboard.middlewares=authelia@docker"
```

Add `traefik_certs:` to the `volumes:` section.

Each existing service then removes its host `ports:` mapping (except RustDesk, which needs direct TCP/UDP) and gets Traefik labels. Example for FreeScout:

```yaml
    networks:
      - kecktech_front
      - kecktech_internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.freescout.rule=Host(`helpdesk.kecktech.net`)"
      - "traefik.http.routers.freescout.entrypoints=websecure"
      - "traefik.http.routers.freescout.tls=true"
      - "traefik.http.routers.freescout.middlewares=authelia@docker"
```

> **Note:** Heimdall port 80 conflicts with Traefik. Once Traefik is running, Heimdall will be retired (Phase 5.6). Until the custom dashboard is ready, access apps directly by port or keep Heimdall on an alternate port (e.g., `8090:80`).

---

### 1.5 — Local DNS (/etc/hosts)

**Status:** VM entries not yet added — run the VM command below. Windows (`alisha-pc`) entries not yet added — follow the Windows steps.

The VM's confirmed Tailscale IP is **`100.73.237.44`** (hostname: `kecktech-1`). Current `/etc/hosts` on the VM has no kecktech entries.

---

#### A — Add entries on this VM (Ubuntu)

Open a terminal on the VM and run this single command. It requires your sudo password:

```bash
sudo tee -a /etc/hosts << 'EOF'

# Kecktech test stack — local resolution (Phase 1.5)
127.0.0.1  kecktech.net
127.0.0.1  help.kecktech.net
127.0.0.1  helpdesk.kecktech.net
127.0.0.1  ops.kecktech.net
127.0.0.1  vault.kecktech.net
127.0.0.1  stats.kecktech.net
127.0.0.1  dashboard.kecktech.net
127.0.0.1  n8n.kecktech.net
127.0.0.1  rmm.kecktech.net
127.0.0.1  api.kecktech.net
127.0.0.1  mesh.kecktech.net
127.0.0.1  mail.kecktech.net
127.0.0.1  traefik.kecktech.net
127.0.0.1  auth.kecktech.net
127.0.0.1  lldap.kecktech.net
EOF
```

Verify it worked:

```bash
grep kecktech /etc/hosts
# Should print all 15 lines above
```

---

#### B — Add entries on Windows (`alisha-pc`)

> **Prerequisite:** `alisha-pc` must be joined to the Tailscale workspace (`Bizzo1975@`) and able to reach the VM at `100.73.237.44`. Confirm with `ping 100.73.237.44` in PowerShell before proceeding.

**Step-by-step (copy and paste each block exactly):**

**1. Open Notepad as Administrator**
- Press `Windows key`, type `notepad`
- Right-click **Notepad** in the results → click **Run as administrator**
- Click **Yes** on the UAC prompt

**2. Open the hosts file**
- In Notepad: **File → Open**
- In the file name box, paste this exact path and press Enter:
  ```
  C:\Windows\System32\drivers\etc\hosts
  ```
- Change the file type filter (bottom-right dropdown) from `Text Documents (*.txt)` to `All Files (*.*)`
- The `hosts` file will appear — click it and click **Open**

**3. Scroll to the very bottom of the file and paste these lines**

```
# Kecktech test stack — Phase 1.5
100.73.237.44  kecktech.net
100.73.237.44  help.kecktech.net
100.73.237.44  helpdesk.kecktech.net
100.73.237.44  ops.kecktech.net
100.73.237.44  vault.kecktech.net
100.73.237.44  stats.kecktech.net
100.73.237.44  dashboard.kecktech.net
100.73.237.44  n8n.kecktech.net
100.73.237.44  rmm.kecktech.net
100.73.237.44  api.kecktech.net
100.73.237.44  mesh.kecktech.net
100.73.237.44  mail.kecktech.net
100.73.237.44  traefik.kecktech.net
100.73.237.44  auth.kecktech.net
100.73.237.44  lldap.kecktech.net
```

**4. Save the file**
- **File → Save** (not Save As — same file, same location)
- Notepad will save without any prompt if you opened it as Administrator correctly

**5. Flush the DNS cache to apply immediately**
- Open **PowerShell** (any window — no need for Administrator)
- Run:
  ```
  ipconfig /flushdns
  ```

**6. Test it**
- In PowerShell, run:
  ```
  ping kecktech.net
  ```
- You should see replies from `100.73.237.44`. If you get replies, the hosts file is working.
- Once Traefik is running (Phase 1.4), browsing to `https://kecktech.net` from `alisha-pc` will reach the stack.

> **Tip:** Any other Tailscale-connected device (Florida contact, etc.) follows the same Windows steps above — just replace `alisha-pc` with that machine's name. The only requirement is being in the `Bizzo1975@` Tailscale workspace.

---

### 1.6 — Self-Hosted Mail (Mailcow)

> ✅ **Status:** Complete. 18 Mailcow containers running. Web UI available at `https://mail.kecktech.net`.

| Config | Value |
|--------|-------|
| Location | `Dashboard/mailcow/` |
| Web UI | `https://mail.kecktech.net` (Traefik → nginx-mailcow:8025) |
| HTTP port | 8025 (non-standard; Traefik owns 80) |
| HTTPS port | 8443 (non-standard) |
| Subnet | 172.23.1.0/24 (avoids overlap with kecktech_internal) |
| ClamAV | Skipped (`SKIP_CLAMD=y`) — re-enable if RAM is upgraded |
| Solr | Skipped (`SKIP_SOLR=y`) |
| Traefik override | `mailcow/docker-compose.override.yml` |

> **Port 25 note:** If your ISP blocks inbound port 25, use an SMTP relay (SMTP2Go, Brevo) for outbound.
> Mailcow will still handle all IMAP and internal SMTP for FreeScout/Authelia notifications.

**Required post-install steps (do now in browser):**
1. Browse to `https://mail.kecktech.net` — default login: `admin` / `moohoo`.
2. **Change admin password immediately** (top-right → Edit administrator).
3. Add domain: `kecktech.net` → Configuration → Domains → Add domain.
4. Create mailbox: `support@kecktech.net` (for FreeScout inbound/outbound).
5. Create mailbox: `admin@kecktech.net` (for ERPNext and Authelia notifications).
6. Note DKIM key under Configuration → Domains → kecktech.net → DNS — add to Cloudflare in Phase 8.

### 1.7 — Backups

> ✅ **Status:** Complete. Cron job installed; runs daily at 02:00 UTC.

| Config | Value |
|--------|-------|
| Script | `Dashboard/scripts/backup.sh` |
| Cron | `0 2 * * *` (02:00 UTC daily) |
| Destination | `Dashboard/backups/YYYY-MM-DD/` |
| Retention | 14 days (auto-cleaned) |
| Coverage | All MariaDB + Postgres DBs, Vaultwarden, n8n, LLDAP, FreeScout volumes, config files |

To run a manual backup:
```bash
bash /home/vboxuser/Dashboard/scripts/backup.sh
```

To verify the cron job is installed:
```bash
crontab -l
```

---

### 1.8 — Tailscale ACLs + SSH Lockdown

> ⚠️ **Status:** Requires terminal sudo. **Automated script available:** `sudo bash scripts/ssh-harden.sh` (includes safety checks for Tailscale). Manual commands below for reference. Full reference: `docs/ssh-hardening.md`.
>
> **VM Tailscale IP:** `100.73.237.44`

**Step 1 — Enable UFW with all service ports (run in terminal):**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 25/tcp
sudo ufw allow 465/tcp
sudo ufw allow 587/tcp
sudo ufw allow 143/tcp
sudo ufw allow 993/tcp
sudo ufw allow 21115:21119/tcp
sudo ufw allow 21116/udp
sudo ufw allow in on tailscale0 to any port 22 proto tcp
sudo ufw deny 22/tcp
sudo ufw --force enable
sudo ufw status verbose
```

**Step 2 — Lock SSH to Tailscale interface only (run in terminal):**

```bash
# Backup sshd_config first
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F)

# Append hardening block
sudo tee -a /etc/ssh/sshd_config << 'EOF'

# --- Kecktech hardening (Phase 1.8) ---
ListenAddress 100.73.237.44
ListenAddress 127.0.0.1
PasswordAuthentication no
PermitRootLogin no
MaxAuthTries 3
EOF

# Validate then restart
sudo sshd -t && echo "Config OK" && sudo systemctl restart ssh
```

> ⚠️ **Warning:** Confirm Tailscale is active on this VM before restarting SSH or you will be locked out.

**Configure Tailscale ACL for Florida contact:**

In your Tailscale admin console (`https://login.tailscale.com/admin/acls`), add an ACL tag and grant the Florida contact access to the apps they need:

```json
{
  "tagOwners": {
    "tag:kecktech-vm": ["autogroup:admin"],
    "tag:kecktech-staff": ["autogroup:admin"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:kecktech-staff"],
      "dst": ["tag:kecktech-vm:443", "tag:kecktech-vm:80"]
    },
    {
      "action": "accept",
      "src": ["autogroup:admin"],
      "dst": ["tag:kecktech-vm:*"]
    }
  ]
}
```

Tag the VM as `kecktech-vm` in the Tailscale admin console. Invite the Florida contact to the Tailscale workspace and tag their device as `kecktech-staff` — they will then be able to reach `https://helpdesk.kecktech.net` and the dashboard through the Tailscale IP via their `/etc/hosts` entries, protected by Authelia.

**Enable Tailscale SSH (optional enhancement):**

Tailscale SSH allows key-free, identity-verified SSH through the Tailscale network — no SSH keys needed for teammates:

```bash
sudo tailscale set --ssh
```

In the Tailscale ACL, add `"ssh"` rules to specify who can SSH to the VM. See [tailscale.com/kb/1193/tailscale-ssh](https://tailscale.com/kb/1193/tailscale-ssh) for full syntax.

**Verify connectivity from a remote machine:**

1. Ensure the remote machine is joined to the Tailscale workspace.
2. Add the VM's Tailscale IP to `/etc/hosts` on the remote machine (Step 1.5).
3. Browse to `https://dashboard.kecktech.net` — should reach the stack.

---

## Phase 2: Deploy Core Applications (Containers)

**Goal:** All apps run in Docker; start order respects dependencies. Missing services (n8n, LLDAP, Authelia, Tactical RMM) added in this phase.

| Step | Service | Purpose | Status |
|------|---------|---------|--------|
| ~~2.1~~ ✅ | MariaDB/PostgreSQL | Per-app DBs | Each app has its own DB container |
| ~~2.2~~ ✅ | ERPNext | CRM, HaaS, accounting, HR, billing | Running via `frappe_docker`; accessible at `ops.kecktech.net` |
| ~~2.3~~ ✅ | Zammad | ITSM help desk / tickets (replaced FreeScout) | Running → `tickets.kecktech.net` |
| ~~2.4~~ ✅ | Vaultwarden | Encrypted client profiles | Running (healthy) → `vault.kecktech.net` |
| ~~2.5~~ ✅ | n8n | Workflow automation | Added and running → `n8n.kecktech.net` |
| ~~2.6~~ ✅ | WordPress | Main marketing site | Running → `kecktech.net` (5-min install still needed — Phase 3) |
| ~~2.7~~ ✅ | BookStack | Knowledge base | Running → `help.kecktech.net` |
| ~~2.8~~ ✅ | Umami | Privacy-first analytics | Fixed — own Postgres (`umami-db`) → `stats.kecktech.net` |
| ~~2.9~~ ✅ | **Tactical RMM** | RMM (patching, alerts, remote) | Running → `rmm.kecktech.net`, `api.kecktech.net`, `mesh.kecktech.net` |
| ~~2.10~~ ✅ | RustDesk | Remote support | Running (ID + relay; direct ports) |
| ~~2.11~~ ✅ | LLDAP | Lightweight LDAP for SSO users | Running (healthy) → `lldap.kecktech.net` |
| ~~2.12~~ ✅ | Authelia | SSO gateway | Running (healthy) → `auth.kecktech.net`; bypass mode during setup |

**Exit criteria:** Every app starts cleanly ✅; reachable via Traefik on test hostnames ✅; volumes documented ✅. All services deployed ✅.

---

### 2.5 — Add n8n to docker-compose.yml

Add to `docker/docker-compose.yml` under services:

```yaml
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    environment:
      - N8N_HOST=n8n.kecktech.net
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.kecktech.net/
      - GENERIC_TIMEZONE=America/Chicago
      - N8N_BASIC_AUTH_ACTIVE=false
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - kecktech_front
      - kecktech_internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n8n.rule=Host(`n8n.kecktech.net`)"
      - "traefik.http.routers.n8n.entrypoints=websecure"
      - "traefik.http.routers.n8n.tls=true"
      - "traefik.http.routers.n8n.middlewares=authelia@docker"
      - "traefik.http.services.n8n.loadbalancer.server.port=5678"
```

Add `n8n_data:` to `volumes:`.

---

### 2.8 — Fix Umami (Dedicated Postgres)

In `docker/docker-compose.yml`, replace the current Umami + shared-DB setup:

```yaml
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    container_name: umami
    restart: always
    environment:
      - DATABASE_URL=postgresql://umami:${UMAMI_DB_PASS}@umami-db:5432/umami
      - APP_SECRET=${UMAMI_APP_SECRET}
    depends_on:
      - umami-db
    networks:
      - kecktech_front
      - kecktech_internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.umami.rule=Host(`stats.kecktech.net`)"
      - "traefik.http.routers.umami.entrypoints=websecure"
      - "traefik.http.routers.umami.tls=true"
      - "traefik.http.routers.umami.middlewares=authelia@docker"
      - "traefik.http.services.umami.loadbalancer.server.port=3000"

  umami-db:
    image: postgres:15-alpine
    container_name: umami-db
    restart: always
    environment:
      - POSTGRES_DB=umami
      - POSTGRES_USER=umami
      - POSTGRES_PASSWORD=${UMAMI_DB_PASS}
    volumes:
      - umami_db_data:/var/lib/postgresql/data
    networks:
      - kecktech_internal
```

Add `umami_db_data:` to `volumes:`. Set `UMAMI_DB_PASS` and `UMAMI_APP_SECRET` in `docker/.env`.

---

### 2.9 — Tactical RMM

> ✅ **Status:** Complete. All 3 subdomains live via Traefik.

| Config | Value |
|--------|-------|
| Location | `Dashboard/tactical/` |
| Web UI | `https://rmm.kecktech.net` |
| API | `https://api.kecktech.net` |
| MeshCentral | `https://mesh.kecktech.net` |
| Internal HTTPS | 8444 (trmm-nginx on `127.0.0.1`; Traefik routes via kecktech_front Docker network) |
| Subnet | `172.27.0.0/24` (api-db: .1, redis: .2, mesh-db: .3) |
| Login | `admin` / see `tactical/.env` → `TRMM_PASS` |
| Cert (test) | Self-signed wildcard `*.kecktech.net` (replace with LE cert in Phase 8) |
| Traefik routing | Docker labels on `trmm-nginx`; `trmm-transport@file` (insecureSkipVerify) in `docker/traefik/dynamic/tactical.yml` |

**Required post-install steps (do now in browser):**
1. Browse to `https://rmm.kecktech.net` and log in with `admin` + the password from `tactical/.env`.
2. Complete initial setup wizard: create your first client and site, set timezone.
3. Download and deploy the TRMM agent on any managed Windows machine.
4. Add NATS port to UFW once firewall is enabled (Phase 1.8): `sudo ufw allow 4222/tcp`

**Phase 8 cert upgrade** (when Cloudflare DNS is live):
```bash
# Generate LE wildcard cert via DNS-01 challenge
sudo certbot certonly --manual -d *.kecktech.net --preferred-challenges dns
# Base64-encode and update CERT_PUB_KEY / CERT_PRIV_KEY in tactical/.env
# docker compose up -d --force-recreate tactical-nginx
```

---

### 2.11 — Add LLDAP to docker-compose.yml

LLDAP provides a simple LDAP server with a web UI for managing users that Authelia authenticates against.

```yaml
  lldap:
    image: lldap/lldap:stable
    container_name: lldap
    restart: always
    environment:
      - LLDAP_JWT_SECRET=${LLDAP_JWT_SECRET}
      - LLDAP_LDAP_BASE_DN=dc=kecktech,dc=net
      - LLDAP_LDAP_USER_PASS=${LLDAP_ADMIN_PASS}
      - LLDAP_HTTP_PORT=17170
      - TZ=America/Chicago
    volumes:
      - lldap_data:/data
    networks:
      - kecktech_internal
      - kecktech_front
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.lldap.rule=Host(`lldap.kecktech.net`)"
      - "traefik.http.routers.lldap.entrypoints=websecure"
      - "traefik.http.routers.lldap.tls=true"
      - "traefik.http.routers.lldap.middlewares=authelia@docker"
      - "traefik.http.services.lldap.loadbalancer.server.port=17170"
```

Add `lldap_data:` to `volumes:`. Set `LLDAP_JWT_SECRET` and `LLDAP_ADMIN_PASS` in `docker/.env`.

**LLDAP initial setup:**
1. Access `https://lldap.kecktech.net` → login as `admin` with `LLDAP_ADMIN_PASS`.
2. Create group: `kecktech_admins`.
3. Create group: `kecktech_staff`.
4. Create user: your own admin user → assign to both groups.
5. Create user: `service_authelia` (bind user for Authelia LDAP queries) → no groups needed.
6. Note the bind DN: `uid=service_authelia,ou=people,dc=kecktech,dc=net`.

---

### 2.12 — Add Authelia to docker-compose.yml

Authelia sits in front of Traefik and enforces SSO. Create `docker/authelia/configuration.yml`.

```yaml
  authelia:
    image: authelia/authelia:latest
    container_name: authelia
    restart: always
    volumes:
      - ./authelia:/config
    environment:
      - AUTHELIA_JWT_SECRET=${AUTHELIA_JWT_SECRET}
      - AUTHELIA_SESSION_SECRET=${AUTHELIA_SESSION_SECRET}
      - AUTHELIA_STORAGE_ENCRYPTION_KEY=${AUTHELIA_STORAGE_KEY}
    networks:
      - kecktech_front
      - kecktech_internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.authelia.rule=Host(`auth.kecktech.net`)"
      - "traefik.http.routers.authelia.entrypoints=websecure"
      - "traefik.http.routers.authelia.tls=true"
      - "traefik.http.services.authelia.loadbalancer.server.port=9091"
      - "traefik.http.middlewares.authelia.forwardauth.address=http://authelia:9091/api/authz/forward-auth"
      - "traefik.http.middlewares.authelia.forwardauth.trustForwardHeader=true"
      - "traefik.http.middlewares.authelia.forwardauth.authResponseHeaders=Remote-User,Remote-Groups,Remote-Name,Remote-Email"
```

**`docker/authelia/configuration.yml`** (key sections):

```yaml
theme: light
jwt_secret: "{{ env AUTHELIA_JWT_SECRET }}"

authentication_backend:
  ldap:
    implementation: lldap
    url: ldap://lldap:3890
    base_dn: dc=kecktech,dc=net
    username_attribute: uid
    users_filter: "(&({username_attribute}={input})(objectClass=person))"
    groups_filter: "(member={dn})"
    user: uid=service_authelia,ou=people,dc=kecktech,dc=net
    password: "LLDAP_SERVICE_USER_PASSWORD"

session:
  secret: "{{ env AUTHELIA_SESSION_SECRET }}"
  domain: kecktech.net
  expiration: 12h
  inactivity: 1h

storage:
  local:
    path: /config/db.sqlite3
  encryption_key: "{{ env AUTHELIA_STORAGE_KEY }}"

access_control:
  default_policy: deny
  rules:
    - domain: "kecktech.net"
      policy: bypass
    - domain: "help.kecktech.net"
      policy: bypass
    - domain: "*.kecktech.net"
      policy: two_factor
      subject: "group:kecktech_admins"
    - domain: "*.kecktech.net"
      policy: one_factor
      subject: "group:kecktech_staff"

notifier:
  smtp:
    host: mail.kecktech.net
    port: 587
    username: admin@kecktech.net
    password: "ADMIN_MAILBOX_PASSWORD"
    sender: "Kecktech Auth <admin@kecktech.net>"
```

Set `AUTHELIA_JWT_SECRET`, `AUTHELIA_SESSION_SECRET`, and `AUTHELIA_STORAGE_KEY` (32+ char random strings) in `docker/.env`.

---

## Phase 2.5: Docker Hardening & Security Fixes ✅

**Goal:** Harden the Docker stack before beginning per-app configuration. All items completed.

| # | Action | Status |
|---|--------|--------|
| ~~H1~~ ✅ | **Bind Portainer to localhost only** — Ports changed from `0.0.0.0:9443/8000` to `127.0.0.1:9443/8000` | Done |
| ~~H2~~ ✅ | **Fix Authelia `identity_validation.reset_password.jwt_secret`** — Replaced literal `"placeholder_replaced_by_env"` with `${AUTHELIA_JWT_SECRET}` env var | Done |
| ~~H3~~ ✅ | **Rotate ERPNext DB password** — Changed from `123` to generated secret; updated in MariaDB (root + app user), `.env`, and bench site config | Done |
| ~~H4~~ ✅ | **Pin Docker image versions** — All images pinned: `traefik:v3.6.10`, `authelia:4.39.15`, `n8n:2.11.2`, `wordpress:6.9.1`, `vaultwarden:1.35.4`, `rustdesk:1.1.15`, `heimdall:2.7.6`. Exceptions: `portainer:latest` (DB schema migration breaks on pin), `freescout:latest` (no versioned tags) | Done |
| ~~H5~~ ✅ | **Add Docker healthchecks** — All app containers now have healthchecks: traefik (ping), freescout/wordpress (curl), n8n (wget /healthz), wikijs (curl /healthz), umami (curl /api/heartbeat), all DBs (healthcheck.sh or pg_isready) | Done |
| ~~H6~~ ✅ | **Add resource limits** — `mem_limit` set on all containers: traefik(256m), lldap(128m), authelia(256m), freescout(512m), freescout-db(256m), vaultwarden(256m), n8n(512m), wordpress(512m), wp-db(256m), wikijs(512m), wikijs-db(128m), umami(512m), umami-db(128m), heimdall(256m), portainer(128m) | Done |
| ~~H7~~ ✅ | **Enable Traefik ping endpoint** — Added `ping: {}` to `traefik.yml` for healthcheck support | Done |
| ~~H8~~ ✅ | **Clean up WordPress plugins** — Removed Contact Form 7, SureForms, Hello Dolly, LatePoint; kept WPForms Lite | Done |
| ~~H9~~ ✅ | **Update `.env.example`** — Synced with current `.env` variables | Done |

**Exit criteria:** All containers running and healthy ✅; no unnecessary port exposure ✅; secrets rotated ✅; images pinned ✅.

---

## Phase 3: Per-App Configuration

**Goal:** Each app is configured for Kecktech use (branding, pricing, accessibility, integrations).

**Infrastructure config completed ✅:**
- Authelia: switched to SMTP notifier (Mailcow `admin@kecktech.net`); `extra_hosts` added so all containers resolve `mail.kecktech.net` correctly via host gateway.
- Vaultwarden: SMTP settings configured (`admin@kecktech.net` / Mailcow); admin token set.
- All mail-sending services (Authelia, Vaultwarden, n8n, FreeScout, WordPress) now have `extra_hosts: mail.kecktech.net:host-gateway`.
- RustDesk server key: `XOQqU+on9AobGDLBT1ugNBr0pma1lX7yArY4EnsU8yo=`

**⚠️ One manual step required before testing SMTP:** Set `MAILCOW_ADMIN_PASS` in `docker/.env` to the `admin@kecktech.net` mailbox password you created in Mailcow, then run:
```bash
cd /home/vboxuser/Dashboard/docker && docker compose up -d authelia vaultwarden
```

**Code-based tasks completed:** WP-CLI installed, WPForms contact form created (ID: 3750), Contact page CF7→WPForms shortcode updated, WP Mail SMTP verified, BookStack theme + navigation overrides prepared, XLSX import automation added, INTEGRATIONS.md updated with all endpoints.

**Browser tasks remaining (in order):** LLDAP user creation → n8n owner account → Umami site creation + tracking codes → Vaultwarden org/collections → FreeScout mailbox IMAP setup → WikiJS iframe rendering enable → WordPress Umami embed → Tactical RMM client setup → ERPNext setup wizard

---

### 3.1 — ERPNext

ERPNext runs at `https://ops.kecktech.net` (Traefik) or `http://YOUR_VM_IP:8080` (direct).
Default login: `Administrator` / `admin` — **change immediately**.

**Step 1 — Company setup:**
1. Login → Setup Wizard → Company Name: `Kecktech` → Country: `United States` → Currency: `USD`.
2. Fiscal year: Jan–Dec → Finish wizard.

**Step 2 — Change admin password:**
Settings → My Account → Change Password.

**Step 3 — Configure timezone and address:**
Setup → System Settings → Time Zone: `America/Chicago`.
CRM → Address → New: Kansas address for Kecktech (street, city, state, ZIP).

**Step 4 — Create Service Items:**

| Item Name | Item Code | Type | Rate | Notes |
|-----------|-----------|------|------|-------|
| Remote Support | SVCREMOTE | Service | $45.00/hr (placeholder) | Sold by hour |
| In-Home Support | SVCHOME | Service | $85.00/hr (placeholder) | Travel included |
| Peace of Mind Monthly | SVCMOM | Service | $30.00/mo (placeholder) | Recurring subscription |
| Onboarding & Setup | SVCONBOARD | Service | TBD | One-time |

Go to: Stock → Items → New Item for each.

**Step 5 — HaaS item templates:**

| Item Template | Code | Type |
|---|---|---|
| Level 1 Laptop Lease | HAAS-L1 | Fixed Asset |
| Level 2 Desktop Lease | HAAS-L2 | Fixed Asset |
| Level 3 High-Performance Laptop | HAAS-L3 | Fixed Asset |

Create as Item Templates with attributes (RAM, Storage). After purchasing specific hardware, create item variants with serial numbers using the Asset module.

**Step 6 — Asset module:**
Assets → Asset Category → New: `Leased Hardware` → depreciation method `Straight Line`.
After hardware purchase: Assets → Asset → New → link to item, serial number, client.

**Step 7 — Configure Kansas tax:**
Accounts → Tax Templates → New Sales Tax → Rate: 0% (Kansas IT services are generally not taxable; verify with CPA) or set applicable rate → Apply to all service items.

**Step 8 — Florida contractor (1099 vendor):**
Buying → Supplier → New → Name: `[Florida Contact Name]` → Supplier Type: `Individual` → Tax ID: `[1099 SSN/EIN]` → Default payment terms: `Net 30`.

**Step 9 — Stripe integration:**
Accounts → Payment Gateway → New → Provider: `Stripe` → API Key (Live): `sk_live_...` → API Key (Test): `sk_test_...` → Webhook Secret: `whsec_...`.
Create Payment Gateway Account linked to Stripe for ACH and card.

**Step 10 — Lease agreement Print Format:**
Settings → Print → Print Format → New → DocType: `Sales Order` → Name: `Lease Agreement` → Build HTML format with: client name, hardware description, monthly rate, term (36/48 months), lease-to-own option, signature line. (Requires legal review before production use.)

**Step 11 — CRM for lead intake:**
CRM → Lead Sources → Add: `WordPress Form`, `Referral`, `RMM Alert`.
CRM → Campaign → Add: `Website`, `Word of Mouth`.

---

### 3.2 — Zammad *(replaced FreeScout)*

Zammad runs at `https://tickets.kecktech.net`. Admin: `admin@kecktech.net` / `Kecktech2026!`. API token for dashboard integration stored in `docker/.env` as `ZAMMAD_API_TOKEN`. ✅ Deployed.

**Step 1 — Create `tickets@kecktech.net` mailbox in Mailcow:**
Mailcow Admin → Email → Mailboxes → Add: `tickets@kecktech.net`.

**Step 2 — Configure email channel in Zammad:**
Admin → Channels → Email → Add Account:
- Inbound: IMAP, `mail.kecktech.net`, port 993, SSL/TLS, verify SSL **off**, user `tickets@kecktech.net`
- Outbound: SMTP, `mail.kecktech.net`, port 465, SSL/TLS, verify SSL **off**, user `tickets@kecktech.net`

**Step 3 — Create groups:**
Admin → Groups → New: `MSP Support`, `HaaS`, `Senior Care`, `Internal`.

**Step 4 — Create SLA policies:**
Admin → SLAs → New SLA: MSP Support = 1hr first response / 4hr resolution.

**Step 5 — Create tech agent accounts:**
Admin → Users → New: invite staff with same emails as LLDAP users.

---

### 3.3 — Vaultwarden

Vaultwarden runs at `https://vault.kecktech.net`.

**Step 1 — Enable admin panel:**
In `docker/docker-compose.yml` under `vaultwarden`, add:
```yaml
    environment:
      - ADMIN_TOKEN=${VAULTWARDEN_ADMIN_TOKEN}
      - DOMAIN=https://vault.kecktech.net
      - SIGNUPS_ALLOWED=false
      - INVITATIONS_ALLOWED=true
      - SMTP_HOST=mail.kecktech.net
      - SMTP_FROM=admin@kecktech.net
      - SMTP_PORT=587
      - SMTP_SECURITY=starttls
      - SMTP_USERNAME=admin@kecktech.net
      - SMTP_PASSWORD=${MAILCOW_ADMIN_PASS}
```
Set `VAULTWARDEN_ADMIN_TOKEN` (generate with `openssl rand -hex 32`) in `docker/.env`.

**Step 2 — Admin setup:**
Access `https://vault.kecktech.net/admin` → login with token.
Admin → Invite users: invite your staff email(s).

**Step 3 — Create organization:**
In the Vaultwarden web app → Organizations → New Organization → `Kecktech Field Tech`.
Add staff members as members.

**Step 4 — Create collections:**
Inside the `Kecktech Field Tech` org:
- Collection: `Client Profiles` (WiFi passwords, printer models, account PINs)
- Collection: `Service Credentials` (API keys, Twilio, Stripe test keys)
- Collection: `Infrastructure` (Docker env passwords, DB passwords — internal only)

**Step 5 — Access policy:**
Assign each staff member to only the collections they need. Admin-only for `Infrastructure` collection.

---

### 3.4 — n8n

n8n runs at `https://n8n.kecktech.net`. First-run: create owner account.

**Step 1 — Initial owner account:**
Browse to `https://n8n.kecktech.net` → Create account with your admin email.

**Step 2 — Add Twilio credentials:**
Settings → Credentials → New Credential → Twilio:
- Account SID: `[fill when ready]`
- Auth Token: `[fill when ready]`
- Name: `Kecktech Twilio`

**Step 3 — Add Zammad API credentials:**
Settings → Credentials → New Credential → HTTP Header Auth:
- Name: `Zammad API`
- Header Name: `Authorization`
- Header Value: `Token token=${ZAMMAD_API_TOKEN}`

**Step 4 — Create "High-Priority Ticket → SMS" workflow:**

1. Trigger: **Webhook** node → HTTP Method: POST → Path: `zammad-ticket` → note the webhook URL.
2. IF node → Condition: `{{ $json.body.ticket.priority }}` equals `high`.
3. Twilio node → Operation: `Send SMS` → From: `[Twilio phone number]` → To: `[Florida contact number]` → Message: `Kecktech Alert: High-priority ticket #{{ $json.body.ticket.number }} - {{ $json.body.ticket.title }}`.
4. Activate workflow → configure Zammad trigger webhook in Admin → Triggers.

**Step 5 — Create "RMM Alert → Ticket" workflow:**
1. Trigger: Webhook → Path: `rmm-alert`.
2. HTTP Request node → POST to `http://zammad-railsserver:3000/api/v1/tickets` → create ticket in group `MSP Support`.

**Step 6 — Backup workflows:**
Settings → Workflows → Export all → save to `Dashboard/docs/n8n-workflows/`.

> **Templates ready for import:** `docs/n8n-workflows/high-priority-ticket-sms.json` and `docs/n8n-workflows/rmm-alert-ticket.json` are pre-built. After creating your n8n owner account, import them via Settings → Workflows → Import. See each file's `meta.notes` for setup instructions. Twilio and Stripe are deferred — configure credentials when accounts are ready.

---

### 3.5 — WordPress

> ✅ **Status:** Mostly complete. WordPress 6.9 running at `https://kecktech.net`. Astra 4.12 theme active with Spectra/Gutenberg blocks (not Elementor). All 6 pages published with custom Kecktech content.

WordPress runs at `https://kecktech.net`.

**Completed steps:**
- ~~Step 1~~ ✅ WordPress installed. Site Title: `Kecktech`, Tagline: `Friendly Tech Help for Seniors`.
- ~~Step 2~~ ✅ Astra theme installed and active (v4.12.4).
- ~~Step 3~~ ✅ Spectra (Ultimate Addons for Gutenberg) active for block-based page building. Starter Templates plugin imported agency-08 template. **No Elementor** — using Gutenberg blocks instead.
- ~~Step 4~~ ✅ All 6 pages published: Home, Services, Pricing, About, Contact, Privacy Policy.
- ~~Step 5~~ ✅ WPForms Lite active for contact/lead capture. Redundant plugins (Contact Form 7, SureForms, LatePoint, Hello Dolly, Akismet, Astra Widgets) removed.
- Step 6 ⬜ Add Umami analytics script (requires Umami site setup in Step 3.7 first).
- ~~Step 7~~ ✅ Senior-friendly design: body font bumped to 18px desktop. Open Sans body / Poppins headings. White background, high-contrast text.
- ~~Step 8~~ ✅ Permalinks set to `/%postname%/`.

**Active plugins:** Spectra (Gutenberg blocks), Starter Templates, SureRank SEO, Wordfence, WPForms Lite, WP Mail SMTP.

**Navigation menu (Header):** Home → Services → Pricing → About → Help Center (→ help.kecktech.net) → Contact.

**Remaining WordPress tasks:**
- ~~Configure WPForms notification email to `support@kecktech.net`~~ ✅ Done — WPForms contact form created (ID: 3750), notifications to `support@kecktech.net`, Contact page shortcode updated from old CF7 to WPForms.
- Add Umami embed script after Step 3.7. ⬜ (Umami default password was changed; sites must be created via browser)
- ~~Verify WP Mail SMTP is configured to use Mailcow~~ ✅ Verified — `mail.kecktech.net:587` TLS, user `admin@kecktech.net`.

---

### 3.6 — BookStack

BookStack runs at `https://help.kecktech.net`.

**Step 1 — Complete BookStack setup:**
Browse to `https://help.kecktech.net` → finish setup and ensure API token is created for migration scripts.

**Step 2 — High-contrast theme:** ✅ Applied via DB
Senior-friendly CSS injected (18px body font, 1.8 line-height, underlined links, 2.2rem h1, 1.8rem h2, 48px min button height, 16px sidebar text).

Custom CSS applied:
```css
body { font-size: 18px !important; line-height: 1.8 !important; }
.contents p, .contents li { font-size: 18px !important; line-height: 1.8 !important; }
.contents h1 { font-size: 2.2rem !important; font-weight: 700 !important; }
.contents h2 { font-size: 1.8rem !important; font-weight: 600 !important; }
.contents h3 { font-size: 1.5rem !important; font-weight: 600 !important; }
a { text-decoration: underline !important; }
.v-btn { min-height: 48px !important; font-size: 16px !important; }
```

**Step 3 — Set public read access:** ✅ Already configured
Guest group has `read:pages`, `read:assets`, `read:comments` permissions.

**Step 4 — Create content structure:** ✅ Done (7 pages created via DB)

| Section | Slug | Purpose | Status |
|---------|------|---------|--------|
| Home | `/home` | Welcome page with quick links | ✅ |
| Getting Started | `/getting-started` | What Kecktech does; how to contact us | ✅ |
| Scam Prevention | `/scam-prevention` | Common scams, red flags, what to do | ✅ |
| Understanding Your Computer | `/computer-basics` | Senior-friendly overviews | ✅ |
| Service Guide | `/service-guide` | Remote vs In-Home; what to expect | ✅ |
| What is HaaS? | `/haas` | Hardware as a Service explained simply | ✅ |
| Video Guides | `/video-guides` | Placeholder — videos to be added | ✅ |

**Step 5 — Video embedding:** ⬜ (browser)
Administration → Rendering → HTML → Allow iframes: Enable.

**Step 6 — Text-to-speech (accessibility):** ⬜ (browser)
Add note in page footer: "Use your browser's built-in read-aloud feature (Edge: right-click → Read Aloud)."

**Step 7 — Navigation:** ✅ Done (via DB)
5 items: Home, Getting Started, Scam Prevention, Computer Basics, Service Guide.

---

### 3.7 — Umami

Umami runs at `https://stats.kecktech.net`.

**Step 1 — Initial login:**
~~Browse to `https://stats.kecktech.net` → Login: `admin` / `umami` → change password~~ ✅ Password already changed from default.

**Step 2 — Add websites:**
Settings → Websites → Add Website:
- Name: `Kecktech WordPress` → Domain: `kecktech.net`
- Name: `Kecktech Knowledge Base` → Domain: `help.kecktech.net`

**Step 3 — Copy embed scripts:**
For each website, click "Get tracking code" → copy the `<script>` tag.
Add to WordPress (Step 3.5 Step 6) and BookStack (Admin → Settings → Customization → Custom HTML Head).

**Step 4 — Privacy settings:**
Settings → Websites → each site → Disable IP tracking: On → Disable data collection for bots: On.
No PII is collected by default with these settings.

---

### 3.8 — Tactical RMM

Tactical RMM runs at `https://rmm.kecktech.net`.

**Step 1 — First login:**
Browse to `https://rmm.kecktech.net` → login with superuser credentials created during install.

**Step 2 — Add Kecktech as client:**
Clients → Add Client → `Kecktech Internal`.
Add Site → `Kansas Office`.

**Step 3 — Deploy agent on test device:**
Agents → Download Agent → Select Client: `Kecktech Internal` → generate installer.
Run installer on the test Windows machine.

**Step 4 — Configure alerts:**
Alerts → Alert Templates → New Template → Name: `Critical`:
- Email alert to `admin@kecktech.net`
- (optional) Webhook to n8n (Step 3.4 Step 5) for auto-ticket creation.

**Step 5 — Script library:**
Scripts → Import → Add standard maintenance scripts (disk cleanup, Windows Update check, malware scan).

**Step 6 — Patch management:**
Automation → Patch Policies → New → Schedule: Sunday 2am → Apply to `Kecktech Internal` site.

---

### 3.9 — RustDesk

RustDesk server (hbbs ID server + hbbr relay) is already running in Docker.

**Step 1 — Retrieve server key:**
```bash
cat Dashboard/docker/data/rustdesk_data/id_ed25519.pub
```
Copy the full public key — clients will need this.

**Step 2 — Configure client for seniors ("Kecktech Help" build):**

Option A — Custom branded client (recommended for seniors):
1. Download RustDesk source and follow custom client build instructions at [https://rustdesk.com/docs/en/client/](https://rustdesk.com/docs/en/client/) to pre-configure: server IP, key, display name "Kecktech Help."
2. Deliver to senior clients pre-configured so they only need to read their 9-digit ID.

Option B — Standard client (faster to deploy):
1. Download RustDesk installer for Windows from [https://rustdesk.com](https://rustdesk.com).
2. On first launch: Settings → Network → ID Server: `YOUR_VM_IP` → Relay Server: `YOUR_VM_IP` → Key: `[public key from Step 1]` → Apply.
3. Document these steps in a senior-friendly one-page guide.

**Step 3 — Firewall rules for RustDesk:**
```bash
sudo ufw allow 21115/tcp
sudo ufw allow 21116/tcp
sudo ufw allow 21116/udp
sudo ufw allow 21117/tcp
sudo ufw allow 21118/tcp
sudo ufw allow 21119/tcp
```

**Step 4 — Test Kansas → Florida connection:**
Install RustDesk on Florida contact's device with the same server/key config.
Test a screen-share session end-to-end.

**Step 5 — Document senior access ID:**
For each senior client, record their RustDesk ID in Vaultwarden under the `Client Profiles` collection.

---

## Phase 4: Integrations & App-to-App Communication

**Goal:** All required data flows implemented and documented.

| Integration | From | To | Method | Purpose |
|-------------|------|----|--------|---------|
| Lead / ticket creation | WordPress form | Zammad | Email to `tickets@kecktech.net` (Mailcow → Zammad IMAP) | New contact form → ticket |
| High-priority ticket → SMS | Zammad | n8n → Twilio | Zammad trigger webhook → n8n webhook | Notify Florida contact |
| Payments | Client | Stripe | ERPNext Stripe integration | ACH/CC for invoices |
| RMM alerts → tickets | Tactical RMM | n8n → Zammad API | Tactical RMM webhook → n8n → `POST /api/v1/tickets` | Auto-create ticket on critical alert |
| Client context | Vaultwarden | Staff | Human process (browser) | Techs open vault for client secrets |
| Analytics | WordPress, BookStack | Umami | Embed script | Traffic, no PII |

**Implementation steps:**

1. **WordPress → Zammad (email-based):**
   WPForms notification email sends to `tickets@kecktech.net` (Mailcow) → Zammad IMAP auto-creates ticket. Test by submitting the contact form and verifying a ticket appears in Zammad.

2. **Zammad → n8n → Twilio (trigger webhook):**
   - In Zammad: Admin → Triggers → New → on ticket create, priority=high → HTTP POST to n8n webhook URL.
   - In n8n: activate the "High-Priority Ticket → SMS" workflow; note webhook URL (`https://n8n.kecktech.net/webhook/zammad-ticket`).
   - Test by creating a high-priority ticket and verifying SMS is received.

3. **ERPNext ↔ Stripe:**
   - In ERPNext: Accounts → Payment Gateway Account → Stripe → live keys.
   - Create a test invoice → Send → customer uses payment link → verify charge in Stripe dashboard.
   - Enable ACH: in Stripe dashboard, enable ACH Debit for the account.

4. **Tactical RMM → n8n → Zammad:**
   - In Tactical RMM: Alerts → Alert Templates → Webhook URL: `https://n8n.kecktech.net/webhook/rmm-alert`.
   - In n8n: activate the "RMM Alert → Ticket" workflow (POSTs to Zammad API `POST /api/v1/tickets`).
   - Test: trigger a test alert in Tactical RMM; verify ticket created in Zammad.

5. **Update INTEGRATIONS.md** with all webhook URLs, API endpoints, and env var names once working.

**Exit criteria:** Ticket → SMS works; Stripe charges work; integration matrix and runbooks updated.

---

## Phase 5: Integrated Dashboard (Next.js)

**Goal:** One URL for all apps, single login (SSO), health checks visible at a glance. Replace Heimdall with the custom Next.js dashboard.

**Technology choice: Next.js** — chosen for API route health checks, React tile components, and easy Docker deployment.

| Step | Action | Status |
|------|--------|--------|
| ~~5.1~~ ✅ | Deploy SSO (Authelia + LLDAP) | Completed in Phase 2.11–2.12. Bypass mode until Phase 5 SSO enforcement. |
| ~~5.2~~ ✅ | Scaffold Next.js dashboard | `Dashboard/dashboard/` — Next.js 15.5, TypeScript, standalone output. |
| ~~5.3~~ ✅ | Implement tiles | 12 service tiles with emoji icons, color coding, status indicators, latency display. |
| ~~5.4~~ ✅ | Health check API routes | `/api/health` route checks all 9 internal services. Page does server-side health checks on each render. |
| ~~5.5~~ ✅ | Dockerize the dashboard | Multi-stage Dockerfile (node:22-alpine). Added to `docker-compose.yml` with Traefik labels at `dashboard.kecktech.net`. 256m mem_limit. |
| ~~5.6~~ ✅ | Retire Heimdall | Heimdall removed from `docker-compose.yml` and stopped. Dashboard serves `dashboard.kecktech.net`. |

**App tiles to include:**

| Tile | URL | Health endpoint |
|------|-----|-----------------|
| ERPNext | ops.kecktech.net | `/api/method/ping` |
| Zammad | tickets.kecktech.net | `/` (200 = up) |
| Vaultwarden | vault.kecktech.net | `/alive` |
| n8n | n8n.kecktech.net | `/healthz` |
| WordPress | kecktech.net | `/` (200 = up) |
| Knowledge Base | help.kecktech.net | `/` (200 = up) |
| Umami | stats.kecktech.net | `/api/heartbeat` |
| Tactical RMM | rmm.kecktech.net | `/` (200 = up) |
| Portainer | (local port 9443) | `/api/system/status` |
| Mailcow | mail.kecktech.net | `/api/v1/get/status/containers` |

**Authelia TOTP for admin users:**
1. First login after Authelia setup: navigate to any protected subdomain.
2. Authelia will prompt to register a TOTP app (Authy, Google Authenticator).
3. Scan QR code → enter code → 2FA enrolled.
4. From then on: single login at `auth.kecktech.net` grants session access to all protected subdomains.

---

## Phase 6: HaaS & Billing Consistency

**Goal:** HaaS offerings costed correctly, reflected in ERPNext, lease terms clear.

| Step | Action |
|------|--------|
| 6.1 | Document TCO per device type | Hardware COGS, support labor ($/device/month), overhead, target margin; typical term 36–48 months. Example: Level 1 Laptop: $350 hardware + $10/mo labor + $5/mo overhead = break-even ~$10.28/mo; price at $25–30/mo for margin. |
| 6.2 | Define monthly HaaS prices | From TCO; ensure affordability and margin; align with "Peace of Mind" and hourly tiers. Lock in prices before go-live. |
| 6.3 | ERPNext: Items and templates | Generic templates created in Step 3.1 Step 5; convert to specific asset (serial) after hardware purchase. |
| 6.4 | Lease agreement | Legal-approved lease-to-own terms (consult attorney); load into ERPNext Print Format (Step 3.1 Step 10); test quote → lease → invoice flow. |
| 6.5 | Test full flow | Create a lead → convert to opportunity → quote with HAAS-L1 item → convert to Sales Order → print Lease Agreement → create recurring Sales Invoice → link Stripe payment. |

**Exit criteria:** At least one HaaS product priced, templated, and flows from quote to lease to recurring invoice in ERPNext.

---

## Phase 7: Security, Backups & Readiness for Deploy

**Goal:** Test environment secure, recoverable, and ready for production deploy. **Still no Cloudflare.**

| Step | Action | Status |
|------|--------|--------|
| ~~7.1~~ ✅ | Secrets audit | All passwords moved to `docker/.env` via `${VAR}` references (done in Phase 2.5). ERPNext DB password rotated from `123`. `.env` excluded from git via `.gitignore`. |
| ~~7.2~~ ✅ | `.env` template | `docker/.env.example` created with all variable names and section comments (done in Phase 2.5). |
| 7.3 ⬜ | Access control | Principle of least privilege in LLDAP groups; separate Vaultwarden collections for staff vs. admin; ERPNext roles for staff vs. billing only. (Requires browser — Phase 3 tasks) |
| ~~7.4~~ ✅ | Backups | `scripts/backup.sh` runs daily at 02:00 (cron). Dumps all DBs + volumes. 14-day retention. `docs/restore.md` written with full restore procedures. |
| ~~7.5~~ ✅ | Documentation | PROJECT_PLAN.md kept up to date; INTEGRATIONS.md rewritten with all endpoints; `docs/restore.md` written. |
| 7.6 ⬜ | Readiness sign-off | Full integration test after all Phase 3/4 browser tasks are complete. |

**Secrets status:** All secrets already moved to `docker/.env` (Phase 2.5). `.gitignore` updated to exclude all `.env` files, `mailcow.conf`, Authelia runtime data, and `backups/`.

**Exit criteria:** Backups verified; no secrets in code; test stack complete and signed off. Do not configure Cloudflare until Phase 8.

---

## Phase 8: Production Deploy (Cloudflare Tunnel + Tailscale) — Only When All Apps Are Ready

**Goal:** Expose public-facing apps via Cloudflare Tunnel; keep staff/internal apps accessible only over Tailscale. **Run this phase only after Phases 1–7 are complete and the test environment is verified.**

### Access model in production

| Audience | Apps | Access path |
|----------|------|-------------|
| **Public** (clients, leads) | kecktech.net, help.kecktech.net | Cloudflare Tunnel → Traefik |
| **Staff / admin** (you, Florida contact) | All internal apps (dashboard, ERPNext, Zammad, n8n, Vaultwarden, Umami, Tactical RMM, Portainer) | Tailscale → Traefik (no Cloudflare needed for these) |
| **Clients submitting tickets** | tickets.kecktech.net (Zammad) | Cloudflare Tunnel → Traefik |

This hybrid approach means internal admin tools **never need to be exposed to the public internet** — they stay Tailscale-only, which is a stronger security posture than Cloudflare Tunnel alone.

| Step | Action | Details |
|------|--------|---------|
| 8.1 | Prerequisites | Domain **kecktech.net** and DNS managed by Cloudflare; Cloudflare account with Tunnel enabled. |
| 8.2 | Install cloudflared | `curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared.deb` |
| 8.3 | Authenticate and create tunnel | `cloudflared tunnel login` → `cloudflared tunnel create kecktech-tunnel` → note tunnel ID. |
| 8.4 | Configure tunnel ingress (public apps only) | Create `~/.cloudflared/config.yml` mapping only public subdomains to Traefik. Internal apps (ops, vault, n8n, stats, dashboard, rmm, traefik, auth) are **not** added to Cloudflare — they remain Tailscale-only. |
| 8.5 | Install as system service | `sudo cloudflared service install` → `sudo systemctl start cloudflared`. |
| 8.6 | Map subdomains in Cloudflare (public only) | DNS → Add CNAME for `kecktech.net`, `help.kecktech.net`, `tickets.kecktech.net` → `<tunnel-id>.cfargotunnel.com`. Internal subdomains: leave as `/etc/hosts` on Tailscale devices. |
| 8.7 | Firewall lockdown | `sudo ufw delete allow 80/tcp` and `sudo ufw delete allow 443/tcp` — inbound web traffic flows only through Cloudflare Tunnel (public) or Tailscale (internal); zero open inbound ports. Keep RustDesk ports (21115–21119) and Tailscale (via kernel WireGuard, no extra port). |
| 8.8 | Update SITE_URL env vars | Update Mailcow, ERPNext, Zammad `SITE_URL` from `http://IP:port` to `https://subdomain.kecktech.net`. |
| 8.9 | Update Florida contact Tailscale | Ensure Florida contact's device is joined to the workspace; update their `/etc/hosts` with the VM Tailscale IP for all internal subdomains. |
| 8.10 | Verify and go-live | Confirm public subdomains resolve via Cloudflare; confirm internal subdomains reachable over Tailscale; test all integrations; monitor Umami and tickets. |
| 8.11 | Mailcow DNS (production) | Add SPF, DKIM, DMARC, and MX records in Cloudflare DNS for `kecktech.net` pointing to `mail.kecktech.net`. Enable port 25 if not blocked, or configure SMTP relay for outbound. |

**Cloudflare Tunnel ingress config (`~/.cloudflared/config.yml`) — public apps only:**

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /root/.cloudflared/<YOUR_TUNNEL_ID>.json

ingress:
  - hostname: kecktech.net
    service: https://localhost:443
    originRequest:
      noTLSVerify: true
  - hostname: help.kecktech.net
    service: https://localhost:443
    originRequest:
      noTLSVerify: true
  - hostname: tickets.kecktech.net
    service: https://localhost:443
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

**Exit criteria:** Public subdomains reachable via Cloudflare Tunnel; internal apps reachable only over Tailscale; zero open inbound ports; all email flowing; Florida contact access verified.

---

## App-to-App Communication Matrix (Reference)

| Source | Target | Data / Trigger | Implementation |
|--------|--------|----------------|-----------------|
| WordPress contact form | Zammad | Lead / contact email | Email → Mailcow → Zammad IMAP (tickets@kecktech.net) |
| Zammad | n8n | New / high-priority ticket | Zammad trigger webhook → n8n |
| n8n | Twilio | SMS body + Florida number | n8n Twilio node |
| ERPNext | Stripe | Invoice payment | ERPNext Payment Gateway |
| Tactical RMM | n8n → Zammad | Critical alert | Tactical RMM webhook → n8n → Zammad API |
| Umami | — | Page views (no PII) | Embed on WordPress + BookStack |
| Authelia | LLDAP | User auth queries | LDAP bind |
| Traefik | Authelia | Forward-auth middleware | ForwardAuth |

## Network Access Model (Reference)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Public ingress** | Cloudflare Tunnel | `kecktech.net`, `help.kecktech.net`, `tickets.kecktech.net` only |
| **Staff / admin access** | Tailscale mesh | All internal apps; Florida contact; no open inbound ports required |
| **Container routing** | Traefik (Docker) | Routes all hostnames to correct containers; same config for test and production |
| **SSH / remote shell** | Tailscale SSH | Key-free SSH to VM from any enrolled device; locked to Tailscale interface |
| **RustDesk sessions** | RustDesk server (hbbs/hbbr) | Senior screen-share; server runs on VM; direct TCP/UDP ports open |

---

## File & Repo Structure

```
Dashboard/   (project root; run ./startup-all on Linux or startup-all.bat on Windows)
├── .cursor/
│   └── rules/
│       └── kecktech-stack.mdc
├── PROJECT_PLAN.md          (this file)
├── business_launch.md       (5-step launch + Kecktech Implementation summary)
├── INTEGRATIONS.md          (API endpoints, webhooks, env vars)
├── startup-all              (Linux: start main stack + Mailcow + Tactical + ERPNext)
├── startup-all.bat          (Windows: same as startup-all)
├── shutdown-all.bat         (Windows: stop all stacks in reverse order; volumes/data preserved)
├── startup-erpnext.sh       (ERPNext-specific startup)
│
├── docker/                  (main app stack)
│   ├── docker-compose.yml   (Traefik, FreeScout, WordPress, BookStack, Vaultwarden,
│   │                         Umami, Portainer, RustDesk, n8n, LLDAP, Authelia,
│   │                         custom dashboard)
│   ├── .env                 (secrets — gitignored)
│   ├── .env.example         (variable names only — committed)
│   ├── traefik/
│   │   ├── traefik.yml      (static config)
│   │   └── dynamic/         (file-based dynamic routes: tls.yml, mailcow.yml, tactical.yml)
│   ├── authelia/
│   │   └── configuration.yml
│   ├── data/                (bind-mounted data: heimdall, rustdesk_data, wp_data, db_data)
│   └── README.md
│
├── mailcow/                 (Mailcow self-hosted mail; own compose stack)
│   ├── docker-compose.yml
│   └── mailcow.conf
│
├── dashboard/               (Next.js custom dashboard app)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx     (main dashboard tiles)
│       │   └── api/health/  (health check API routes)
│       └── components/
│           └── AppTile.tsx
│
├── erpnext/
│   └── frappe_docker/       (ERPNext; own compose.yaml)
│
├── scripts/
│   ├── backup.sh          (daily DB + volume backup; cron 02:00)
│   ├── ssh-harden.sh      (Phase 1.8 UFW + SSH lockdown; run with sudo)
│   └── verify-and-logs.sh
│
└── docs/                    (runbooks)
    ├── restore.md
    ├── RUSTDESK-ACCESS.md
    ├── TROUBLESHOOTING.md
    └── n8n-workflows/       (importable n8n workflow JSON files)
        ├── high-priority-ticket-sms.json
        └── rmm-alert-ticket.json
```

---

## Success Criteria

**Test environment (Phases 1–7):**

- [ ] All applications run in Docker on this VM and are reachable via Traefik (test hostnames via /etc/hosts). **Cloudflare not required.**
- [ ] ERPNext: CRM, HaaS templates, Stripe, Kansas/Florida and 1099 configured.
- [ ] Zammad: `tickets@kecktech.net` email channel configured; ticket flow; high-priority tickets trigger SMS via n8n.
- [ ] WordPress: Services, About, lead capture form; Umami tracking embedded.
- [ ] Knowledge base (BookStack): Senior-friendly, high-contrast, API-imported content, public read.
- [ ] SSO: Single login (Authelia + LLDAP) for all internal apps; TOTP enrolled.
- [ ] Integrated dashboard: Next.js at `dashboard.kecktech.net` with tiles and health checks.
- [ ] App-to-app flows documented and working (ticket→SMS, payments, RMM→ticket).
- [ ] Backups and restore tested; no secrets in repo; all passwords moved to `.env`.
- [ ] HaaS pricing and lease flow defined and working for at least one product.
- [ ] Mailcow: `support@kecktech.net` and `admin@kecktech.net` operational.
- [ ] Tactical RMM: At least one agent enrolled; alert → ticket flow tested.
- [ ] RustDesk: Server key documented; Kansas → Florida test session successful.
- [ ] Vaultwarden: `Kecktech Field Tech` org with `Client Profiles` collection populated.

**Production (Phase 8 — only after test is complete):**

- [ ] Cloudflare Tunnel configured for public apps (`kecktech.net`, `help.kecktech.net`, `tickets.kecktech.net`); zero open inbound web ports.
- [ ] Internal apps (dashboard, ERPNext, n8n, Vaultwarden, Umami, Tactical RMM) accessible only over Tailscale — confirmed not reachable without Tailscale.
- [ ] Florida contact's device enrolled in Tailscale workspace; access to staff apps verified.
- [ ] Mailcow MX/SPF/DKIM/DMARC DNS records live; email deliverability tested.

---

*End of PROJECT_PLAN.md. Update this document when you add phases, change tools, or complete steps.*
