@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

cd /d "%ROOT%"
if errorlevel 1 (
  echo [ERROR] Could not switch to project root: "%ROOT%"
  exit /b 1
)

echo ============================================================
echo Kecktech Stack - Windows Startup
echo Root: %ROOT%
echo ============================================================

echo [Preflight] Checking Docker CLI...
docker --version >nul 2>&1
if errorlevel 1 (
  call :fail "Docker CLI not found in PATH." "Install Docker Desktop and reopen terminal."
)

echo [Preflight] Checking Docker daemon...
docker info >nul 2>&1
if errorlevel 1 (
  call :fail "Docker daemon is not ready." "Start Docker Desktop and wait until engine is running."
)

call :require_dir "%ROOT%\docker" "Missing required directory: docker"
if errorlevel 1 exit /b 1
call :require_dir "%ROOT%\website" "Missing required directory: website"
if errorlevel 1 exit /b 1
call :require_dir "%ROOT%\mailcow" "Missing required directory: mailcow"
if errorlevel 1 exit /b 1
call :require_dir "%ROOT%\tactical" "Missing required directory: tactical"
if errorlevel 1 exit /b 1
call :require_dir "%ROOT%\erpnext\frappe_docker" "Missing required directory: erpnext\frappe_docker"
if errorlevel 1 exit /b 1

call :require_file "%ROOT%\docker\docker-compose.yml" "Missing docker compose file for main stack."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\website\package.json" "Missing website\package.json (required to build website dist)."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\mailcow\docker-compose.yml" "Missing mailcow compose file."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\tactical\docker-compose.yml" "Missing tactical compose file."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\erpnext\frappe_docker\compose.yaml" "Missing ERPNext compose.yaml."
if errorlevel 1 exit /b 1

call :require_file "%ROOT%\erpnext\frappe_docker\overrides\compose.mariadb.yaml" "Missing ERPNext override file."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\erpnext\frappe_docker\overrides\compose.redis.yaml" "Missing ERPNext override file."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\erpnext\frappe_docker\overrides\compose.configurator-deps.yaml" "Missing ERPNext override file."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\erpnext\frappe_docker\overrides\compose.site-localhost.yaml" "Missing ERPNext override file."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\erpnext\frappe_docker\overrides\compose.kecktech-traefik.yaml" "Missing ERPNext override file."
if errorlevel 1 exit /b 1

call :require_file "%ROOT%\docker\.env" "Missing docker\.env (required for secrets)."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\tactical\.env" "Missing tactical\.env (required for secrets)."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\erpnext\frappe_docker\.env" "Missing ERPNext .env (required for DB and image settings)."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\mailcow\mailcow.conf" "Missing mailcow\mailcow.conf. Run mailcow config generation first."
if errorlevel 1 exit /b 1

echo [Preflight] Checking external Docker networks...
call :ensure_network "kecktech_front"
if errorlevel 1 exit /b 1
call :ensure_network "kecktech_internal"
if errorlevel 1 exit /b 1

echo.
echo === [1/5] Website dist build (website\dist) ===
pushd "%ROOT%\website"
call npm run build
if errorlevel 1 (
  popd
  call :phase_fail "Website dist build" "cd website, then run npm run build"
  exit /b 1
)
popd

echo.
echo === [2/5] Mailcow ^(before main stack - Authelia SMTP checks mail.kecktech.net:587^) ===
pushd "%ROOT%\mailcow"
docker compose up -d
if errorlevel 1 (
  popd
  call :phase_fail "Mailcow" "cd mailcow, then run docker compose ps and docker compose logs --tail=50"
  exit /b 1
)
popd

echo.
echo === [3/5] Main stack (docker) ===
pushd "%ROOT%\docker"
docker compose up -d --build
if errorlevel 1 (
  popd
  call :phase_fail "Main stack (docker)" "cd docker, then run docker compose ps and docker compose logs --tail=50"
  exit /b 1
)
popd

echo.
echo === [4/5] Tactical RMM ===
pushd "%ROOT%\tactical"
call :remove_stale_container "trmm-init"
docker compose up -d
if errorlevel 1 (
  popd
  call :phase_fail "Tactical RMM" "cd tactical, then run docker compose ps and docker compose logs --tail=50"
  exit /b 1
)
popd

echo.
echo === [5/5] ERPNext ===
pushd "%ROOT%\erpnext\frappe_docker"
set "PULL_POLICY=missing"
docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.site-localhost.yaml -f overrides/compose.kecktech-traefik.yaml up -d
if errorlevel 1 (
  popd
  call :phase_fail "ERPNext" "cd erpnext\\frappe_docker, then run docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.site-localhost.yaml -f overrides/compose.kecktech-traefik.yaml ps"
  exit /b 1
)
popd

echo.
echo ============================================================
echo All stacks started successfully.
echo Mail:     https://mail.kecktech.net ^(started first for SMTP^)
echo Main:     https://dashboard.kecktech.net
echo RMM:      https://rmm.kecktech.net
echo ERPNext:  https://ops.kecktech.net ^(or http://localhost:8080^)
echo Traefik:  https://traefik.kecktech.net
echo ============================================================
echo.
echo Verification:
echo   cd docker
echo   docker compose ps
echo   cd ..\mailcow
echo   docker compose ps
echo   cd ..\tactical
echo   docker compose ps
echo   cd ..\erpnext\frappe_docker
echo   docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.site-localhost.yaml -f overrides/compose.kecktech-traefik.yaml ps

exit /b 0

:require_dir
if exist "%~1\" (
  exit /b 0
)
call :fail "%~2" "Expected path: %~1"
exit /b 1

:require_file
if exist "%~1" (
  exit /b 0
)
call :fail "%~2" "Expected file: %~1"
exit /b 1

:ensure_network
docker network inspect "%~1" >nul 2>&1
if not errorlevel 1 (
  echo [Preflight] Docker network present: %~1
  exit /b 0
)

echo [Preflight] Docker network missing, creating: %~1
docker network create "%~1" >nul 2>&1
if errorlevel 1 (
  call :fail "Failed to create Docker network: %~1" "Try running: docker network create %~1"
  exit /b 1
)

echo [Preflight] Docker network created: %~1
exit /b 0

:phase_fail
echo.
echo [ERROR] Phase failed: %~1
echo Suggested checks:
echo   %~2
exit /b 1

:remove_stale_container
docker rm -f "%~1" >nul 2>&1
exit /b 0

:fail
echo.
echo [ERROR] %~1
echo [ACTION] %~2
exit /b 1
