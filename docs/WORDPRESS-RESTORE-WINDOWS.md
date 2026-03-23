# Restore the old WordPress site (Windows)

## What happened

The WordPress **files** are still under `docker/data/wp_data/`. The **database** was reinitialized because the old MariaDB data directory was corrupted (missing `mysql.*` system tables).

The renamed folder `docker/data/db_data.broken.20260319-180436` only contains a few InnoDB files and **does not contain** a recoverable `wpdb` database — so the site content must come from a **backup dump** or a copy from the old server.

## What you need

A file named **`wordpress-db.sql.gz`** from:

- `Dashboard/backups/YYYY-MM-DD/` on the **Ubuntu VM** (from nightly `scripts/backup.sh`), or  
- Any other mysqldump you saved.

## Step 1 — Copy the backup to this PC

**Option A — SCP (OpenSSH client on Windows 11)**

Replace the date folder with your latest backup on the VM:

```powershell
mkdir F:\Github\Dashboard\backups\2026-03-14 -Force
scp vboxuser@100.73.237.44:/home/vboxuser/Dashboard/backups/2026-03-14/wordpress-db.sql.gz F:\Github\Dashboard\backups\2026-03-14\
```

**Option B — Manual**  
Copy `wordpress-db.sql.gz` from the VM (USB, sync tool, etc.) into e.g. `F:\Github\Dashboard\backups\<date>\`.

## Step 2 — Restore

From PowerShell:

```powershell
cd F:\Github\Dashboard
powershell -ExecutionPolicy Bypass -File .\scripts\restore-wordpress-from-backup.ps1 `
  -BackupFile "F:\Github\Dashboard\backups\2026-03-14\wordpress-db.sql.gz" `
  -FixKecktechUrls
```

- **`-FixKecktechUrls`** sets `siteurl` and `home` in `wp_options` to `https://kecktech.net` (good for this test setup). Omit if your dump already has the correct URLs.

## Step 3 — Verify

1. Open `https://kecktech.net/` (with `hosts` pointing to this PC).  
2. If the DB user/password in the dump era differed from current `docker/.env`, you may need to align `WP_DB_PASS` / container env — normally the dump restores into the current `wpuser`/`wpdb` and matches compose.

## If you have no `wordpress-db.sql.gz`

1. On the **VM**, if the old `db_data` is still good there, create a dump:

   ```bash
   cd ~/Dashboard/docker
   docker compose exec wp-db mysqldump -uwpuser -p"$WP_DB_PASS" wpdb | gzip > ~/wordpress-db-manual.sql.gz
   ```

   Copy that file to Windows and run the restore script on it.

2. Or restore **full** `db_data` from the VM only if that datadir is known healthy (not the broken Windows copy).

## Related

- General restore reference: [restore.md](restore.md)  
- Windows issues: [WINDOWS-DOCKER-RECOVERY.md](WINDOWS-DOCKER-RECOVERY.md)
