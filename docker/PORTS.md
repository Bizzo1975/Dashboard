# Kecktech stack – port usage (no conflicts)

All services use the ports below. Ensure nothing else on the host binds to these.

## Main stack (this compose)

| Port(s) | Service    | Notes                    |
|---------|------------|--------------------------|
| 80      | Heimdall   | Main landing page        |
| 8000    | Portainer  | Edge agent (optional)    |
| 8081    | Vaultwarden| Password manager         |
| 8082    | WordPress  | Marketing site           |
| 8091    | FreeScout  | Help desk                |
| 9443    | Portainer  | Web UI (HTTPS)           |
| 3000    | WikiJS     | Knowledge base           |
| 3001    | Umami      | Analytics                |

*No exposed ports:* freescout-db, wp-db, wikijs-db (internal only).

## RustDesk server (starts with stack)

Published like other services; clients connect to this host’s IP:

| Port (TCP) | Port (UDP) | Service   |
|------------|------------|-----------|
| 21115      | –          | hbbs (ID) |
| 21116      | 21116      | hbbs      |
| 21117      | –          | hbbr (relay) |
| 21118      | –          | hbbs WebSocket |
| 21119      | –          | hbbr WebSocket |

Key for clients: `docker/data/rustdesk_data/id_ed25519.pub`. ID Server = this host’s IP.

## ERPNext (separate compose in `../erpnext/frappe_docker`)

| Port | Service   | Notes              |
|------|-----------|--------------------|
| 8080 | Frontend  | ERPNext web UI     |

Start with `../startup-erpnext.sh` or:

```bash
cd ../erpnext/frappe_docker
docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.noproxy.yaml up -d
```

## Conflict check

- Main stack: 80, 8000, 8081, 8082, 8091, 9443, 3000, 3001  
- RustDesk: 21115–21119 (host)  
- ERPNext: 8080  

No overlap. If something fails to start, run `ss -tlnp` or `netstat -tlnp` and ensure these ports are free.
