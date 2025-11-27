@echo off
echo =========================================
echo   ATS Platform Startup Script (Windows)
echo =========================================
echo.

REM Get the directory where this script is located
set "ROOT_DIR=%~dp0"

echo Starting Backend Server...
start "ATS Backend" cmd /k "cd /d %ROOT_DIR%backend && call venv\Scripts\activate.bat && python main.py"

echo Starting Frontend Server...
start "ATS Frontend" cmd /k "cd /d %ROOT_DIR%frontend && npm run dev"

echo Starting Jupyter Server...
start "Jupyter Server" cmd /k "cd /d %ROOT_DIR%ml\notebooks && call %ROOT_DIR%ml\venv\Scripts\activate.bat && jupyter notebook"

echo.
echo =========================================
echo   All Services Starting...
echo =========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo Jupyter:  http://localhost:8888 (check terminal for token)
echo.
echo Close this window or press any key to exit.
echo (Services will continue running in their own windows)
echo.
pause
