#!/usr/bin/env bash
# Start only the RustDesk server (hbbs + hbbr) for client connections.
# Run from Dashboard root. Use this to bring up RustDesk or to see logs in foreground.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/docker"

# RustDesk uses published ports (21115-21119) like other stack services; no host-network port check.

if [ "${1:-}" = "foreground" ] || [ "${1:-}" = "-f" ]; then
  echo "Starting RustDesk in foreground (Ctrl+C to stop)..."
  docker compose up rustdesk-relay rustdesk-id
else
  docker compose up -d rustdesk-relay rustdesk-id
  echo "RustDesk server started. Key for clients:"
  docker compose exec rustdesk-id cat /root/id_ed25519.pub 2>/dev/null || cat "$ROOT/docker/data/rustdesk_data/id_ed25519.pub" 2>/dev/null || echo "Run: cat $ROOT/docker/data/rustdesk_data/id_ed25519.pub"
  echo "Client setup: ID Server = this machine IP, Key = (above). See docs/RUSTDESK-ACCESS.md"
fi
