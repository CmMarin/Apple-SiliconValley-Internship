# Starts backend, frontend, and electron in separate windows
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'
$electron = Join-Path $root 'electron'

# Backend
$backendPy = Join-Path $backend '.venv\Scripts\python.exe'
if (-Not (Test-Path $backendPy)) {
    Write-Host "Backend venv not found. Creating one..." -ForegroundColor Yellow
    & python -m venv (Join-Path $backend '.venv')
    $backendPy = Join-Path $backend '.venv\Scripts\python.exe'
}

# Start backend
Start-Process powershell -ArgumentList @(
    '-NoExit','-Command',
    "Set-Location '$backend'; & '$backendPy' -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
) -WindowStyle Normal

# Frontend
Start-Process cmd -ArgumentList "/k", "cd /d `"$frontend`" && npm run dev" -WindowStyle Normal

# Electron (wait a moment for frontend)
Start-Sleep -Seconds 2
Start-Process cmd -ArgumentList "/k", "cd /d `"$electron`" && npm run dev" -WindowStyle Normal

Write-Host "Launched backend, frontend, and electron in separate windows." -ForegroundColor Green
