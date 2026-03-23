# Windows Docker stack recovery (wp-db, Mailcow Dovecot)

## WordPress `wp-db`: missing `mysql.db` / privilege tables

**Symptoms:** MariaDB logs show `Table 'mysql.db' doesn't exist`, `Can't open and lock privilege tables`.

**Cause:** `docker/data/db_data` is incomplete or corrupted (often from a partial copy between machines or interrupted init).

**Fix (destroys current WP database on this host):**

1. Ensure you have a backup if you need the old site (see `docs/restore.md` or copy `db_data` from the working VM).
2. From PowerShell:

   ```powershell
   cd F:\Github\Dashboard
   powershell -ExecutionPolicy Bypass -File .\scripts\reinit-wordpress-db-data.ps1
   ```

   Type `YES` when prompted. This renames `db_data` to `db_data.broken.<timestamp>` and starts a clean MariaDB.

3. After that, browse `https://kecktech.net/` — you may see the WordPress installer or need to restore a dump.

## Mailcow `dovecot-mailcow`: `extra.conf` / `passwd-verify.lua` missing

**Symptoms:** Logs repeat `grep: /etc/dovecot/extra.conf: No such file` and `chown: ... passwd-verify.lua`.

**Cause:** Host bind-mount `mailcow/data/conf/dovecot` replaces the image’s `/etc/dovecot`. Those files are normally created on a full mailcow install; they were missing in this repo copy.

**Fix (in repo):** These paths are now populated:

- `mailcow/data/conf/dovecot/extra.conf`
- `mailcow/data/conf/dovecot/auth/passwd-verify.lua`

Restart Dovecot (or the whole mailcow stack):

```powershell
cd F:\Github\Dashboard\mailcow
docker compose up -d dovecot-mailcow
```

If problems persist, compare your `mailcow/data/conf` tree with a working server or run mailcow’s `generate_config.sh` from **Git Bash** or **WSL** after `ln -s mailcow.conf .env` per upstream docs.

## io_uring warnings (MariaDB)

Messages like `io_uring_queue_init() failed with EPERM` on Docker Desktop are common. MariaDB falls back to `innodb_use_native_aio=OFF`. They are **warnings**, not the cause of missing `mysql.*` tables.
