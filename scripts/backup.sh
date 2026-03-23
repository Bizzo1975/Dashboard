#!/usr/bin/env bash
# =============================================================================
# Kecktech Stack — Backup Script
# Runs DB dumps and volume snapshots for all containers.
# Stores backups in Dashboard/backups/YYYY-MM-DD/
# Schedule with cron: 0 2 * * * /home/vboxuser/Dashboard/scripts/backup.sh
# =============================================================================
set -euo pipefail

BACKUP_ROOT="/home/vboxuser/Dashboard/backups"
DATE=$(date +%F)
DEST="${BACKUP_ROOT}/${DATE}"
LOG="${BACKUP_ROOT}/backup.log"
MAIN_COMPOSE="/home/vboxuser/Dashboard/docker"
ERPNEXT_COMPOSE="/home/vboxuser/Dashboard/erpnext/frappe_docker"
MAILCOW_DIR="/home/vboxuser/Dashboard/mailcow"

mkdir -p "${DEST}"
# Log to file. When run interactively, also show on terminal via tee.
# When run by cron (no TTY), write directly to log file to avoid duplicates.
if [ -t 1 ]; then
  exec > >(tee -a "${LOG}") 2>&1
else
  exec >> "${LOG}" 2>&1
fi
echo "=============================="
echo "Backup started: $(date)"
echo "Destination:    ${DEST}"
echo "=============================="

# ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

dump_mariadb() {
  local container="$1" user="$2" pass="$3" db="$4" outfile="${DEST}/$5"
  echo "[MariaDB] Dumping ${db} from ${container}..."
  docker exec "${container}" mysqldump -u"${user}" -p"${pass}" --single-transaction "${db}" \
    | gzip > "${outfile}"
  echo "  → ${outfile} ($(du -sh "${outfile}" | cut -f1))"
}

dump_postgres() {
  local container="$1" user="$2" db="$3" outfile="${DEST}/$4"
  echo "[Postgres] Dumping ${db} from ${container}..."
  docker exec "${container}" pg_dump -U "${user}" "${db}" \
    | gzip > "${outfile}"
  echo "  → ${outfile} ($(du -sh "${outfile}" | cut -f1))"
}

backup_volume() {
  local volume="$1" outfile="${DEST}/$2"
  echo "[Volume] Backing up ${volume}..."
  docker run --rm \
    -v "${volume}:/data:ro" \
    -v "${DEST}:/backup" \
    alpine tar czf "/backup/$2" -C /data .
  echo "  → ${outfile} ($(du -sh "${outfile}" | cut -f1))"
}

# ── MAIN STACK DATABASES ──────────────────────────────────────────────────────
# Load secrets from .env
set -a; source "${MAIN_COMPOSE}/.env"; set +a

echo ""
echo "--- Main stack DBs ---"
dump_mariadb "wp-db"         "wpuser"    "${WP_DB_PASS}"         "wpdb"       "wordpress-db.sql.gz"
dump_postgres "wikijs-db"    "wikijs"    "wikijs"                             "wikijs-db.sql.gz"
dump_postgres "umami-db"     "umami"     "umami"                              "umami-db.sql.gz"
dump_postgres "zammad-db"    "zammad"    "zammad"                             "zammad-db.sql.gz"

# ── ERPNEXT DATABASE ──────────────────────────────────────────────────────────
echo ""
echo "--- ERPNext DB ---"
ERPNEXT_DB_PASS=$(grep DB_PASSWORD "${ERPNEXT_COMPOSE}/.env" | cut -d= -f2)
dump_mariadb "frappe_docker-db-1" "root" "${ERPNEXT_DB_PASS}" "_all_databases" "erpnext-db.sql.gz" 2>/dev/null \
  || echo "  [WARN] ERPNext DB dump failed (container may be stopped)"

# ── MAILCOW DATABASE ──────────────────────────────────────────────────────────
echo ""
echo "--- Mailcow DB ---"
if [ -f "${MAILCOW_DIR}/mailcow.conf" ]; then
  MC_DBROOT=$(grep '^DBROOT=' "${MAILCOW_DIR}/mailcow.conf" | cut -d= -f2)
  dump_mariadb "mailcowdockerized-mysql-mailcow-1" "root" "${MC_DBROOT}" "mailcow" "mailcow-db.sql.gz" 2>/dev/null \
    || echo "  [WARN] Mailcow DB dump failed (container may be stopped)"
else
  echo "  [SKIP] Mailcow not configured yet"
fi

# ── NAMED VOLUMES ─────────────────────────────────────────────────────────────
echo ""
echo "--- Named volumes ---"
backup_volume "vboxuser_vaultwarden_data"  "vaultwarden-data.tar.gz"
backup_volume "vboxuser_n8n_data"          "n8n-data.tar.gz"
backup_volume "vboxuser_lldap_data"        "lldap-data.tar.gz"
backup_volume "vboxuser_zammad_storage"    "zammad-storage.tar.gz"

# ── AUTHELIA CONFIG ───────────────────────────────────────────────────────────
echo ""
echo "--- Config files ---"
cp -r "${MAIN_COMPOSE}/authelia" "${DEST}/authelia-config" 2>/dev/null || rsync -a --ignore-errors "${MAIN_COMPOSE}/authelia/" "${DEST}/authelia-config/" 2>/dev/null || echo "  [WARN] Some authelia files skipped (permission denied)"
cp "${MAIN_COMPOSE}/docker-compose.yml" "${DEST}/docker-compose.yml.bak"
cp "${ERPNEXT_COMPOSE}/.env" "${DEST}/erpnext-env.bak"
echo "  → Config files copied"

# ── CLEANUP — keep last 14 days ───────────────────────────────────────────────
echo ""
echo "--- Cleanup ---"
find "${BACKUP_ROOT}" -maxdepth 1 -type d -name "????-??-??" \
  | sort -r | tail -n +15 | xargs -r rm -rf
echo "  → Old backups cleaned (keeping last 14 days)"

echo ""
echo "Backup complete: $(date)"
echo "Total size: $(du -sh "${DEST}" | cut -f1)"
echo "=============================="
