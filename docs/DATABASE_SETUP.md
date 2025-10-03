# 🗄️ Настройка базы данных

## Быстрый старт

### 1. Установка PostgreSQL

#### Windows
```bash
# Скачать и установить с официального сайта
https://www.postgresql.org/download/windows/

# Или через Chocolatey
choco install postgresql
```

#### macOS
```bash
# Через Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Создание базы данных

```bash
# Подключиться к PostgreSQL
sudo -u postgres psql

# Создать базу данных
CREATE DATABASE stp_service;

# Создать пользователя (опционально)
CREATE USER stp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stp_service TO stp_user;

# Выйти
\q
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/stp_service?schema=public"

# Или с кастомным пользователем
# DATABASE_URL="postgresql://stp_user:your_password@localhost:5432/stp_service?schema=public"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Environment
NODE_ENV="development"
```

### 4. Применение схемы и заполнение данными

```bash
# Генерация Prisma Client
npm run db:generate

# Применение схемы к базе данных
npm run db:push

# Заполнение тестовыми данными
npm run db:seed
```

### 5. Запуск проекта

```bash
npm run dev
```

## 🔧 Полезные команды

### Управление базой данных
```bash
# Генерация клиента после изменения схемы
npm run db:generate

# Применение изменений схемы
npm run db:push

# Создание и применение миграций
npm run db:migrate

# Заполнение данными
npm run db:seed

# Сброс базы данных
npm run db:reset

# Открыть Prisma Studio (GUI для БД)
npm run db:studio
```

### Работа с миграциями
```bash
# Создать новую миграцию
npx prisma migrate dev --name add_new_field

# Применить миграции в продакшене
npx prisma migrate deploy

# Посмотреть статус миграций
npx prisma migrate status
```

## 📊 Структура базы данных

### Основные таблицы
- `categories` - Категории товаров (иерархические)
- `brands` - Бренды производителей
- `products` - Товары с полной информацией
- `product_specifications` - Характеристики товаров
- `product_tags` - Теги товаров
- `product_tag_relations` - Связи товаров и тегов
- `orders` - Заказы клиентов
- `order_items` - Позиции заказов
- `contact_requests` - Заявки обратной связи

### Связи
```
Category 1:N Product
Brand 1:N Product
Product 1:N ProductSpecification
Product N:M ProductTag (через ProductTagRelation)
Order 1:N OrderItem
Product 1:N OrderItem
```

## 🚀 Доступ к админ панели

После настройки базы данных:

1. Запустите проект: `npm run dev`
2. Откройте: `http://localhost:3000/admin`
3. Функции:
   - Просмотр заявок обратной связи
   - Управление товарами
   - Мониторинг остатков

## 🔍 Отладка

### Проверка подключения
```bash
# Проверить подключение к БД
npx prisma db pull

# Посмотреть схему
npx prisma db seed --preview-feature
```

### Логи Prisma
```typescript
// В коде для отладки
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### Типичные ошибки

#### "database does not exist"
```bash
# Создать базу данных
createdb stp_service
```

#### "password authentication failed"
```bash
# Проверить пароль в DATABASE_URL
# Или сбросить пароль пользователя postgres
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
```

#### "relation does not exist"
```bash
# Применить схему
npm run db:push
```

## 📝 Резервное копирование

### Создание бэкапа
```bash
pg_dump -h localhost -U postgres -d stp_service > backup.sql
```

### Восстановление из бэкапа
```bash
psql -h localhost -U postgres -d stp_service < backup.sql
```

## 🔒 Безопасность

### Продакшен настройки
- Используйте сильные пароли
- Ограничьте доступ к базе данных
- Включите SSL соединения
- Регулярно обновляйте PostgreSQL
- Настройте файрвол

### Переменные окружения
```env
# Продакшен
DATABASE_URL="postgresql://user:strong_password@db.example.com:5432/stp_service?sslmode=require"
```
