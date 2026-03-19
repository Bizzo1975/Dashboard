#!/usr/bin/env bash
# Start ERPNext stack (compose.yaml + mariadb + redis + noproxy). Port 8080 must be free.
# Run from Dashboard root or from erpnext/frappe_docker.

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
ERPNEXT="$ROOT/erpnext/frappe_docker"
cd "$ERPNEXT"

# .env in this dir sets ERPNEXT_VERSION and DB_PASSWORD

echo "Starting ERPNext (frontend on port 8080)..."
docker compose -f compose.yaml \
  -f overrides/compose.mariadb.yaml \
  -f overrides/compose.redis.yaml \
  -f overrides/compose.configurator-deps.yaml \
  -f overrides/compose.site-localhost.yaml \
  -f overrides/compose.kecktech-traefik.yaml \
  up -d

echo "ERPNext starting. Frontend: http://$(hostname -I 2>/dev/null | awk '{print $1}'):8080 (or http://localhost:8080)"
