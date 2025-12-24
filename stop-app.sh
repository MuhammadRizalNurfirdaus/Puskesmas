#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}   Stopping Puskesmas System    ${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

BACKEND_PID_FILE=".backend.pid"
FRONTEND_PID_FILE=".frontend.pid"

stop_by_pidfile() {
    local pidfile="$1"
    local name="$2"
    if [ -f "$pidfile" ]; then
        local pid
        pid=$(cat "$pidfile" 2>/dev/null)
        if [ -n "$pid" ] && ps -p "$pid" >/dev/null 2>&1; then
            echo -e "${YELLOW}Stopping ${name} (PID: $pid)...${NC}"
            kill "$pid" >/dev/null 2>&1 || true
            sleep 1
            kill -9 "$pid" >/dev/null 2>&1 || true
            echo -e "${GREEN}✅ ${name} stopped${NC}"
        fi
        rm -f "$pidfile" >/dev/null 2>&1 || true
    fi
}

stop_by_pidfile "$BACKEND_PID_FILE" "backend"
stop_by_pidfile "$FRONTEND_PID_FILE" "frontend"

# Kill processes on port 5000 (backend) - fallback
if command -v lsof >/dev/null 2>&1 && lsof -ti:5000 >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping backend server (port 5000)...${NC}"
    lsof -ti:5000 | xargs -r kill -9
    echo -e "${GREEN}✅ Backend stopped${NC}"
elif command -v fuser >/dev/null 2>&1 && fuser 5000/tcp >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping backend server (port 5000)...${NC}"
    fuser -k 5000/tcp >/dev/null 2>&1 || true
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo -e "${YELLOW}No backend process found on port 5000${NC}"
fi

# Kill processes on port 5173 (frontend) - fallback
if command -v lsof >/dev/null 2>&1 && lsof -ti:5173 >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping frontend server (port 5173)...${NC}"
    lsof -ti:5173 | xargs -r kill -9
    echo -e "${GREEN}✅ Frontend stopped${NC}"
elif command -v fuser >/dev/null 2>&1 && fuser 5173/tcp >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping frontend server (port 5173)...${NC}"
    fuser -k 5173/tcp >/dev/null 2>&1 || true
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo -e "${YELLOW}No frontend process found on port 5173${NC}"
fi

# Kill any remaining node processes related to the project
pkill -f "nodemon src/index.ts" 2>/dev/null && echo -e "${GREEN}✅ Stopped nodemon processes${NC}"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}✅ Stopped vite processes${NC}"

echo ""
echo -e "${GREEN}✅ All servers stopped${NC}"
