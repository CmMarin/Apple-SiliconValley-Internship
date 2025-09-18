@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Determine root (.. from scripts)
set ROOT=%~dp0..
set BACKEND=%ROOT%\backend
set FRONTEND=%ROOT%\frontend
set ELECTRON=%ROOT%\electron

REM Backend venv python
set BACKEND_PY=%BACKEND%\.venv\Scripts\python.exe
if not exist "%BACKEND_PY%" (
  echo Backend venv not found. Creating one...
  python -m venv "%BACKEND%\.venv"
)

REM Start backend in new window
start "backend" cmd /k "cd /d "%BACKEND%" && "%BACKEND_PY%" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

REM Start frontend in new window
start "frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"

REM Small delay for frontend
ping -n 3 127.0.0.1 >nul

REM Start electron in new window
start "electron" cmd /k "cd /d "%ELECTRON%" && npm run dev"

echo Launched backend, frontend, and electron in separate windows.
endlocal
