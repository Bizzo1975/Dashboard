# panel.unclejonsitgarage.com — VM 400 recovery (blocked without console)

**Status (2026-08-07):** VM `game-server-01` (VMID 400) is **running** on Proxmox but:

- No reply to ping on configured IP `10.20.0.200/24`
- **QEMU Guest Agent is not running** (cannot `qm guest exec`)
- No Tailscale path from ops hosts

## Console steps (Proxmox UI → VM 400 → Console)

1. Open serial/VGA console for VM 400.
2. Log in as `kecktech` (or root).
3. Fix NIC (cloud-init expected `10.20.0.200/24`, gw `10.20.0.1`):
   ```bash
   ip -br a
   sudo ip link set eth0 up   # or ens18 — use actual iface
   sudo ip addr add 10.20.0.200/24 dev eth0
   sudo ip route replace default via 10.20.0.1
   ```
4. Persist via netplan/cloud-init so reboot keeps the address.
5. Start guest agent: `sudo systemctl enable --now qemu-guest-agent`
6. Start Cloudflare tunnel:
   ```bash
   sudo systemctl enable --now cloudflared
   # or: sudo cloudflared tunnel run …
   ```
7. Verify from ops host: `ping 10.20.0.200` and https://panel.unclejonsitgarage.com/

## After network is up

- Confirm Pterodactyl/panel listens on expected port
- Update Traefik/unclejons route if backend IP changed
