# RustDesk server – for clients to connect

## Install RustDesk client on this VM

To use RustDesk from the VM (e.g. to connect to other machines or test the server), install the client once:

```bash
cd /home/vboxuser/Dashboard
./scripts/install-rustdesk-client.sh
```

Then open RustDesk (`rustdesk` or from the app menu), go to **Settings (gear) → Network**, set **ID Server** to `127.0.0.1` and **Key** to the value the script printed (or `cat docker/data/rustdesk_data/id_ed25519.pub`). After that, this VM’s client will use your local RustDesk server.

---

## Server: start with the stack

RustDesk server **starts with the rest of the stack**. Run:

```bash
cd /home/vboxuser/Dashboard
./startup-all
```

(or `cd docker && docker compose up -d`). RustDesk containers **rustdesk-id** and **rustdesk-relay** start like the other services; ports 21115–21119 are published to the host so clients can connect.

To start only RustDesk (e.g. after stopping the stack): `./scripts/start-rustdesk-server.sh`. To see logs: `./scripts/start-rustdesk-server.sh foreground`.

---

## 2. If the server doesn’t start or clients can’t connect

RustDesk uses **published ports** (like WordPress, Heimdall, etc.). No host network – it starts with the stack. If the containers exit, run `docker compose logs rustdesk-id rustdesk-relay` in `Dashboard/docker` to see the error. Ensure `data/rustdesk_data` exists and is writable.

### Run in foreground to see the error

```bash
cd /home/vboxuser/Dashboard
./scripts/start-rustdesk-server.sh foreground
```

Note the error message (e.g. “address already in use”, “permission denied”).

### Ensure the data directory exists and is writable

```bash
ls -la /home/vboxuser/Dashboard/docker/data/rustdesk_data/
```

If it’s missing: `mkdir -p /home/vboxuser/Dashboard/docker/data/rustdesk_data`  
If the container logs “permission denied” on `/root`:  
`sudo chown -R 1000:1000 /home/vboxuser/Dashboard/docker/data/rustdesk_data`

### Restart only RustDesk after a full stack up

If you started everything with `./startup-all` and RustDesk still isn’t running:

```bash
cd /home/vboxuser/Dashboard/docker
docker compose stop rustdesk-id rustdesk-relay
docker compose up -d rustdesk-relay rustdesk-id
docker compose logs -f rustdesk-relay rustdesk-id
```

---

## 3. Get the server key (for clients)

On the VM:

```bash
cat /home/vboxuser/Dashboard/docker/data/rustdesk_data/id_ed25519.pub
```

Or:

```bash
cd /home/vboxuser/Dashboard/docker
docker compose exec rustdesk-id cat /root/id_ed25519.pub
```

Example output: `XOQqU+on9AobGDLBT1ugNBr0pma1lX7yArY4EnsU8yo=`  
That line is the **key** clients must enter.

---

## 4. Configure each client (PC / senior’s computer)

On every machine where the RustDesk **client** is installed:

1. Open RustDesk.
2. Click the **gear (⚙)** next to “Your ID”.
3. Open **Network** (or **ID/Relay Server**).
4. Set:
   - **ID Server:** this VM’s IP (e.g. `100.73.237.44` or the IP you use for the dashboard).
   - **Key:** the key from step 3 (e.g. `XOQqU+on9AobGDLBT1ugNBr0pma1lX7yArY4EnsU8yo=`).
5. Save. Restart RustDesk if needed.

After that, clients will register and connect through your RustDesk server.

---

## 5. Firewall (if clients are on another network)

On the **VM**, allow RustDesk’s ports:

```bash
sudo ufw allow 21115:21119/tcp
sudo ufw allow 21116/udp
sudo ufw reload
```

If the VM is behind **VirtualBox NAT**, use a **Bridged** adapter or **Port forwarding** for 21115–21119 so the host (or LAN) can reach the VM.

---

## 6. How it runs in the stack

- **rustdesk-relay** (hbbr) and **rustdesk-id** (hbbs) use image **rustdesk/rustdesk-server:latest**.
- They use **published ports** (no host network): 21115, 21116/tcp, 21116/udp, 21117, 21118, 21119 are mapped to the host so clients connect to the same machine as the rest of the stack.
- **rustdesk-id** depends on **rustdesk-relay**; both share `./data/rustdesk_data` for keys.
