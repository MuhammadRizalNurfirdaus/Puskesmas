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

# Kill processes on port 5000 (backend)
if sudo lsof -ti:5000 >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping backend server (port 5000)...${NC}"
    sudo lsof -ti:5000 | xargs -r sudo kill -9
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo -e "${YELLOW}No backend process found on port 5000${NC}"
fi

# Kill processes on port 5173 (frontend)
if sudo lsof -ti:5173 >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping frontend server (port 5173)...${NC}"
    sudo lsof -ti:5173 | xargs -r sudo kill -9
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo -e "${YELLOW}No frontend process found on port 5173${NC}"
fi

# Kill any remaining node processes related to the project
pkill -f "nodemon src/index.ts" 2>/dev/null && echo -e "${GREEN}✅ Stopped nodemon processes${NC}"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}✅ Stopped vite processes${NC}"

echo ""
echo -e "${GREEN}✅ All servers stopped${NC}"
