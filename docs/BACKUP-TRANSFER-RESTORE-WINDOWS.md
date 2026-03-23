# Backup on the server, transfer to Windows, restore locally

## Why the AI in chat “can’t access the server” but Cursor “could run a backup”

- **Cursor’s terminal runs on your PC** with **your network** (Tailscale, SSH keys, etc.). When you run `ssh` or `scp` there, it uses **your** connection.
- **This chat assistant** runs in an isolated environment: it **cannot** open SSH to `100.73.237.44` or use passwords you typed in chat. It **can** edit files in your repo and give you **exact commands** to paste into **your** terminal (same as the other project—you ran those commands locally).

So: **you** run backup/transfer on the VM or from Windows; use this doc as the checklist.

---

## Part A — On the Linux server (VM): run a full backup

### A1. Paths

The cron job in the repo assumes:

- Dashboard: `/home/vboxuser/Dashboard`  
If your user or path differs, `cd` to wherever **`docker/docker-compose.yml`** lives.

### A2. One command (recommended)

Stack must be **running** so DB containers exist.

```bash
cd /home/vboxuser/Dashboard
chmod +x scripts/backup.sh
bash scripts/backup.sh
```

Output goes to:

`/home/vboxuser/Dashboard/backups/YYYY-MM-DD/`

### A3. What gets created (same as nightly cron)

| File | What it is |
|------|------------|
| `freescout-db.sql.gz` | FreeScout MariaDB |
| `wordpress-db.sql.gz` | WordPress MariaDB (`wpdb`) |
| `wikijs-db.sql.gz` | WikiJS PostgreSQL |
| `umami-db.sql.gz` | Umami PostgreSQL |
| `erpnext-db.sql.gz` | ERPNext MariaDB (all DBs), if container `frappe_docker-db-1` is up |
| `mailcow-db.sql.gz` | Mailcow MariaDB, if Mailcow is configured |
| `vaultwarden-data.tar.gz` | Vaultwarden volume |
| `n8n-data.tar.gz` | n8n volume |
| `lldap-data.tar.gz` | LLDAP volume |
| `freescout-data.tar.gz` | FreeScout app data volume |
| `authelia-config/` | Authelia config copy |
| `docker-compose.yml.bak` | Compose snapshot |
| `erpnext-env.bak` | ERPNext `.env` snapshot |

If something fails, read `/home/vboxuser/Dashboard/backups/backup.log`.

### A4. Manual WordPress-only dump (if you only need WP)

```bash
cd /home/vboxuser/Dashboard/docker
set -a && source .env && set +a
docker compose exec wp-db mysqldump -uwpuser -p"${WP_DB_PASS}" --single-transaction wpdb | gzip > /tmp/wordpress-db.sql.gz
ls -lh /tmp/wordpress-db.sql.gz
```

Copy `/tmp/wordpress-db.sql.gz` off the server in Part B.

---

## Part B — Transfer backup folder from server to Windows PC

**Network:** Use the **Tailscale** path only (VM Tailscale IP, e.g. `100.73.237.44`, or MagicDNS name such as `kecktech-1`). Do not rely on port-forwarded public SSH unless you intentionally expose it.

Pick **one** method.

### B1. SCP over Tailscale (Windows 11 — OpenSSH Client)

In **PowerShell** on the **Windows** machine (replace `DATE`; host is the VM’s **Tailscale IP or name**):

```powershell
$DATE = "2026-03-19"
New-Item -ItemType Directory -Force -Path "F:\Github\Dashboard\backups\$DATE" | Out-Null
scp -r "vboxuser@100.73.237.44:/home/vboxuser/Dashboard/backups/$DATE/*" "F:\Github\Dashboard\backups\$DATE\"
```

- First time: confirm host key.  
- Uses **SSH key** if configured; otherwise password prompt.

### B2. SCP single file (WordPress only)

```powershell
scp "vboxuser@100.73.237.44:/home/vboxuser/Dashboard/backups/2026-03-19/wordpress-db.sql.gz" "F:\Github\Dashboard\backups\"
```

### B3. Tar on server, one file to copy (large folders)

**On the server:**

```bash
cd /home/vboxuser/Dashboard/backups
tar czf /tmp/kecktech-backup-2026-03-19.tar.gz 2026-03-19
```

**On Windows:**

```powershell
scp "vboxuser@100.73.237.44:/tmp/kecktech-backup-2026-03-19.tar.gz" "F:\Github\Dashboard\backups\"
```

Extract with 7-Zip or:

```powershell
tar -xzf "F:\Github\Dashboard\backups\kecktech-backup-2026-03-19.tar.gz" -C "F:\Github\Dashboard\backups"
```

---

## Part C — Restore on Windows (Docker Desktop)

**Prerequisites:** `docker/.env` matches passwords the dumps expect (same as production, or adjust). Networks `kecktech_front` / `kecktech_internal` exist. Stack can be started with `startup-all.bat`.

Set the backup folder (adjust date):

```powershell
$BACKUP = "F:\Github\Dashboard\backups\2026-03-19"
cd F:\Github\Dashboard\docker
```

Load passwords into your shell from `docker\.env` (or read values manually and paste—do not commit secrets):

```powershell
Get-Content F:\Github\Dashboard\docker\.env | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim().Trim('"') }
}
```

### C1. WordPress

**Script (easiest):**

```powershell
cd F:\Github\Dashboard
powershell -ExecutionPolicy Bypass -File .\scripts\restore-wordpress-from-backup.ps1 `
  -BackupFile "$BACKUP\wordpress-db.sql.gz" `
  -FixKecktechUrls
```

**Manual:**

