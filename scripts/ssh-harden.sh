#!/usr/bin/env bash
# Kecktech Phase 1.8 — SSH Hardening & UFW Firewall
# Run with: sudo bash scripts/ssh-harden.sh
# WARNING: Ensure Tailscale is active before running or you will be locked out of SSH.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

TAILSCALE_IP="100.73.237.44"

echo -e "${YELLOW}=== Kecktech SSH Hardening (Phase 1.8) ===${NC}"
echo ""

# --- Safety check: verify Tailscale is active ---
echo -e "${YELLOW}[1/5] Checking Tailscale status...${NC}"
if ! command -v tailscale &>/dev/null; then
    echo -e "${RED}ERROR: tailscale command not found. Install Tailscale first.${NC}"
    exit 1
fi

TS_STATUS=$(tailscale status --json 2>/dev/null | grep -o '"Online":true' || true)
if [ -z "$TS_STATUS" ]; then
    echo -e "${RED}ERROR: Tailscale does not appear to be online.${NC}"
    echo "Run 'tailscale status' to check. Do NOT proceed without Tailscale or you will lose SSH access."
    exit 1
fi

TS_IP=$(tailscale ip -4 2>/dev/null || true)
if [ "$TS_IP" != "$TAILSCALE_IP" ]; then
    echo -e "${YELLOW}WARNING: Tailscale IP is '$TS_IP', expected '$TAILSCALE_IP'.${NC}"
    echo "If the IP changed, update TAILSCALE_IP in this script and in sshd_config below."
    read -rp "Continue anyway? (y/N): " CONFIRM
    if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo -e "${GREEN}Tailscale is online (IP: $TS_IP).${NC}"
echo ""

# --- UFW firewall rules ---
echo -e "${YELLOW}[2/5] Configuring UFW firewall rules...${NC}"

# Web traffic (Traefik)
ufw allow 80/tcp comment 'HTTP (Traefik)'
ufw allow 443/tcp comment 'HTTPS (Traefik)'

# Mail (Mailcow)
ufw allow 25/tcp comment 'SMTP'
ufw allow 465/tcp comment 'SMTPS'
ufw allow 587/tcp comment 'SMTP submission'
ufw allow 143/tcp comment 'IMAP'
ufw allow 993/tcp comment 'IMAPS'

# RustDesk (remote support)
ufw allow 21115:21119/tcp comment 'RustDesk TCP'
ufw allow 21116/udp comment 'RustDesk UDP'

# NATS (Tactical RMM agent communication)
ufw allow 4222/tcp comment 'NATS (Tactical RMM)'

# SSH: allow only via Tailscale interface, deny all other SSH
ufw allow in on tailscale0 to any port 22 proto tcp comment 'SSH via Tailscale only'
ufw deny 22/tcp comment 'Block SSH from non-Tailscale'

# Enable UFW (non-interactive)
ufw --force enable

echo -e "${GREEN}UFW configured and enabled.${NC}"
ufw status verbose
echo ""

# --- SSH config hardening ---
echo -e "${YELLOW}[3/5] Hardening SSH configuration...${NC}"

SSHD_CONFIG="/etc/ssh/sshd_config"
BACKUP="${SSHD_CONFIG}.bak.$(date +%F-%H%M%S)"

cp "$SSHD_CONFIG" "$BACKUP"
echo -e "Backup saved to ${GREEN}${BACKUP}${NC}"

# Check if hardening block already exists
if grep -q '# --- Kecktech hardening' "$SSHD_CONFIG"; then
    echo -e "${YELLOW}Kecktech hardening block already present in sshd_config. Skipping append.${NC}"
else
    cat >> "$SSHD_CONFIG" << EOF

# --- Kecktech hardening (Phase 1.8) ---
ListenAddress ${TS_IP}
ListenAddress 127.0.0.1
PasswordAuthentication no
PermitRootLogin no
MaxAuthTries 3
EOF
    echo -e "${GREEN}SSH hardening block appended.${NC}"
fi

# Validate config before restarting
echo -e "${YELLOW}[4/5] Validating sshd config...${NC}"
if sshd -t; then
    echo -e "${GREEN}sshd config is valid.${NC}"
    systemctl restart ssh
    echo -e "${GREEN}SSH restarted successfully.${NC}"
else
    echo -e "${RED}ERROR: sshd config validation failed! Restoring backup.${NC}"
    cp "$BACKUP" "$SSHD_CONFIG"
    echo "Original config restored. SSH was NOT restarted. Fix the issue and try again."
    exit 1
fi

echo ""

# --- Summary ---
echo -e "${YELLOW}[5/5] Summary${NC}"
echo "  - UFW enabled with rules for HTTP, HTTPS, mail, RustDesk, NATS, Tailscale SSH"
echo "  - SSH locked to Tailscale ($TS_IP) and localhost only"
echo "  - Password auth disabled, root login disabled, max 3 auth tries"
echo "  - sshd_config backup: $BACKUP"
echo ""
echo -e "${GREEN}Done! Test SSH access from another Tailscale device before closing this session.${NC}"
echo ""
echo "Next steps (manual):"
echo "  1. From another Tailscale device: ssh vboxuser@${TS_IP}"
echo "  2. Configure Tailscale ACLs in admin console (see PROJECT_PLAN.md Phase 1.8)"
echo "  3. Optional: sudo tailscale set --ssh  (for Tailscale SSH without keys)"
