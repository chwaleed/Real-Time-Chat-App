@echo off
REM Real-Time Chat App Startup Script for Windows
REM This script starts both frontend and backend in development mode

echo 🚀 Starting Real-Time Chat App...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📋 Checking dependencies...

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Creating a default one...
    (
        echo PORT=4000
        echo DATABASE_URL=mongodb://localhost:27017/chatapp
        echo ORIGIN=http://localhost:5173
        echo JWT_KEY=your_super_secret_jwt_key_here
    ) > backend\.env
    echo ✅ Created backend\.env with default settings
    echo 📝 Please update the DATABASE_URL in backend\.env if needed
)

echo.
echo 🎯 Starting services...
echo Backend will run on: http://localhost:4000
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both services
echo.

REM Start backend
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo ✅ Both services are starting in separate windows
echo 🌐 Open http://localhost:5173 in your browser
pause