```powershell
cd F:\Github\Dashboard\docker
docker compose stop wordpress
docker compose exec wp-db mysql -uroot -p"$env:WP_DB_ROOT_PASS" -e "DROP DATABASE IF EXISTS wpdb; CREATE DATABASE wpdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; GRANT ALL ON wpdb.* TO 'wpuser'@'%'; FLUSH PRIVILEGES;"
docker run --rm -v "${BACKUP}:/backup:ro" alpine:3.20 sh -c "gunzip -c /backup/wordpress-db.sql.gz" | docker exec -i wp-db mysql -uwpuser -p"$env:WP_DB_PASS" wpdb
docker compose up -d wordpress
```

Also copy **`wp_data`** from the server if the **files** (uploads/themes) differ:  
`rsync`/`scp` of `/home/vboxuser/Dashboard/docker/data/wp_data` → `F:\Github\Dashboard\docker\data\wp_data` (with stack stopped).

### C2. FreeScout

```powershell
cd F:\Github\Dashboard\docker
docker compose stop freescout
docker compose up -d freescout-db
docker compose exec freescout-db healthcheck.sh --connect --innodb_initialized
docker run --rm -v "${BACKUP}:/backup:ro" alpine:3.20 sh -c "gunzip -c /backup/freescout-db.sql.gz" | docker exec -i freescout-db mysql -ufreescout -p"$env:FREESCOUT_DB_PASS" freescout
docker compose up -d freescout
```

### C3. WikiJS (PostgreSQL)

```powershell
cd F:\Github\Dashboard\docker
docker compose stop wikijs
docker compose up -d wikijs-db
docker exec wikijs-db psql -U wikijs -c "DROP DATABASE IF EXISTS wikijs;"
docker exec wikijs-db psql -U wikijs -c "CREATE DATABASE wikijs OWNER wikijs;"
docker run --rm -v "${BACKUP}:/backup:ro" alpine:3.20 sh -c "gunzip -c /backup/wikijs-db.sql.gz" | docker exec -i wikijs-db psql -U wikijs wikijs
docker compose up -d wikijs
```

### C4. Umami (PostgreSQL)

```powershell
cd F:\Github\Dashboard\docker
docker compose stop umami
docker compose up -d umami-db
docker exec umami-db psql -U umami -c "DROP DATABASE IF EXISTS umami;"
docker exec umami-db psql -U umami -c "CREATE DATABASE umami OWNER umami;"
docker run --rm -v "${BACKUP}:/backup:ro" alpine:3.20 sh -c "gunzip -c /backup/umami-db.sql.gz" | docker exec -i umami-db psql -U umami umami
docker compose up -d umami
```

### C5. ERPNext

```powershell
cd F:\Github\Dashboard\erpnext\frappe_docker
# DB_PASSWORD from erpnext\frappe_docker\.env
docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.site-localhost.yaml -f overrides/compose.kecktech-traefik.yaml up -d db
Start-Sleep -Seconds 15
docker run --rm -v "${BACKUP}:/backup:ro" alpine:3.20 sh -c "gunzip -c /backup/erpnext-db.sql.gz" | docker exec -i frappe_docker-db-1 mysql -uroot -p"YOUR_ERPNEXT_DB_PASSWORD_FROM_ENV"
cd F:\Github\Dashboard
.\startup-all.bat
```

Replace `YOUR_ERPNEXT_DB_PASSWORD_FROM_ENV` with the real `DB_PASSWORD` from `erpnext\frappe_docker\.env`.

### C6. Mailcow

```powershell
cd F:\Github\Dashboard\mailcow
# DBROOT from mailcow\mailcow.conf
docker compose up -d mysql-mailcow
Start-Sleep -Seconds 15
docker run --rm -v "${BACKUP}:/backup:ro" alpine:3.20 sh -c "gunzip -c /backup/mailcow-db.sql.gz" | docker exec -i mailcowdockerized-mysql-mailcow-1 mysql -uroot -p"YOUR_DBROOT_FROM_MAILCOW_CONF" mailcow
docker compose up -d
```

### C7. Named volumes (Vaultwarden, n8n, LLDAP, FreeScout data)

Stop the app, extract tarball into the **named volume** (names must match `docker volume ls` — often `vboxuser_*`):

```powershell
cd F:\Github\Dashboard\docker
docker compose stop vaultwarden
docker run --rm -v vboxuser_vaultwarden_data:/data -v "${BACKUP}:/backup:ro" alpine:3.20 sh -c "rm -rf /data/* && tar xzf /backup/vaultwarden-data.tar.gz -C /data"
docker compose up -d vaultwarden
```

Repeat with `n8n`, `lldap`, `freescout` and matching `.tar.gz` names (see [restore.md](restore.md)).

### C8. Authelia

Stop Authelia, copy `authelia-config\*` over `docker\authelia\` (merge/replace), start Authelia.

---

## Part D — Order of operations for a “full” migration

1. On **server**: `bash scripts/backup.sh`  
2. On **Windows**: `scp -r` the dated folder into `F:\Github\Dashboard\backups\YYYY-MM-DD\`  
3. On **Windows**: Ensure `docker\.env`, `tactical\.env`, `erpnext\frappe_docker\.env`, `mailcow\mailcow.conf` match production secrets.  
4. Start DB containers (or `startup-all.bat`), then restore **MariaDB** dumps, then **Postgres**, then **volumes**, then **Authelia**.  
5. Copy **`docker\data\wp_data`** (and any other bind-mounted `data\` trees) if you need file-level parity with the server.  
6. `docker compose ps` / hit URLs with `hosts` pointing at this PC.

---

## Reference

- Backup implementation: [scripts/backup.sh](../scripts/backup.sh)  
- Linux-focused restore: [restore.md](restore.md)  
- WordPress-only on Windows: [WORDPRESS-RESTORE-WINDOWS.md](WORDPRESS-RESTORE-WINDOWS.md)
