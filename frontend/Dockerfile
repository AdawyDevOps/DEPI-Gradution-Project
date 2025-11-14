FROM node:20-alpine

WORKDIR /app

# نسخ package files أولاً
COPY package*.json ./
RUN npm install

# نسخ باقي الملفات
COPY . .

# التعرض للمنفذ
EXPOSE 5173

# أمر التشغيل
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
