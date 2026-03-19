# Kecktech Stack — Restore Procedures

Backups are stored in `Dashboard/backups/YYYY-MM-DD/` by the daily cron job (`scripts/backup.sh` at 02:00). Each backup contains DB dumps, named volume tarballs, and config file copies. Retention: 14 days.

## Backup Contents

| File | Source | Format |
|------|--------|--------|
| `freescout-db.sql.gz` | FreeScout MariaDB | mysqldump, gzipped |
| `wordpress-db.sql.gz` | WordPress MariaDB | mysqldump, gzipped |
| `wikijs-db.sql.gz` | WikiJS PostgreSQL | pg_dump, gzipped |
| `umami-db.sql.gz` | Umami PostgreSQL | pg_dump, gzipped |
| `erpnext-db.sql.gz` | ERPNext MariaDB (all DBs) | mysqldump, gzipped |
| `mailcow-db.sql.gz` | Mailcow MariaDB | mysqldump, gzipped |
| `vaultwarden-data.tar.gz` | Vaultwarden Docker volume | tar.gz |
| `n8n-data.tar.gz` | n8n Docker volume | tar.gz |
| `lldap-data.tar.gz` | LLDAP Docker volume | tar.gz |
| `freescout-data.tar.gz` | FreeScout Docker volume | tar.gz |
| `authelia-config/` | Authelia config directory | directory copy |
| `docker-compose.yml.bak` | Main compose file | plain text |
| `erpnext-env.bak` | ERPNext .env file | plain text |

---

## Prerequisites

Before restoring, ensure:
1. Docker and Compose are installed and running
2. The `Dashboard/` directory exists with `docker-compose.yml` and `.env`
3. Docker networks `kecktech_front` and `kecktech_internal` exist:
   ```bash
   docker network create kecktech_front 2>/dev/null
   docker network create kecktech_internal 2>/dev/null
   ```
4. Choose a backup date: `BACKUP=/home/vboxuser/Dashboard/backups/YYYY-MM-DD`

---

## Restore: MariaDB Database (FreeScout, WordPress, ERPNext)

```bash
# Set the backup date
BACKUP=/home/vboxuser/Dashboard/backups/2026-03-14

# 1. Start only the database container
cd /home/vboxuser/Dashboard/docker
docker compose up -d freescout-db  # or wp-db

# 2. Wait for it to be healthy
docker compose exec freescout-db healthcheck.sh --connect --innodb_initialized

# 3. Restore the dump
gunzip -c $BACKUP/freescout-db.sql.gz | docker exec -i freescout-db \
  mysql -ufreescout -p"${FREESCOUT_DB_PASS}" freescout

# 4. Start the application
docker compose up -d freescout
```

For WordPress:
```bash
gunzip -c $BACKUP/wordpress-db.sql.gz | docker exec -i wp-db \
  mysql -uwpuser -p"${WP_DB_PASS}" wpdb
docker compose up -d wordpress
```

For ERPNext:
```bash
cd /home/vboxuser/Dashboard/erpnext/frappe_docker
# Start DB only
docker compose up -d db
sleep 10
gunzip -c $BACKUP/erpnext-db.sql.gz | docker exec -i frappe_docker-db-1 \
  mysql -uroot -p"${DB_PASSWORD}"
# Start all ERPNext services
./../../startup-erpnext.sh
```

---

## Restore: PostgreSQL Database (WikiJS, Umami)

```bash
BACKUP=/home/vboxuser/Dashboard/backups/2026-03-14

# 1. Start the database container
cd /home/vboxuser/Dashboard/docker
docker compose up -d wikijs-db

# 2. Drop and recreate the database
docker exec wikijs-db psql -U wikijs -c "DROP DATABASE IF EXISTS wikijs;"
docker exec wikijs-db psql -U wikijs -c "CREATE DATABASE wikijs OWNER wikijs;"

# 3. Restore
gunzip -c $BACKUP/wikijs-db.sql.gz | docker exec -i wikijs-db \
  psql -U wikijs wikijs

# 4. Start the application
docker compose up -d wikijs
```

