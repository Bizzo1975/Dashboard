<#
.SYNOPSIS
  Generate trusted local HTTPS certs with mkcert and enable Traefik to use them (removes browser warnings for *.kecktech.net).

.DESCRIPTION
  Requires mkcert: https://github.com/FiloSottile/mkcert
  Run once: choco install mkcert   OR   scoop install mkcert   OR download release.
  Then: mkcert -install

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\setup-mkcert-traefik.ps1
#>
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $Root "docker\traefik"))) {
  Write-Error "Run this from the Dashboard repo (expected docker\traefik)."
}

$CertDir = Join-Path $Root "docker\traefik\certs-local"
$DynamicDir = Join-Path $Root "docker\traefik\dynamic"
New-Item -ItemType Directory -Force -Path $CertDir | Out-Null

$mkcert = Get-Command mkcert -ErrorAction SilentlyContinue
if (-not $mkcert) {
  Write-Error "mkcert not found in PATH. Install from https://github.com/FiloSottile/mkcert then run: mkcert -install"
}

$pem = Join-Path $CertDir "kecktech.pem"
$key = Join-Path $CertDir "kecktech-key.pem"

Write-Host "Generating certs in: $CertDir" -ForegroundColor Cyan
& mkcert -cert-file $pem -key-file $key "kecktech.net" "*.kecktech.net" "localhost" "127.0.0.1" "::1"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$tlsYml = @'
tls:
  certificates:
    - certFile: /certs-local/kecktech.pem
      keyFile: /certs-local/kecktech-key.pem
'@
$tlsPath = Join-Path $DynamicDir "tls-mkcert.yml"
Set-Content -LiteralPath $tlsPath -Value $tlsYml -Encoding utf8
Write-Host "Wrote: $tlsPath" -ForegroundColor Green

Write-Host ""
Write-Host "Restart Traefik to load certs:" -ForegroundColor Yellow
Write-Host "  cd $(Join-Path $Root 'docker')"
Write-Host "  docker compose up -d traefik"
Write-Host ""
