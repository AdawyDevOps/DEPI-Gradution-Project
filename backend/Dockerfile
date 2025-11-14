FROM node:18-alpine

WORKDIR /app

# نسخ package files أولاً للاستفادة من Docker cache
COPY package*.json ./
RUN npm install

# نسخ باقي الملفات
COPY . .

# إنشاء مجلد للـ logs
RUN mkdir -p logs

# التعرض للمنفذ
EXPOSE 5000

# أمر التشغيل
CMD ["npm", "run", "dev"]
