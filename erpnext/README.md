# ERPNext (Frappe Docker)

Start from Dashboard root: `../startup-erpnext.sh` or `./startup-all`.

## First-time setup

1. Start the stack, then wait for configurator and backend to be ready (about 1–2 minutes).
2. Create a site (one-time). From `frappe_docker/` run (use the same password as in `.env`, here `123`):
   ```bash
   cd frappe_docker
   docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.noproxy.yaml exec backend bench new-site --mariadb-user-host-login-scope=% --db-root-password 123 --admin-password admin --install-app erpnext --set-default localhost
   ```
   Use site name `localhost` if you open http://localhost:8080, or your hostname/IP if you use that in the browser.
3. Open http://localhost:8080 (or your VM IP:8080). Login: Administrator / admin.

## Port and 404 fix

- **8080** – frontend. If you get **404** when opening http://IP:8080, the frontend was matching the Host header to the site name. The override `compose.site-localhost.yaml` sets `FRAPPE_SITE_NAME_HEADER=localhost` so the site "localhost" is served for any Host. **Restart the stack** so the frontend picks it up:
  ```bash
  cd /home/vboxuser/Dashboard && ./startup-erpnext.sh
  ```
  Then open http://100.73.237.44:8080 or http://localhost:8080 (login: Administrator / admin).
