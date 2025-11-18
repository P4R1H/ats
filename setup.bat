@echo off
echo =========================================
echo   ATS Platform Setup Script (Windows)
echo =========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python 3 is not installed. Please install Python 3.9+ first.
    pause
    exit /b 1
)
echo [OK] Python 3 detected

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)
echo [OK] Node.js detected
echo.

REM Backend Setup
echo Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Download spaCy model
echo Downloading spaCy model...
python -m spacy download en_core_web_sm

echo [OK] Backend setup complete
echo.

REM Frontend Setup
echo Setting up Frontend...
cd ..\frontend

REM Install Node dependencies
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo Creating .env.local...
    copy .env.local.example .env.local
)

echo [OK] Frontend setup complete
echo.

REM Success message
echo =========================================
echo   Setup Complete!
echo =========================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python main.py
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
pause
