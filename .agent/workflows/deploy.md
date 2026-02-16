---
description: كيفية رفع تعديلات الموقع على GitHub والسيرفر
---

# سير العمل للنشر

## أول مرة (إعداد السيرفر)

### 1. على السيرفر (SSH)

```bash
cd /var/www/vhosts/muhitsolution.com/httpdocs
git clone https://github.com/Wael-Ajam/Muhit.git .
chmod +x setup.sh update.sh
bash setup.sh
```

### 2. إعداد nginx بـ Plesk

- Domains → muhitsolution.com → Apache & nginx Settings
- انسخ محتوى `nginx-plesk.conf` بخانة **Additional nginx directives**

---

## كل تحديث بعدها

### 1. على الكمبيوتر

// turbo-all

```bash
git add -A
git commit -m "وصف التعديل"
git push origin main
```

### 2. على السيرفر (SSH)

```bash
cd /var/www/vhosts/muhitsolution.com/httpdocs
git pull origin main
bash update.sh
```

---

## ملاحظات

- الموقع: https://muhitsolution.com/
- Frontend: port 3000 (Next.js SSR)
- Backend API: port 3001 (NestJS)
- مراقبة: `pm2 status` / `pm2 logs`
