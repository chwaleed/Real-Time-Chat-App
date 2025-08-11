#!/bin/bash

# Real-Time Chat App Startup Script
# This script starts both frontend and backend in development mode

echo "🚀 Starting Real-Time Chat App..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "📋 Checking dependencies..."

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating a default one..."
    cat > backend/.env << EOL
PORT=4000
DATABASE_URL=mongodb://localhost:27017/chatapp
ORIGIN=http://localhost:5173
JWT_KEY=your_super_secret_jwt_key_here_$(date +%s)
EOL
    echo "✅ Created backend/.env with default settings"
    echo "📝 Please update the DATABASE_URL in backend/.env if needed"
fi

echo ""
echo "🎯 Starting services..."
echo "Backend will run on: http://localhost:4000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to catch Ctrl+C
trap cleanup INT

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID