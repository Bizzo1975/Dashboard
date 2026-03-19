#!/usr/bin/env bash
# Run from Dashboard root. Shows status and recent logs for main stack (RustDesk)
# and ERPNext so you can see why a service might not be starting.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "========== Main stack (docker/) =========="
cd "$ROOT/docker"
docker compose ps -a
echo ""
echo "--- RustDesk containers (last 30 lines each) ---"
docker compose logs --tail=30 rustdesk-id 2>/dev/null || true
echo "---"
docker compose logs --tail=30 rustdesk-relay 2>/dev/null || true

echo ""
echo "========== ERPNext stack =========="
cd "$ROOT/erpnext/frappe_docker"
docker compose -f compose.yaml \
  -f overrides/compose.mariadb.yaml \
  -f overrides/compose.redis.yaml \
  -f overrides/compose.configurator-deps.yaml \
  -f overrides/compose.noproxy.yaml \
  ps -a 2>/dev/null || echo "ERPNext stack not running. Start with: ./startup-erpnext.sh"

echo ""
echo "--- ERPNext frontend/backend/configurator (last 15 lines each) ---"
docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.noproxy.yaml logs --tail=15 configurator frontend backend 2>/dev/null || true
