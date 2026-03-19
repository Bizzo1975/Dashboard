# SSH Hardening — Tailscale-Only Access

This VM's SSH is currently open on all interfaces (`0.0.0.0:22`).
The steps below lock it to the Tailscale interface only.

**VM Tailscale IP:** `100.73.237.44`

> ⚠️ **Before applying:** Confirm you have an active Tailscale session on this machine,
> OR have physical/console access. If you lock yourself out, you will need console access to recover.

---

## Step 1 — Run this in your terminal (requires sudo password)

```bash
# 1. Enable UFW with all required ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 21115:21119/tcp
sudo ufw allow 21116/udp
sudo ufw allow 25/tcp
sudo ufw allow 465/tcp
sudo ufw allow 587/tcp
sudo ufw allow 143/tcp
sudo ufw allow 993/tcp

# 2. Allow SSH only from the Tailscale network (100.64.0.0/10)
sudo ufw allow in on tailscale0 to any port 22 proto tcp
# Deny SSH on all other interfaces
sudo ufw deny 22/tcp

# 3. Enable UFW
sudo ufw --force enable
sudo ufw status verbose
```

---

## Step 2 — Lock SSH to Tailscale interface

```bash
# Backup current sshd_config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F)

# Append Tailscale-only listen address and harden settings
sudo tee -a /etc/ssh/sshd_config << 'EOF'

# --- Kecktech hardening (added Phase 1.8) ---
ListenAddress 100.73.237.44
ListenAddress 127.0.0.1
PasswordAuthentication no
PermitRootLogin no
MaxAuthTries 3
EOF

# Validate config before restarting
sudo sshd -t && echo "Config OK" && sudo systemctl restart ssh
```

---

## Step 3 — Enable Tailscale SSH (optional, key-free access)

```bash
sudo tailscale set --ssh
```

Then in the Tailscale admin console (`login.tailscale.com/admin/acls`), add SSH access rules:

```json
{
  "ssh": [
    {
      "action": "accept",
      "src": ["autogroup:admin"],
      "dst": ["tag:kecktech-vm"],
      "users": ["autogroup:nonroot"]
    }
  ]
}
```

---

## Step 4 — Tailscale ACL tags (do in browser)

1. Go to `https://login.tailscale.com/admin/machines`
2. Click on `KeckTech` (this VM) → **Edit ACL tags** → add `tag:kecktech-vm`
3. Click on `Alisha-PC` → add `tag:kecktech-staff`
4. For the Florida contact's device (once enrolled) → add `tag:kecktech-staff`
5. Go to `https://login.tailscale.com/admin/acls` and add these rules:

```json
{
  "tagOwners": {
    "tag:kecktech-vm":    ["autogroup:admin"],
    "tag:kecktech-staff": ["autogroup:admin"]
  },
  "acls": [
    {
      "action": "accept",
      "src":    ["autogroup:admin"],
      "dst":    ["tag:kecktech-vm:*"]
    },
    {
      "action": "accept",
      "src":    ["tag:kecktech-staff"],
      "dst":    ["tag:kecktech-vm:443", "tag:kecktech-vm:80"]
    }
  ]
}
```

---

## Verification

After applying, from any Tailscale-connected device:
```bash
ssh vboxuser@100.73.237.44    # Should work (Tailscale)
ssh vboxuser@<LAN_IP>          # Should be refused (UFW blocks non-Tailscale)
```
