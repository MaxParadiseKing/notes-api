# 📝 Notes API

RESTful API для управления заметками с аутентификацией.  
Построен на **Node.js**, **Express**, **TypeScript** и **PostgreSQL**.

[![Express](https://img.shields.io/badge/Express-4.x-blue?style=flat-square&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-✔-blue?style=flat-square&logo=docker)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=flat-square&logo=json-web-tokens)](https://jwt.io/)

---

## 🚀 Быстрый старт (Docker)

```bash
git clone https://github.com/MaxParadiseKing/notes-api.git
cd notes-api
docker-compose up -d
После запуска API доступно по адресу:
🔗 http://localhost:3000/api

📚 Swagger документация: http://localhost:3000/api-docs

📋 Функциональность
🔐 Аутентификация
Регистрация и вход (JWT)

Защита маршрутов (middleware)

✅ Управление заметками
CRUD операции

Пагинация (?page=1&limit=10)

Поиск по заголовку/содержанию (?search=текст)

Сортировка (?sortBy=title&order=asc)

Фильтр по статусу (?completed=true)

🛡️ Безопасность
Хеширование паролей (bcrypt)

JWT токены

Валидация данных

📚 Документация
Swagger UI (интерактивная документация)

🛠️ Технологии
Технология	Назначение
Node.js + Express	Сервер
TypeScript	Типизация
PostgreSQL	База данных
JWT + bcrypt	Аутентификация
Docker	Контейнеризация
Jest + Supertest	Тестирование
Swagger	Документация API

⚙️ Установка и запуск
Без Docker
bash
# 1. Установка зависимостей
npm install

# 2. Создай файл .env
cp .env.example .env

# 3. Создай базу данных
psql -U postgres -c "CREATE DATABASE notes_db;"

# 4. Запуск
npm run dev
С Docker
bash
docker-compose up -d

🧪 Тестирование
bash
npm test
Результат: 14 тестов, все проходят ✅

📡 API Эндпоинты
🔐 Аутентификация
Метод	Эндпоинт	Описание
POST	/api/auth/register	Регистрация
POST	/api/auth/login	Вход
✅ Заметки (требуется токен)
Метод	Эндпоинт	Описание
GET	/api/notes	Все заметки (пагинация, поиск, сортировка)
GET	/api/notes/{id}	Получить заметку по ID
POST	/api/notes	Создать заметку
PUT	/api/notes/{id}	Обновить заметку
DELETE	/api/notes/{id}	Удалить заметку
📊 Примеры запросов
Регистрация
bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","email":"ivan@mail.com","password":"123456"}'
Логин
bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ivan@mail.com","password":"123456"}'
Создать заметку
bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <токен>" \
  -d '{"title":"Моя первая заметка","content":"Привет, мир!"}'

Получить заметки с пагинацией и поиском
bash
curl "http://localhost:3000/api/notes?page=1&limit=5&search=заметка&sortBy=created_at&order=desc"

📁 Структура проекта
text
notes-api/
├── src/
│   ├── config/       # Настройки (БД, Swagger)
│   ├── controllers/  # Обработчики запросов
│   ├── middleware/   # Auth middleware
│   ├── models/       # Работа с БД (SQL)
│   ├── routes/       # Маршруты API
│   ├── tests/        # Тесты (Jest)
│   ├── utils/        # Утилиты (AppError)
│   └── app.ts        # Точка входа
├── init-db/          # SQL скрипты для инициализации БД
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md

📄 Лицензия
MIT

Автор: MaxParadiseKing