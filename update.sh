#!/bin/bash
# ============================================
# سكربت التحديث — يشتغل بعد كل git pull
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/vhosts/muhitsolution.com/httpdocs"
API_DIR="$APP_DIR/muhit-api"

echo -e "${YELLOW}🔄 تحديث موقع محيط...${NC}"

# Frontend
cd "$APP_DIR"
npm install --production=false
npm run build

# Backend
cd "$API_DIR"
npm install --production=false
npx prisma generate
npx prisma db push
npm run build

# إعادة تشغيل
cd "$APP_DIR"
pm2 restart ecosystem.config.js

echo -e "${GREEN}✅ تم التحديث وإعادة التشغيل!${NC}"
echo -e "لمراقبة: ${GREEN}pm2 status${NC}"
