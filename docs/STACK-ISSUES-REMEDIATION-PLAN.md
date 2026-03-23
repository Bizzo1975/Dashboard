# Remediation plan — Authelia, ERPNext, Tactical, dashboard logo, WordPress header logo

This document tracks the issues you reported, root causes, and the order in which to fix or verify them.

## 1. Authelia — `https://auth.kecktech.net` 404 and dashboard “offline”

**Symptoms:** Portal 404; dashboard tile shows down.

**Likely causes:**

1. **Traefik omits routers for unhealthy containers** (Docker provider). If Authelia fails its health probe or never becomes healthy, no route is published for `auth.kecktech.net` → Traefik’s default **404**.
2. **Application not ready:** LDAP (`lldap`) unreachable, bad secrets in `docker/.env`, or Authelia config errors → container restarting or stuck.
3. **Dashboard probe:** `http://authelia:9091/api/health` should return **2xx** when Authelia is up; if the service is down, the tile correctly shows offline.

**Actions (in order):**

| Step | Action |
|------|--------|
| A | Ensure `lldap` is healthy before Authelia (`depends_on` is present; confirm both are on `kecktech_front`). |
| B | Add an explicit **healthcheck** on the `authelia` service (HTTP GET `/api/health`) so Docker reports healthy only when the API answers; avoids Traefik registering a broken router. |
| C | After deploy: `docker compose logs authelia --tail=80` and fix any LDAP/SMTP/config errors. |
| D | Confirm Traefik access log shows a **named router** for `auth.kecktech.net` (not `-` / empty). |

**Code/repo:** `docker/docker-compose.yml` — Authelia `healthcheck` added.

---

## 2. ERPNext — “Not Found: localhost does not exist” and dashboard offline

**Symptoms:** Browser shows Frappe “localhost does not exist”; dashboard ERPNext tile down.

**Root cause:** `startup-all` / `startup-erpnext.sh` load `overrides/compose.site-localhost.yaml`, which sets `FRAPPE_SITE_NAME_HEADER: localhost`. The frontend nginx and `X-Frappe-Site-Name` then expect a **site folder named `localhost`** under `sites/`. If your bench site is named something else (e.g. `frontend` or `ops.kecktech.net`), Frappe returns **localhost does not exist**.

**Actions:**

| Step | Action |
|------|--------|
| A | **Override** `FRAPPE_SITE_NAME_HEADER` in `overrides/compose.kecktech-traefik.yaml` so it matches your real site name. Default in repo: **`ops.kecktech.net`** to align with Traefik `Host(\`ops.kecktech.net\`)`. |
| B | **Create or rename** the Frappe site to match: e.g. `bench new-site ops.kecktech.net` (new) or migrate/rename an existing site — see [Frappe site documentation](https://frappeframework.com/docs). |
| C | If you must keep a site named `frontend`, set in `erpnext/frappe_docker/.env`: `FRAPPE_SITE_NAME_HEADER=frontend` and adjust Traefik host + DNS to match your chosen hostname strategy (advanced). |
| D | Dashboard health: internal ping must send **`Host: ops.kecktech.net`** (or your site name) so nginx matches `server_name`. |

**Code/repo:** `compose.kecktech-traefik.yaml` — `environment.FRAPPE_SITE_NAME_HEADER`; `dashboard/src/app/page.tsx` — `healthHost` for ERPNext.

---

## 3. Tactical RMM — tile offline but browser login works

**Symptoms:** `https://rmm.kecktech.net` loads; dashboard shows offline.

**Root cause:** The tile used **`https://trmm-nginx:4443/`** from inside the **dashboard** container. Node’s `fetch` validates TLS against the **self-signed** cert on TRMM nginx → handshake/verification **fails** → caught as down. Traefik already uses `serversTransport` with `insecureSkipVerify` for backends; in-cluster checks do not.

**Actions:**

| Step | Action |
|------|--------|
| A | Probe **HTTP** on the internal nginx port (**8080**) instead: `http://trmm-nginx:8080/` (same container as 4443, no TLS). |

**Code/repo:** `dashboard/src/app/page.tsx` — Tactical `healthUrl`.

---

## 4. Dashboard — enlarge header logo

**Action:** Increase logo `height` / `maxWidth` in `dashboard/src/app/page.tsx` so the mark fills the header bar more cleanly without overlapping the title row.

**Code/repo:** `dashboard/src/app/page.tsx`.

---

## 5. WordPress — oversized navy “logo” block (no graphic)

**Symptoms:** Large solid dark blue square where the logo should be; tagline tight underneath.

**Likely causes:**

1. **Custom logo attachment is 1024×1024** (square). Themes such as **Astra** often output width/height attributes; without CSS caps, the logo area **dominates the header**.
2. **Broken or blocked image URL** (mixed content, wrong host) → browser shows empty image box; theme / block may still reserve space or show a **fallback background**.
3. **Site Logo block** (Gutenberg/Spectra) may need the same **max-height** rules as `custom_logo`.

**Actions:**

| Step | Action |
|------|--------|
| A | Add **global header CSS** (must-use plugin) to cap `.custom-logo`, `.wp-block-site-logo img`, and common Astra selectors: `max-height`, `width: auto`, `object-fit: contain`, transparent background on the image. |
| B | In WP admin: **Media** — open the logo file; confirm URL opens over **HTTPS** on `kecktech.net`. |
| C | Optional: replace the file with a **wide** logo asset (e.g. ~800×200) and re-run `scripts/apply-logo-transparency.py` or upload manually; reduces reliance on CSS alone. |
| D | If using a header builder block, clear cached CSS and re-save the header template. |

**Code/repo:** `docker/wordpress/mu-plugins/kecktech-logo.php` — `wp_head` inline styles.

---

## Execution checklist (after code merge)

1. Rebuild dashboard image: `cd docker` → `docker compose build dashboard` → `docker compose up -d dashboard`.
2. Recreate Authelia (pick up healthcheck): `docker compose up -d authelia` (or full stack).
3. Recreate ERPNext frontend (pick up `FRAPPE_SITE_NAME_HEADER`): from `erpnext/frappe_docker`, same compose files as `startup-all.bat`, then `docker compose ... up -d` (or restart ERPNext stack).
4. **Verify Frappe site name** exists and matches `FRAPPE_SITE_NAME_HEADER`.
5. Restart WordPress (or visit site once) so MU-plugin CSS loads.
6. Confirm tiles: Authelia, ERPNext, Tactical; confirm WordPress header visually.

---

## Reference — quick diagnostics

```text
# Authelia
docker compose logs authelia --tail=100

# ERPNext site list (adjust container name if different)
docker compose exec backend bench list-apps
docker compose exec backend ls sites

# Tactical nginx from dashboard network
docker compose exec dashboard wget -qO- http://trmm-nginx:8080/ | head
```
