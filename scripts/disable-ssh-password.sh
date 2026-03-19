#!/usr/bin/env bash
# Disable SSH password authentication (key-only again).
# Run after adding your key: sudo bash scripts/disable-ssh-password.sh

set -e
sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sshd -t && echo "Config OK" && systemctl restart ssh
echo "Password authentication disabled. Use your key to log in."
