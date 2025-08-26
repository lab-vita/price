# 1. Используем Node.js 20 (подходит для Next.js 13+)
FROM node:24-alpine3.21 AS builder

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь проект
COPY . .

# 6. Собираем Next.js проект
RUN npm run build

# 7. Стартовый контейнер
FROM node:24-alpine3.21 AS runner
WORKDIR /app

# Копируем только нужное из build этапа
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/app ./app

RUN npm install

# Указываем порт
ENV PORT=3000
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]
