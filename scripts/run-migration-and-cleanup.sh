#!/usr/bin/env bash
# Full migration: stop old stack, move all data into project, remove unneeded
# containers, start stack from Dashboard. Run with: sudo bash scripts/run-migration-and-cleanup.sh
# (Or run the docker commands as a user in the docker group, and use sudo only for the moves.)

set -e
HOME_DIR=/home/vboxuser
PROJECT="$HOME_DIR/Dashboard"
DATA="$PROJECT/docker/data"

echo "=== 1. Stopping stack from home directory ==="
cd "$HOME_DIR"
docker compose down 2>/dev/null || true

echo "=== 2. Moving remaining data into project (requires sudo for ownership) ==="
mkdir -p "$DATA"
for dir in rustdesk_data wp_data db_data; do
  if [ -d "$HOME_DIR/$dir" ]; then
    [ -d "$DATA/$dir" ] && rm -rf "$DATA/$dir"
    mv "$HOME_DIR/$dir" "$DATA/"
    echo "  Moved $dir"
  fi
done
# heimdall was already moved by migrate-to-project.sh
chown -R vboxuser:vboxuser "$DATA" 2>/dev/null || true

echo "=== 3. Removing stopped/unused containers and orphan volumes ==="
docker container prune -f
docker volume prune -f

echo "=== 4. Starting stack from project ==="
cd "$PROJECT/docker"
docker compose up -d

echo "=== 5. Disabling old compose in home (renamed so it is not used by mistake) ==="
[ -f "$HOME_DIR/docker-compose.yml" ] && mv "$HOME_DIR/docker-compose.yml" "$HOME_DIR/docker-compose.yml.bak" && echo "  Renamed home docker-compose.yml to .bak"

echo "=== Done. Stack is running from $PROJECT. Use: cd $PROJECT && ./startup-all (next time) ==="
