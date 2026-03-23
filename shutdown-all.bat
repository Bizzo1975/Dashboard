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
echo Kecktech Stack - Windows Shutdown ^(reverse of startup-all.bat^)
echo Root: %ROOT%
echo ============================================================

echo [Preflight] Checking Docker CLI...
docker --version >nul 2>&1
if errorlevel 1 (
  call :fail "Docker CLI not found in PATH." "Install Docker Desktop or add docker to PATH."
  exit /b 1
)

echo [Preflight] Checking Docker daemon...
docker info >nul 2>&1
if errorlevel 1 (
  call :fail "Docker daemon is not ready." "Nothing to shut down, or start Docker Desktop first."
  exit /b 1
)

call :require_dir "%ROOT%\docker" "Missing required directory: docker"
if errorlevel 1 exit /b 1
call :require_dir "%ROOT%\mailcow" "Missing required directory: mailcow"
if errorlevel 1 exit /b 1
call :require_dir "%ROOT%\tactical" "Missing required directory: tactical"
if errorlevel 1 exit /b 1
call :require_dir "%ROOT%\erpnext\frappe_docker" "Missing required directory: erpnext\frappe_docker"
if errorlevel 1 exit /b 1

call :require_file "%ROOT%\docker\docker-compose.yml" "Missing docker compose file for main stack."
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

call :require_file "%ROOT%\docker\.env" "Missing docker\.env (required for compose)."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\tactical\.env" "Missing tactical\.env (required for compose)."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\erpnext\frappe_docker\.env" "Missing ERPNext .env (required for compose)."
if errorlevel 1 exit /b 1
call :require_file "%ROOT%\mailcow\mailcow.conf" "Missing mailcow\mailcow.conf."
if errorlevel 1 exit /b 1

set "ANY_FAIL=0"

echo.
echo === [1/4] ERPNext ^(stop first — same compose files as startup^) ===
pushd "%ROOT%\erpnext\frappe_docker"
docker compose -f compose.yaml -f overrides/compose.mariadb.yaml -f overrides/compose.redis.yaml -f overrides/compose.configurator-deps.yaml -f overrides/compose.site-localhost.yaml -f overrides/compose.kecktech-traefik.yaml down --remove-orphans
if errorlevel 1 (
  echo [WARN] ERPNext down reported an error — check: docker compose ps in erpnext\frappe_docker
  set "ANY_FAIL=1"
)
popd

echo.
echo === [2/4] Tactical RMM ===
pushd "%ROOT%\tactical"
docker compose down --remove-orphans
if errorlevel 1 (
  echo [WARN] Tactical down reported an error — check: docker compose ps in tactical
  set "ANY_FAIL=1"
)
popd

echo.
echo === [3/4] Main stack ^(docker — stop before Mailcow so Authelia does not depend on SMTP^) ===
pushd "%ROOT%\docker"
docker compose down --remove-orphans
if errorlevel 1 (
  echo [WARN] Main stack down reported an error — check: docker compose ps in docker
  set "ANY_FAIL=1"
)
popd

echo.
echo === [4/4] Mailcow ===
pushd "%ROOT%\mailcow"
docker compose down --remove-orphans
if errorlevel 1 (
  echo [WARN] Mailcow down reported an error — check: docker compose ps in mailcow
  set "ANY_FAIL=1"
)
popd

echo.
echo ============================================================
if "!ANY_FAIL!"=="0" (
  echo All stacks shut down successfully.
  echo Docker networks kecktech_front / kecktech_internal are left in place ^(external^).
  echo Named volumes and bind-mounted data are NOT removed.
) else (
  echo Shutdown finished with one or more warnings — review messages above.
)
echo ============================================================
echo.
echo To start again: %ROOT%\startup-all.bat

if "!ANY_FAIL!"=="1" exit /b 1
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

:fail
echo.
echo [ERROR] %~1
echo [ACTION] %~2
exit /b 1

