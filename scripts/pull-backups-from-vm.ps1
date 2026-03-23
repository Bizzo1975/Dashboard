<#
.SYNOPSIS
  Copy VM /home/vboxuser/Dashboard/backups/* to local Dashboard\backups\

.DESCRIPTION
  Reach the VM over **Tailscale** (this is the normal Kecktech path — not public SSH).

  - Use the VM's **Tailscale IP** (default 100.73.237.44), OR your **Tailscale machine name**
    if MagicDNS / split DNS resolves it (e.g. kecktech-1): pass -VmHost "kecktech-1".
  - **Tailscale SSH** (tailscale ssh) is identity-based SSH on the tailnet; OpenSSH still
    needs your key on the VM or an interactive password in YOUR terminal.

  Requires: (1) this PC on the same tailnet, (2) password prompt in terminal OR your
  public key in vboxuser@VM:~/.ssh/authorized_keys (one-time setup below).

.PARAMETER VmHost
  Tailscale IP or resolvable Tailscale hostname (default: 100.73.237.44)

.PARAMETER VmUser
  Linux user (default: vboxuser)
#>
param(
  [string]$VmHost = "100.73.237.44",
  [string]$VmUser = "vboxuser"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Dest = Join-Path $Root "backups"
$RemoteGlob = "${VmUser}@${VmHost}:/home/${VmUser}/Dashboard/backups/*"

New-Item -ItemType Directory -Force -Path $Dest | Out-Null

Write-Host ""
Write-Host "=== Pull Kecktech backups (via Tailscale -> ${VmHost}) ===" -ForegroundColor Cyan
Write-Host "Destination: $Dest"
Write-Host "Source:      ${VmUser}@${VmHost}:/home/${VmUser}/Dashboard/backups/"
Write-Host ""
Write-Host "If prompted: Tailscale SSH / SSH password for ${VmUser}@${VmHost}"
Write-Host ""

# -r recursive not used on glob * - scp copies multiple top-level entries
scp -o StrictHostKeyChecking=accept-new -r $RemoteGlob "${Dest}/"

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "SCP failed. If you saw 'Permission denied (publickey)':" -ForegroundColor Yellow
  Write-Host "  Run this ONCE in this same terminal (password once), then re-run this script:" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "  type `$env:USERPROFILE\.ssh\id_ed25519.pub | ssh ${VmUser}@${VmHost} `"mkdir -p .ssh && chmod 700 .ssh && cat >> .ssh/authorized_keys && chmod 600 .ssh/authorized_keys`""
  Write-Host ""
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Done. Listing local backups:" -ForegroundColor Green
Get-ChildItem $Dest -Directory | Sort-Object Name -Descending | Select-Object -First 15 Name, LastWriteTime
