#!/usr/bin/env bash
# One-time migration: move container data from home dir into Dashboard project.
# Run from Dashboard root. Stop containers first (see README in docker/).

set -e
DASHBOARD="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$DASHBOARD/docker/data"

mkdir -p "$DATA"

for dir in heimdall rustdesk_data wp_data db_data; do
  src="/home/vboxuser/$dir"
  if [ -d "$src" ]; then
    echo "Moving $dir into project..."
    mv "$src" "$DATA/"
  else
    echo "Skip $dir (not found at $src)"
  fi
done

echo "Done. Start the stack from $DASHBOARD with: ./startup-all"
