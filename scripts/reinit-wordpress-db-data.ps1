<#
.SYNOPSIS
  Reinitialize WordPress MariaDB data directory when wp-db fails with missing mysql.* system tables.

.DESCRIPTION
  Symptoms: "Table 'mysql.db' doesn't exist", "Can't open and lock privilege tables".
  Cause: Corrupt or incomplete docker/data/db_data (common after partial copy from another OS).

  This script STOPS wordpress and wp-db, RENAMES db_data to a timestamped backup, and starts
  a fresh MariaDB data directory. You will LOSE the WordPress database unless you restore from backup.

  Restore from VM: copy a good db_data tree or use mysqldump from backups per docs/restore.md

.PARAMETER Force
  Skip confirmation prompt.
#>
param([switch]$Force)

$ErrorActionPreference = "Stop"
# PSScriptRoot = ...\Dashboard\scripts  => project root = ...\Dashboard
$Root = Split-Path -Parent $PSScriptRoot
$DockerDir = Join-Path $Root "docker"
$DbData = Join-Path $DockerDir "data\db_data"

if (-not (Test-Path $DockerDir)) {
  Write-Error "docker directory not found: $DockerDir"
}

if (-not $Force) {
  $msg = @"
WARNING: This will rename WordPress DB data and create a NEW empty database.
Your current WordPress site content in MariaDB will be GONE unless you have a backup.

Backup folder will be: db_data.broken.<timestamp>

Type YES to continue:
"@
  Write-Host $msg
  $r = Read-Host
  if ($r -ne "YES") { Write-Host "Aborted."; exit 1 }
}

Set-Location $DockerDir
# Docker writes progress to stderr; avoid treating it as a terminating error
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
docker compose stop wordpress wp-db 2>&1 | Out-Null
$ErrorActionPreference = $prevEap

if (Test-Path $DbData) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $bak = Join-Path (Split-Path $DbData) "db_data.broken.$stamp"
  Write-Host "Renaming $DbData -> $bak"
  Move-Item -LiteralPath $DbData -Destination $bak -Force
}

Write-Host "Starting fresh wp-db..."
docker compose up -d wp-db
if ($LASTEXITCODE -ne 0) { Write-Error "wp-db failed to start" }

Write-Host "Waiting for MariaDB health (up to 120s)..."
$deadline = (Get-Date).AddSeconds(120)
while ((Get-Date) -lt $deadline) {
  $status = docker inspect -f "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" wp-db 2>$null
  if ($status -match "healthy") { Write-Host "wp-db is healthy."; break }
  if ($status -eq "unhealthy") { Write-Error "wp-db became unhealthy" }
  Start-Sleep -Seconds 3
}

Write-Host "Starting wordpress..."
docker compose up -d wordpress
if ($LASTEXITCODE -ne 0) { Write-Error "wordpress failed to start" }

Write-Host @"

Done. Open https://kecktech.net/ - you may need to complete WordPress install or restore DB from backup.

If you have a mysqldump (e.g. wordpress-db.sql.gz from Dashboard/backups), restore per docs/restore.md
"@
