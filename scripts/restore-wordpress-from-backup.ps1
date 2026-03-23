<#
.SYNOPSIS
  Restore WordPress MariaDB from a gzipped mysqldump (wordpress-db.sql.gz).

.DESCRIPTION
  Expects the same format as scripts/backup.sh: wordpress-db.sql.gz for database wpdb.
  Reads WP_DB_PASS and WP_DB_ROOT_PASS from docker\.env.

  After restore, optionally fixes site URL for https://kecktech.net (test stack).

.PARAMETER BackupFile
  Full path to wordpress-db.sql.gz

.PARAMETER FixKecktechUrls
  If set, runs SQL to set siteurl and home to https://kecktech.net

.EXAMPLE
  .\scripts\restore-wordpress-from-backup.ps1 -BackupFile "F:\Github\Dashboard\backups\2026-03-14\wordpress-db.sql.gz" -FixKecktechUrls
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$BackupFile,

  [switch]$FixKecktechUrls
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$DockerDir = Join-Path $Root "docker"
$EnvFile = Join-Path $DockerDir ".env"

if (-not (Test-Path $BackupFile)) {
  Write-Error "Backup not found: $BackupFile"
}
if (-not (Test-Path $EnvFile)) {
  Write-Error "Missing $EnvFile"
}

function Get-DotEnvValue {
  param([string]$Path, [string]$Key)
  foreach ($raw in Get-Content -LiteralPath $Path) {
    $line = $raw.Trim()
    if ($line -match '^\s*#' -or $line -eq '') { continue }
    if ($line -match "^\s*$([regex]::Escape($Key))\s*=\s*(.*)\s*$") {
      $v = $Matches[1].Trim()
      if ($v.Length -ge 2 -and $v.StartsWith('"') -and $v.EndsWith('"')) {
        $v = $v.Substring(1, $v.Length - 2)
      }
      return $v
    }
  }
  return $null
}

$wpPass = Get-DotEnvValue -Path $EnvFile -Key "WP_DB_PASS"
$rootPass = Get-DotEnvValue -Path $EnvFile -Key "WP_DB_ROOT_PASS"
if (-not $wpPass -or -not $rootPass) {
  Write-Error "WP_DB_PASS or WP_DB_ROOT_PASS not found in docker\.env"
}

$backupFull = (Resolve-Path -LiteralPath $BackupFile).Path
$backupDir = Split-Path -Parent $backupFull
$backupName = Split-Path -Leaf $backupFull

Write-Host "Stopping wordpress..."
Set-Location $DockerDir
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
docker compose stop wordpress 2>&1 | Out-Null
$ErrorActionPreference = $prevEap

Write-Host "Recreating empty database wpdb..."
$resetSql = @"
DROP DATABASE IF EXISTS wpdb;
CREATE DATABASE wpdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON wpdb.* TO 'wpuser'@'%';
FLUSH PRIVILEGES;
"@
$resetSql | docker exec -i wp-db mysql -uroot -p"$rootPass"
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to reset database (is wp-db running?)" }

Write-Host "Importing $backupName (this may take several minutes)..."
docker run --rm -v "${backupDir}:/backup:ro" alpine:3.20 sh -c "gunzip -c /backup/$backupName" |
  docker exec -i wp-db mysql -uwpuser -p"$wpPass" wpdb
if ($LASTEXITCODE -ne 0) { Write-Error "Import failed" }

if ($FixKecktechUrls) {
  Write-Host "Setting siteurl and home to https://kecktech.net ..."
  $urlSql = "UPDATE wp_options SET option_value='https://kecktech.net' WHERE option_name IN ('siteurl','home');"
  $urlSql | docker exec -i wp-db mysql -uwpuser -p"$wpPass" wpdb
}

Write-Host "Starting wordpress..."
docker compose up -d wordpress
if ($LASTEXITCODE -ne 0) { Write-Error "wordpress failed to start" }

Write-Host ""
Write-Host "Restore complete. Open https://kecktech.net/"
Write-Host "If pages still redirect wrong, run WP search-replace or add -FixKecktechUrls next time."
