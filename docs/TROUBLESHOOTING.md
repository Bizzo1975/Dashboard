# Troubleshooting: ERPNext and RustDesk not starting

## 1. Get the actual errors

From the Dashboard root run:

```bash
./scripts/verify-and-logs.sh
```

That prints container status and recent logs for the main stack (including RustDesk) and for ERPNext. Use the errors you see there in the steps below.

---

## 2. RustDesk not starting

### Check logs

```bash
cd /home/vboxuser/Dashboard/docker
docker compose logs rustdesk-id
docker compose logs rustdesk-relay
```

### Common fixes

- **"permission denied" on `/root`**  
  The host directory must be writable by the user the container runs as. From `docker/`:
  ```bash
  chmod 755 data/rustdesk_data
  sudo chown -R 1000:1000 data/rustdesk_data
  ```
  Then: `docker compose up -d`.

- **Ports 21115–21119 in use**  
  RustDesk uses host network and needs these free:
  ```bash
  ss -tulnp | grep -E '21115|21116|21117|21118|21119'
  ```
  Stop whatever is using them, or run RustDesk on another host.

- **Containers exit immediately**  
  Try running in the foreground to see the error:
  ```bash
  docker compose run --rm --service-ports rustdesk-id
  ```
  (Ctrl+C to stop.) Fix the error it prints, then `docker compose up -d` again.

### Minimal test (no compose)

```bash
cd /home/vboxuser/Dashboard/docker
docker run --rm -v "$(pwd)/data/rustdesk_data:/root" --net=host rustdesk/rustdesk-server:latest hbbr
```
If that stays running, relay is OK. In another terminal try `hbbs` the same way. If both work, the compose file is the difference (e.g. project name, restarts).

---

## 3. ERPNext not starting / not reachable on :8080

### Your site is already created

You already ran `bench new-site ... --set-default localhost` successfully. You only need the **stack to be running** so the frontend serves :8080.

### Start the stack and check status

```bash
cd /home/vboxuser/Dashboard
./startup-erpnext.sh
```

Wait 1–2 minutes, then:

```bash
cd /home/vboxuser/Dashboard/erpnext/frappe_docker
docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.noproxy.yaml ps -a
```

If `frontend` or `backend` are **Exited**, see their logs:

```bash
docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.noproxy.yaml logs frontend backend configurator
```

### Port 8080 in use

```bash
ss -tlnp | grep 8080
```

If something else is on 8080, stop it or change `HTTP_PUBLISH_PORT` in `erpnext/frappe_docker/.env` (e.g. to 8083) and restart the stack.

### Scheduler warning

The message `SystemSettings.enable_scheduler is UNSET *** Scheduler is disabled ***` is normal on first setup. The site and ERPNext are installed; you can enable the scheduler later in the UI. It does not stop the stack from starting.

### Open ERPNext

When the stack is up and frontend is **Up**:

- **URL:** http://localhost:8080 or http://YOUR_VM_IP:8080  
- **Login:** Administrator  
- **Password:** admin (or what you set in `bench new-site`)

---

## 4. Quick reference

| Goal                    | Command |
|-------------------------|--------|
| Start main stack        | `cd ~/Dashboard/docker && docker compose up -d` |
| Start ERPNext stack     | `cd ~/Dashboard && ./startup-erpnext.sh` |
| Status + logs           | `cd ~/Dashboard && ./scripts/verify-and-logs.sh` |
| RustDesk logs only     | `cd ~/Dashboard/docker && docker compose logs rustdesk-id rustdesk-relay` |
| ERPNext logs only      | `cd ~/Dashboard/erpnext/frappe_docker && docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.noproxy.yaml logs` |
