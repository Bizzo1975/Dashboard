#!/usr/bin/env bash
# Install RustDesk client on this VM (Ubuntu/Debian) and point it at the local server.
# Run from Dashboard root. Requires: sudo, internet.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUSTDESK_DEB_DIR="${RUSTDESK_DEB_DIR:-$ROOT/docker/data}"

# Latest stable from GitHub (update as needed)
RUSTDESK_VERSION="${RUSTDESK_VERSION:-1.4.6}"
ARCH=$(dpkg --print-architecture)
case "$ARCH" in
  amd64)   DEB="rustdesk-${RUSTDESK_VERSION}-x86_64.deb" ;;
  arm64)   DEB="rustdesk-${RUSTDESK_VERSION}-aarch64.deb" ;;
  armhf)   DEB="rustdesk-${RUSTDESK_VERSION}-armv7-sciter.deb" ;;
  *)       echo "Unsupported arch: $ARCH"; exit 1 ;;
esac

URL="https://github.com/rustdesk/rustdesk/releases/download/${RUSTDESK_VERSION}/${DEB}"

echo "Installing RustDesk client ${RUSTDESK_VERSION} (${ARCH})..."
sudo apt-get update -qq
sudo apt-get install -y wget
cd /tmp
wget -q --show-progress -O "$DEB" "$URL" || { echo "Download failed. Check URL: $URL"; exit 1; }
sudo apt-get install -y "./$DEB"
rm -f "./$DEB"

KEY_FILE="$ROOT/docker/data/rustdesk_data/id_ed25519.pub"
if [ -f "$KEY_FILE" ]; then
  KEY=$(cat "$KEY_FILE")
  echo ""
  echo "RustDesk client installed. Configure it to use this VM's server:"
  echo "  1. Open RustDesk (run: rustdesk)."
  echo "  2. Click the gear next to 'Your ID' -> Network (or ID/Relay Server)."
  echo "  3. Set ID Server: 127.0.0.1  (or this VM's IP if you use it from elsewhere)."
  echo "  4. Set Key: $KEY"
  echo "  5. Save and restart RustDesk if needed."
else
  echo "RustDesk client installed. Get the server key with: cat $KEY_FILE"
fi