For Umami:
```bash
docker exec umami-db psql -U umami -c "DROP DATABASE IF EXISTS umami;"
docker exec umami-db psql -U umami -c "CREATE DATABASE umami OWNER umami;"
gunzip -c $BACKUP/umami-db.sql.gz | docker exec -i umami-db psql -U umami umami
docker compose up -d umami
```

---

## Restore: Docker Named Volume (Vaultwarden, n8n, LLDAP, FreeScout)

```bash
BACKUP=/home/vboxuser/Dashboard/backups/2026-03-14

# 1. Stop the container that uses the volume
docker compose stop vaultwarden

# 2. Restore the volume
docker run --rm \
  -v vboxuser_vaultwarden_data:/data \
  -v $BACKUP:/backup:ro \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/vaultwarden-data.tar.gz -C /data"

# 3. Start the container
docker compose up -d vaultwarden
```

Repeat for other volumes:
| Container | Volume Name | Backup File |
|-----------|-------------|-------------|
| vaultwarden | `vboxuser_vaultwarden_data` | `vaultwarden-data.tar.gz` |
| n8n | `vboxuser_n8n_data` | `n8n-data.tar.gz` |
| lldap | `vboxuser_lldap_data` | `lldap-data.tar.gz` |
| freescout | `vboxuser_freescout_data` | `freescout-data.tar.gz` |

---

## Restore: Authelia Configuration

```bash
BACKUP=/home/vboxuser/Dashboard/backups/2026-03-14

# Stop Authelia
docker compose stop authelia

# Restore config (requires sudo — files owned by root)
sudo cp -r $BACKUP/authelia-config/* /home/vboxuser/Dashboard/docker/authelia/

# Start Authelia
docker compose up -d authelia
```

---

## Restore: Mailcow

```bash
BACKUP=/home/vboxuser/Dashboard/backups/2026-03-14

cd /home/vboxuser/Dashboard/mailcow

# 1. Start only the Mailcow DB
docker compose up -d mysql-mailcow
sleep 10

# 2. Restore the database
gunzip -c $BACKUP/mailcow-db.sql.gz | docker exec -i mailcowdockerized-mysql-mailcow-1 \
  mysql -uroot -p"${DBROOT}" mailcow

# 3. Start all Mailcow services
docker compose up -d
```

---

## Full Stack Restore (Disaster Recovery)

If restoring the entire stack from scratch:

```bash
# 1. Install Docker + Compose on fresh Ubuntu VM
# 2. Clone/copy the Dashboard directory
# 3. Create Docker networks
docker network create kecktech_front
docker network create kecktech_internal

# 4. Copy .env files from backup
cp $BACKUP/erpnext-env.bak /home/vboxuser/Dashboard/erpnext/frappe_docker/.env
# Restore docker/.env from Vaultwarden or secure storage

# 5. Start databases first
cd /home/vboxuser/Dashboard/docker
docker compose up -d freescout-db wp-db wikijs-db umami-db

# 6. Wait for DBs to initialize (30 seconds)
sleep 30

# 7. Restore all databases (see sections above)

# 8. Restore all volumes (see section above)

# 9. Restore Authelia config (see section above)

# 10. Start the full stack
cd /home/vboxuser/Dashboard
./startup-all

# 11. Restore Mailcow DB and start
# 12. Verify all containers healthy:
cd docker && docker compose ps
```

---

## Verification

After any restore, verify:

1. **Container health:** `docker compose ps` — all should show `(healthy)`
2. **Web access:** Browse to each subdomain and confirm the app loads
3. **Data integrity:** Check that recent data (tickets, pages, users) is present
4. **Email flow:** Send a test email to `support@kecktech.net` and verify delivery
5. **Backups resume:** Confirm the nightly cron is still scheduled:
   ```bash
   crontab -l | grep backup
   ```
