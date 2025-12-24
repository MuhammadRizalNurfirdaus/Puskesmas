#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}   Puskesmas System Starter     ${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js first: https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Check if MariaDB/MySQL is running
if systemctl is-active --quiet mariadb || systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✅ MariaDB/MySQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  MariaDB/MySQL is not running${NC}"
    echo -e "${YELLOW}   Starting MariaDB...${NC}"
    sudo systemctl start mariadb || sudo systemctl start mysql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ MariaDB started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MariaDB${NC}"
        echo -e "${YELLOW}   The application will start but database features won't work${NC}"
    fi
fi

echo ""
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}   Database Setup Required      ${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  Please set up the database first!${NC}"
echo ""
echo -e "Run these commands in MariaDB:"
echo -e "${GREEN}sudo mariadb${NC}"
echo ""
echo -e "Then execute:"
echo -e "${GREEN}CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;${NC}"
echo -e "${GREEN}CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';${NC}"
echo -e "${GREEN}GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';${NC}"
echo -e "${GREEN}FLUSH PRIVILEGES;${NC}"
echo -e "${GREEN}EXIT;${NC}"
echo ""
echo -e "Or see ${BLUE}DATABASE_SETUP.md${NC} for detailed instructions"
echo ""

read -p "Have you completed the database setup? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please complete database setup first, then run this script again${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}   Starting Backend Server      ${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# PID files (so we can stop without sudo)
BACKEND_PID_FILE=".backend.pid"
FRONTEND_PID_FILE=".frontend.pid"

# Best-effort cleanup of an existing backend process
if [ -f "$BACKEND_PID_FILE" ]; then
    OLD_BACKEND_PID=$(cat "$BACKEND_PID_FILE" 2>/dev/null)
    if [ -n "$OLD_BACKEND_PID" ] && ps -p "$OLD_BACKEND_PID" >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Found existing backend PID ($OLD_BACKEND_PID). Stopping...${NC}"
        kill "$OLD_BACKEND_PID" >/dev/null 2>&1 || true
        sleep 1
        kill -9 "$OLD_BACKEND_PID" >/dev/null 2>&1 || true
    fi
    rm -f "$BACKEND_PID_FILE" >/dev/null 2>&1 || true
fi

# Start backend in background
cd backend
echo -e "${GREEN}Starting backend server...${NC}"
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "$BACKEND_PID" > "../$BACKEND_PID_FILE"
cd ..

sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}   Running on: http://localhost:5000${NC}"
    echo -e "${GREEN}   Logs: backend.log${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    echo -e "${YELLOW}Check backend.log for errors${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}   Starting Frontend            ${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Best-effort cleanup of an existing frontend process
if [ -f "$FRONTEND_PID_FILE" ]; then
    OLD_FRONTEND_PID=$(cat "$FRONTEND_PID_FILE" 2>/dev/null)
    if [ -n "$OLD_FRONTEND_PID" ] && ps -p "$OLD_FRONTEND_PID" >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Found existing frontend PID ($OLD_FRONTEND_PID). Stopping...${NC}"
        kill "$OLD_FRONTEND_PID" >/dev/null 2>&1 || true
        sleep 1
        kill -9 "$OLD_FRONTEND_PID" >/dev/null 2>&1 || true
    fi
    rm -f "$FRONTEND_PID_FILE" >/dev/null 2>&1 || true
fi

# Start frontend in background
cd frontend
echo -e "${GREEN}Starting frontend server...${NC}"
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "$FRONTEND_PID" > "../$FRONTEND_PID_FILE"
cd ..

sleep 3

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started successfully (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}   Running on: http://localhost:5173${NC}"
    echo -e "${GREEN}   Logs: frontend.log${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    echo -e "${YELLOW}Check frontend.log for errors${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}   🎉 All Systems Running!      ${NC}"
echo -e "${GREEN}=================================${NC}"
echo ""
echo -e "Access the application at:"
echo -e "${BLUE}🌐 Frontend: http://localhost:5173${NC}"
echo -e "${BLUE}🔧 Backend API: http://localhost:5000${NC}"
echo ""
echo -e "Process IDs:"
echo -e "   Backend: $BACKEND_PID"
echo -e "   Frontend: $FRONTEND_PID"
echo ""
echo -e "To stop the servers:"
echo -e "   ${YELLOW}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo ""
echo -e "Or use: ${YELLOW}./stop-app.sh${NC}"
echo ""
echo -e "View logs:"
echo -e "   ${YELLOW}tail -f backend.log${NC}"
echo -e "   ${YELLOW}tail -f frontend.log${NC}"
