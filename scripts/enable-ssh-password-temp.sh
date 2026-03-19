#!/usr/bin/env bash
# Temporarily enable SSH password authentication so you can log in via WinSCP
# and add your public key to ~/.ssh/authorized_keys.
# Run: sudo bash scripts/enable-ssh-password-temp.sh
# After adding your key, run: sudo bash scripts/disable-ssh-password.sh

set -e
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F.%H%M)
sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
sshd -t && echo "Config OK" && systemctl restart ssh
echo "Password authentication enabled. Log in via WinSCP with user vboxuser and your VM password."
echo "Add your public key to ~/.ssh/authorized_keys, then run: sudo bash scripts/disable-ssh-password.sh"
