# Network Activity Monitoring Service

Веб-сервис мониторинга сетевой активности пользователей на базе NestJS и TypeORM с интеграцией двухфакторной аутентификации Multifactor.ru.

## Возможности

- Массовая загрузка пользователей через Excel файлы
- Валидация данных пользователей с генерацией отчетов об ошибках
- Двухфакторная аутентификация через Multifactor.ru
- RESTful API для управления пользователями и файлами
- Telegram Bot интеграция

## Предварительные требования

- Node.js 18+ 
- PostgreSQL 14+
- TypeScript 4.8+
- Redis (для кэширования сессий)

## Установка

### 1. Клонирование репозитория

git clone <repository-url>
cd network-monitoring-service

text

### 2. Установка зависимостей

npm install

text

### 3. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

cp .env.example .env

text

Настройте следующие переменные:

Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=network_monitoring

JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

Multifactor.ru
MULTIFACTOR_API_KEY=your_api_key
MULTIFACTOR_API_SECRET=your_api_secret
MULTIFACTOR_CALLBACK_URL=http://localhost:3000/auth/multifactor/callback

Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DEST=./uploads

text

### 4. Настройка базы данных

Создание миграций
npm run migration:generate -- src/migration/InitialMigration

Запуск миграций
npm run migration:run

text

### 5. Запуск приложения

Разработка
npm run start:dev

Продакшн
npm run build
npm run start:prod

text

## API Эндпоинты

### Управление пользователями

- `GET /api/admin/users/uploads` - Получить список файлов пользователя
- `POST /api/admin/users/upload` - Загрузить файл с пользователями
- `GET /api/admin/users/download/:id` - Скачать файл с ошибками

### Аутентификация

- `POST /auth/login` - Вход в систему
- `POST /auth/multifactor/callback` - Callback для двухфакторной аутентификации
- `GET /auth/logout` - Выход из системы

## Администрирование

### Конфигурация Multifactor.ru

1. Зарегистрируйтесь на https://multifactor.ru
2. Создайте новый ресурс в личном кабинете
3. Получите API Key и API Secret в разделе "Ресурсы" → "Параметры"
4. Укажите Callback URL: `http://your-domain/auth/multifactor/callback`

### Формат файла для загрузки пользователей

Excel файл должен содержать следующие колонки:
- `A`: Логин пользователя
- `B`: Email
- `C`: Роль (admin, user, moderator)
- `D`: Регион
- `E`: Телефон (опционально)

### Мониторинг и логи

Логи приложения доступны в:
- `./logs/app.log` - общие логи приложения
- `./logs/error.log` - логи ошибок
- `./logs/upload.log` - логи загрузки файлов

### Резервное копирование

Создание бэкапа БД
pg_dump -h localhost -U postgres network_monitoring > backup.sql

Восстановление из бэкапа
psql -h localhost -U postgres network_monitoring < backup.sql

text

## Разработка

### Тестирование

Юнит тесты
npm run test

E2E тесты
npm run test:e2e

Покрытие кода
npm run test:cov

text

### Линтинг и форматирование

npm run lint
npm run format

text

## Telegram Bot команды

- `/start` - Начать работу с ботом
- `/users` - Получить статистику пользователей
- `/upload <user_id>` - Загрузить файл для пользователя
- `/status` - Статус системы

## Устранение неполадок

### Ошибки подключения к БД

1. Проверьте настройки подключения в `.env`
2. Убедитесь, что PostgreSQL запущен
3. Проверьте права доступа пользователя БД

### Проблемы с Multifactor.ru

1. Проверьте правильность API ключей
2. Убедитесь, что Callback URL настроен корректно
3. Проверьте логи на наличие ошибок API

### Ошибки загрузки файлов

1. Проверьте размер файла (максимум 10MB)
2. Убедитесь, что формат файла .xlsx
3. Проверьте права на запись в директорию uploads

## Поддержка

Для получения поддержки создайте issue в GitHub репозитории или обратитесь к команде разработки.
