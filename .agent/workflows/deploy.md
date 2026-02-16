---
description: كيفية رفع تعديلات الموقع على GitHub والسيرفر
---

# سير العمل للتعديلات

## الخطوات:

### 1. عمل التعديلات

- عدل الملفات المطلوبة في المشروع

### 2. بناء المشروع

```bash
npm run build
```

هذا يولد الملفات الثابتة في مجلد `out/`

### 3. رفع التعديلات فقط (بدون force)

```bash
cd out
git add .
git commit -m "وصف التعديل"
git push
```

**ملاحظة:** نستخدم `git push` العادي - بدون `-f` - لرفع التغييرات فقط

### 4. المستخدم يعمل Pull على السيرفر

```bash
cd /var/www/vhosts/muhitsolution.com/httpdocs
git pull origin main
```

---

## ملاحظات مهمة:

- **لا نستخدم force push** إلا إذا في مشكلة كبيرة
- الموقع على: https://muhitsolution.com/
- النسخة العربية: /ar/
- النسخة الإنجليزية: /en/
- الهوست: Plesk
- المجلد: httpdocs
