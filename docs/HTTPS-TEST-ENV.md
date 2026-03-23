# HTTPS certificate warnings (Traefik / `*.kecktech.net`)

## Why every site shows a warning

Traefik is terminating TLS on **:443** with **`tls: true`** on each router, but this repo does **not** ship Let’s Encrypt (ACME) or custom PEM files in git. Traefik therefore presents its **default certificate**, which browsers do not trust → **“Your connection is not private”** / **NET::ERR_CERT_AUTHORITY_INVALID** for `https://kecktech.net`, `https://dashboard.kecktech.net`, etc.

That is **expected** in a private / hosts-file test setup until you add **trusted** certificates.

## Options (pick one)

### A) **mkcert** (recommended for Windows dev + same hostnames)

**Automated (repo script):**

1. Install [mkcert](https://github.com/FiloSottile/mkcert) and run **`mkcert -install`** once (trusts the local CA in Windows).
2. From the **Dashboard** repo root:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\setup-mkcert-traefik.ps1
   ```

   This writes **`docker/traefik/certs-local/kecktech.pem`** + **`kecktech-key.pem`** (gitignored) and **`docker/traefik/dynamic/tls-mkcert.yml`** (gitignored) so Traefik serves a trusted cert for `kecktech.net` and `*.kecktech.net`.

3. Restart Traefik:

   ```powershell
   cd docker
   docker compose up -d traefik
   ```

4. Reload `https://kecktech.net` (or any `*.kecktech.net` app) — the warning should be gone.

**Manual:** See `docker/traefik/dynamic/tls-mkcert.yml.example` and mount `docker/traefik/certs-local` (already in `docker-compose.yml`).

### B) **Let’s Encrypt** (production / when DNS + HTTP-01 or DNS-01 are ready)

Configure Traefik’s **certificatesResolvers** (HTTP challenge or DNS challenge). This matches eventual production (see `PROJECT_PLAN.md` Phase 8). Not required for pure Tailscale/hosts testing if you use mkcert.

### C) **Accept the warning** (not recommended)

Only for quick checks; do not train users to click through warnings.

## Related

- **Private dev** (same PC: `127.0.0.1` in hosts; remote VM: Tailscale IP): **`docs/TAILSCALE-TEST-ENV.md`**.
- Hosts / Tailscale testing: point `kecktech.net` and subdomains at the machine running Docker (see `PROJECT_PLAN.md`).
- Mailcow and other stacks may have **separate** TLS assets; this doc is about **Traefik front door** to the main compose apps.
