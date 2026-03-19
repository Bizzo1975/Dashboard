# Kecktech Docker Stack

All app containers for the Kecktech stack are defined here. Run from this directory (`Dashboard/docker/`).

## "Permission denied" connecting to Docker

If `./startup-all` or `docker compose` fails with:

```text
permission denied while trying to connect to the Docker API at unix:///var/run/docker.sock
```

add your user to the `docker` group (one-time), then start a new login session:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

After `newgrp docker`, run `./startup-all` again in the same terminal. Or log out and log back in so the group applies in all terminals.

## First-time migration (from home directory)

**Heimdall** has already been moved into `docker/data/`. To finish migration and remove unneeded containers, run (with sudo for moving root-owned data):

```bash
cd /home/vboxuser/Dashboard
sudo bash scripts/run-migration-and-cleanup.sh
```

That script will: stop the old stack from home, move `rustdesk_data`, `wp_data`, and `db_data` into the project, prune stopped/unused containers and volumes, start the stack from the project, and rename the old `docker-compose.yml` in home to `.bak`.

The compose file uses `name: vboxuser` so Docker keeps using the same **named** volumes (freescout_data, wikijs_data, etc.); only the bind-mounted folders are moved.

## Ports

See **PORTS.md** in this directory for the full list. Main stack uses: 80, 8081, 8082, 8091, 9443, 8000, 3000, 3001. RustDesk uses host network (21115–21119). ERPNext uses 8080 (started via `../startup-erpnext.sh` or `./startup-all`).

## RustDesk server (for clients to connect)

RustDesk runs with the rest of the stack as **rustdesk-relay** (hbbr) and **rustdesk-id** (hbbs). Ports 21115, 21116 (tcp+udp), 21117, 21118, 21119 are published to the host so clients can connect to this machine’s IP. Keys are in `./data/rustdesk_data`. Client setup: ID Server = this host IP, Key = contents of `data/rustdesk_data/id_ed25519.pub`. See **docs/RUSTDESK-ACCESS.md**.

## Running

From the project root (Dashboard):

```bash
cd /home/vboxuser/Dashboard
./startup-all
```

Or from this directory:

```bash
cd /home/vboxuser/Dashboard/docker
docker compose up -d
```

## ERPNext

ERPNext has its own compose and lives under `Dashboard/erpnext/frappe_docker`. Start it from there when needed; see `../startup-all` to start both stacks.
