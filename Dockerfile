# 1. Берем легкий образ Node.js 20
FROM node:20-alpine

# 2. Рабочая папка внутри контейнера
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем только production зависимости
RUN npm ci --only=production

# 5. Копируем скомпилированный код
COPY dist ./dist

# 6. Открываем порт 3000
EXPOSE 3000

# 7. Команда запуска
CMD ["node", "dist/server.js"]