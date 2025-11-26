# --- المرحلة 1: البناء (Build Stage) ---
# استخدام صورة Node لبناء التطبيق
FROM node:20-alpine AS build
WORKDIR /app

# نسخ الملفات وتثبيت التبعيات
COPY package*.json ./
RUN npm install

# نسخ ملفات المصدر وبناء ملفات الإنتاج
COPY . .
# أمر بناء تطبيق React (Vite)
RUN npm run build

# --- المرحلة 2: الإنتاج (Production Stage) ---
# استخدام صورة Nginx لخدمة الملفات الثابتة (أخف وأكثر كفاءة للإنتاج)
FROM nginx:alpine
# إزالة ملفات الإعدادات الافتراضية لـ Nginx
RUN rm /etc/nginx/conf.d/default.conf

# نسخ ملف إعداد Nginx المخصص (يجب أن يكون موجودًا في مجلد frontend/nginx.conf)
# إذا لم يكن موجودًا، يجب إنشاءه ليقوم بتوجيه الحركة
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# نسخ ملفات الإنتاج المُبنية من المرحلة الأولى إلى مجلد Nginx الافتراضي
COPY --from=build /app/dist /usr/share/nginx/html

# الكشف عن المنفذ القياسي (80)
EXPOSE 80

# أمر التشغيل (تشغيل Nginx في المقدمة)
CMD ["nginx", "-g", "daemon off;"]