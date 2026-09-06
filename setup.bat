@echo off
SETLOCAL Enabledelayedexpansion

echo.
echo === Checking prerequisites ===

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Install Node 18+ from https://nodejs.org/
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node -p "process.versions.node"') do set NODE_MAJOR=%%a
if !NODE_MAJOR! lss 18 (
    echo Error: Node 18+ is required. Please upgrade your Node installation.
    exit /b 1
)
echo node ok

:: 2. Check Docker Execution
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH.
    exit /b 1
)

docker compose version >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Docker Compose is not available. Please update Docker Desktop.
    exit /b 1
)
echo docker ok

echo.
echo === Starting PostgreSQL (docker compose up -d) ===
docker compose up -d
if %errorlevel% neq 0 (
    echo Error: Could not start PostgreSQL. Verify port 5432 is free.
    exit /b 1
)

echo.
echo === Installing dependencies (npm install) ===
cd client
call npm install --no-fund --no-audit
if %errorlevel% neq 0 (
    echo Error: npm install failed.
    exit /b 1
)
echo Dependencies installed successfully.

echo.
echo === Creating tables (npm run migrate) ===
call npm run --silent migrate

echo.
echo === Loading sample data (npm run seed) ===
call npm run --silent seed

echo.
echo Setup complete. Start the app with:
echo  cd client ^&^& npm run dev
echo.
echo Then open http://localhost:3000 - the UI and the API both live there.
echo Next: read CHALLENGE.md.
echo.

cd ..
pause
