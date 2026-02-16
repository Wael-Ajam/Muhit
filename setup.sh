#!/bin/bash
# ============================================
# Muhit — سكربت إعداد السيرفر
# يشتغل على Plesk VPS
# الدومين: muhitsolution.com
# ============================================

set -e  # إيقاف عند أي خطأ

# ألوان للطباعة
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  🌊 بدء إعداد موقع محيط${NC}"
echo -e "${GREEN}========================================${NC}"

# المسار الرئيسي
APP_DIR="/var/www/vhosts/muhitsolution.com/httpdocs"
API_DIR="$APP_DIR/muhit-api"

cd "$APP_DIR"

# ============================================
# 1. تثبيت PM2 عالمياً (إذا مش موجود)
# ============================================
echo -e "\n${YELLOW}[1/7] تثبيت PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✅ تم تثبيت PM2${NC}"
else
    echo -e "${GREEN}✅ PM2 موجود مسبقاً${NC}"
fi

# ============================================
# 2. تثبيت باكجات الفرونت إند
# ============================================
echo -e "\n${YELLOW}[2/7] تثبيت باكجات Next.js...${NC}"
cd "$APP_DIR"
npm install --production=false
echo -e "${GREEN}✅ تم تثبيت باكجات الفرونت إند${NC}"

# ============================================
# 3. بناء الفرونت إند (Next.js)
# ============================================
echo -e "\n${YELLOW}[3/7] بناء Next.js...${NC}"
cd "$APP_DIR"
npm run build
echo -e "${GREEN}✅ تم بناء الفرونت إند${NC}"

# ============================================
# 4. تثبيت باكجات الباكند (NestJS)
# ============================================
echo -e "\n${YELLOW}[4/7] تثبيت باكجات NestJS API...${NC}"
cd "$API_DIR"
npm install
echo -e "${GREEN}✅ تم تثبيت باكجات الباكند${NC}"

# ============================================
# 5. إعداد قاعدة البيانات + بناء الباكند
# ============================================
echo -e "\n${YELLOW}[5/7] إعداد قاعدة البيانات وبناء API...${NC}"
cd "$API_DIR"

# إنشاء ملف .env للباكند (إذا مش موجود)
if [ ! -f .env ]; then
    cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="muhit-jwt-secret-2026-change-me"
EOF
    echo -e "${GREEN}  ✅ تم إنشاء ملف .env${NC}"
fi

npx prisma generate
npx prisma migrate deploy
npm run build
echo -e "${GREEN}✅ تم إعداد القاعدة وبناء API${NC}"

# ============================================
# 6. إنشاء مجلد الرفع
# ============================================
echo -e "\n${YELLOW}[6/7] إنشاء مجلدات الرفع...${NC}"
mkdir -p "$APP_DIR/public/uploads/site"
echo -e "${GREEN}✅ مجلدات الرفع جاهزة${NC}"

# ============================================
# 7. تشغيل التطبيقات بـ PM2
# ============================================
echo -e "\n${YELLOW}[7/7] تشغيل التطبيقات...${NC}"
cd "$APP_DIR"

# إيقاف أي نسخ قديمة
pm2 delete muhit-frontend 2>/dev/null || true
pm2 delete muhit-api 2>/dev/null || true

# تشغيل من ecosystem.config.js
pm2 start ecosystem.config.js

# حفظ وتفعيل التشغيل التلقائي
pm2 save
pm2 startup 2>/dev/null || true

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ تم إعداد موقع محيط بنجاح!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e ""
echo -e "  🌐 Frontend: http://localhost:3000"
echo -e "  🔧 API:      http://localhost:3001/api"
echo -e ""
echo -e "${YELLOW}⚠️  لا تنسى تضيف إعدادات nginx بـ Plesk:${NC}"
echo -e "  Domains → muhitsolution.com → Apache & nginx Settings"
echo -e "  انسخ محتوى ملف ${GREEN}nginx-plesk.conf${NC} بخانة Additional nginx directives"
echo -e ""
echo -e "  لمراقبة التطبيقات: ${GREEN}pm2 status${NC}"
echo -e "  لمشاهدة اللوقات:  ${GREEN}pm2 logs${NC}"
