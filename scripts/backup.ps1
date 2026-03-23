# Kecktech Stack — Windows Backup Script
# Wraps scripts/backup.sh via WSL2, or falls back to PowerShell-native DB dumps.
# Schedule via Windows Task Scheduler — run daily at 02:00 as SYSTEM or an admin account.
#
# Usage:
#   powershell -NonInteractive -File F:\Github\Dashboard\scripts\backup.ps1
#
# To register with Task Scheduler (run once as Administrator):
#   $action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NonInteractive -File F:\Github\Dashboard\scripts\backup.ps1"
#   $trigger = New-ScheduledTaskTrigger -Daily -At "02:00"
#   $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable
#   Register-ScheduledTask -TaskName "KecktechBackup" -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest -Force

param(
    [string]$Root = "F:\Github\Dashboard"
)

$ErrorActionPreference = "Stop"
$logFile   = Join-Path $Root "backups\backup.log"

function Write-Log {
    param([string]$msg)
    $line = "[$((Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))] $msg"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

Write-Log "=== Kecktech Backup Started ==="

# ── Method 1: WSL2 (preferred) ────────────────────────────────────────────────
$wslPath = "/mnt/" + ($Root -replace "\\", "/" -replace ":", "").ToLower() + "/scripts/backup.sh"
$wslAvailable = (Get-Command wsl -ErrorAction SilentlyContinue) -and ((wsl --status 2>$null) -notmatch "not installed")

if ($wslAvailable) {
    Write-Log "Running backup.sh via WSL2..."
    try {
        $output = wsl bash $wslPath 2>&1
        Write-Log "WSL backup completed."
        Write-Log $output
        Write-Log "=== Backup Finished (WSL) ==="
        exit 0
    } catch {
        Write-Log "WSL backup failed: $_ -- falling back to native PowerShell backup."
    }
}

# ── Method 2: PowerShell-native DB dumps ──────────────────────────────────────
Write-Log "Running native PowerShell backup..."

$backupDir = Join-Path $Root "backups"
$date = Get-Date -Format "yyyy-MM-dd"
$dbDir = Join-Path $backupDir "db"
New-Item -ItemType Directory -Force -Path $dbDir | Out-Null

# Helper: dump MySQL/MariaDB database from a container
function Backup-MySQL {
    param([string]$container, [string]$db, [string]$user, [string]$pass)
    $outFile = Join-Path $dbDir "$date-$db.sql.gz"
    Write-Log "  Dumping MySQL $db from $container..."
    docker exec $container sh -c "mysqldump -u '$user' -p'$pass' '$db' | gzip > /tmp/kt_backup.sql.gz"
    docker cp "${container}:/tmp/kt_backup.sql.gz" $outFile
    docker exec $container sh -c "rm /tmp/kt_backup.sql.gz"
    Write-Log "  -> $outFile"
}

# Helper: dump PostgreSQL database from a container
function Backup-Postgres {
    param([string]$container, [string]$db, [string]$user)
    $outFile = Join-Path $dbDir "$date-$db.sql.gz"
    Write-Log "  Dumping Postgres $db from $container..."
    docker exec $container sh -c "pg_dump -U '$user' '$db' | gzip > /tmp/kt_backup.sql.gz"
    docker cp "${container}:/tmp/kt_backup.sql.gz" $outFile
    docker exec $container sh -c "rm /tmp/kt_backup.sql.gz"
    Write-Log "  -> $outFile"
}

try {
    # WordPress DB
    Backup-MySQL -container "wp-db" -db "wpdb" -user "wpuser" -pass "kecktech_secure"
    # WikiJS DB
    Backup-Postgres -container "wikijs-db" -db "wikijs" -user "wikijs"
    # Umami DB
    Backup-Postgres -container "umami-db" -db "umami" -user "umami"
    # Zammad DB
    Backup-Postgres -container "zammad-db" -db "zammad" -user "zammad"

    Write-Log "DB dumps complete."
} catch {
    Write-Log "ERROR during DB dump: $_"
}

# ── Cleanup: remove backups older than 14 days ────────────────────────────────
Write-Log "Cleaning up backups older than 14 days..."
Get-ChildItem -Path $backupDir -Recurse -File |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-14) } |
    Remove-Item -Force
Write-Log "Cleanup done."

Write-Log "=== Backup Finished (Native PowerShell) ==="
