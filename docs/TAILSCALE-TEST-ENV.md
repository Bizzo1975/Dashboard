# Private test environment (development)

Use this model **until Phase 8** (public Cloudflare Tunnel). Do not rely on public DNS or Cloudflare Tunnel for `*.kecktech.net` while developing.

## Goals

- **No public exposure** required for HTTPS hostnames (no port forwarding needed for local dev).
- **Same hostnames as production** so Traefik routers and app configs match prod.
- Browsers must send the correct **`Host:`** header (`dashboard.kecktech.net`, etc.). Using only `https://127.0.0.1` does **not** work for name-based routing — you need **hosts → loopback or Tailscale IP**.

---

## A) Same computer as Docker (most common on Windows)

You run **Docker Desktop** (or Docker Engine) **on the same PC** where you edit code and use the browser.

1. **Publish ports** — Traefik in `docker/docker-compose.yml` maps **`80:80`** and **`443:443`** to the host. If the stack is up, your PC is listening on **localhost** for HTTP/HTTPS.

2. **Hosts file** — Point every Kecktech hostname at **loopback** so the browser connects to Traefik on this machine **and** sends the right `Host` header.

   **Windows** (open Notepad **as Administrator**):  
   `C:\Windows\System32\drivers\etc\hosts`

   Add (one line or split; `#` starts a comment):

   ```text
   127.0.0.1  kecktech.net www.kecktech.net
   127.0.0.1  dashboard.kecktech.net traefik.kecktech.net auth.kecktech.net
   127.0.0.1  lldap.kecktech.net helpdesk.kecktech.net vault.kecktech.net n8n.kecktech.net
   127.0.0.1  help.kecktech.net stats.kecktech.net
   127.0.0.1  rmm.kecktech.net api.kecktech.net mesh.kecktech.net
   127.0.0.1  ops.kecktech.net mail.kecktech.net
   ```

   **Linux / macOS** (same lines in `/etc/hosts`; may need `sudo`).

3. **Save hosts**, then **flush DNS** (Windows):

   ```powershell
   ipconfig /flushdns
   ```

4. Open **`https://dashboard.kecktech.net`**, **`https://www.kecktech.net`**, etc. Traffic stays on **this PC**; nothing is exposed to the internet unless your router forwards 80/443 (not required for this setup).

5. **Portainer** (if enabled): often `https://127.0.0.1:9443` — no hosts entry needed for that URL.

6. **Also test from other devices** (phone on Tailscale, second PC): use **section B** with this machine’s **Tailscale IP** instead of `127.0.0.1`, and ensure Tailscale is running on the Docker host.

---

## B) Docker on another machine (VM or NAS) — Tailscale

When the stack runs on a **Linux VM** (or another host) and your **browser is elsewhere**:

1. Join the **VM** to Tailscale; note **`tailscale ip -4`** (e.g. `100.x.y.z`).
2. Join your **laptop** to the same tailnet.
3. On **every machine** that opens the apps, put the **same hostname list** in hosts, but use **`100.x.y.z`** instead of `127.0.0.1`:

   ```text
   100.x.y.z  kecktech.net www.kecktech.net
   100.x.y.z  dashboard.kecktech.net traefik.kecktech.net auth.kecktech.net
   100.x.y.z  lldap.kecktech.net helpdesk.kecktech.net vault.kecktech.net n8n.kecktech.net
   100.x.y.z  help.kecktech.net stats.kecktech.net
   100.x.y.z  rmm.kecktech.net api.kecktech.net mesh.kecktech.net
   100.x.y.z  ops.kecktech.net mail.kecktech.net
   ```

4. No router port-forward required; traffic goes **inside Tailscale** to the VM.

---

## Browser “Secure DNS” / DoH

If the browser uses **DNS-over-HTTPS**, it may **ignore** `hosts` and you still hit **Cloudflare** (e.g. tunnel error 1033).

For development: turn **off** “Use secure DNS” (Chrome: **Settings → Privacy and security → Security**), or use a test browser profile without DoH.

---

## Cloudflare (during development)

Do not depend on **Cloudflare Tunnel** or **orange-cloud** DNS for local dev. Use **hosts** (loopback or Tailscale IP) until Phase 8. See **`PROJECT_PLAN.md`**.

---

## TLS / certificate warnings

See **`docs/HTTPS-TEST-ENV.md`** (mkcert on Windows + `scripts/setup-mkcert-traefik.ps1`).

---

## Verify

**Same PC as Docker** (`127.0.0.1` in hosts):

```powershell
ping www.kecktech.net
# Should reply from 127.0.0.1

curl.exe -skI https://www.kecktech.net/
# Should show Server: Apache or Traefik — not a Cloudflare error page
```

**Remote VM** (Tailscale IP in hosts): `ping` should show `100.x.y.z`.

---

## Related

- `docs/HTTPS-TEST-ENV.md` — trusted HTTPS for `*.kecktech.net`
- `.cursor/rules/kecktech-stack.mdc` — stack conventions
- `PROJECT_PLAN.md` — Phase 8 (public Cloudflare) when ready
