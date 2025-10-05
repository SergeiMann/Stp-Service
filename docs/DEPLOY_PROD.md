# Прод-деплой на одной ВМ (Ubuntu LTS + Docker Compose)

Цель: поднять сайт и БД на одной ВМ, с изоляцией сервисов (web + Postgres) и автоматическими бэкапами.

## Какую ОС выбрать
- Рекомендую: Ubuntu Server 22.04 LTS или 24.04 LTS.
- Почему: самая распространённая, свежие пакеты Docker/Nginx/Certbot, много документации.

## Подготовка ОС (под sudo-пользователем)
```bash
# Обновление пакетов и базовые тулзы
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg ufw fail2ban nginx

# Включить firewall (UFW)
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
echo "y" | sudo ufw enable
sudo ufw status

# Fail2ban (базовая защита SSH)
sudo systemctl enable --now fail2ban

# Установка Docker Engine + Compose plugin
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
# Перелогиньтесь, чтобы группа docker применилась
```

Опционально: настроить часовой пояс и автоматические обновления безопасности.

## Переменные окружения
На ВМ создайте файл `.env.production` рядом с `docker-compose.yml`:
```
NEXTAUTH_SECRET=замени_на_длинную_случайную_строку
NEXT_PUBLIC_SITE_URL=https://stp-service.com
ADMIN_API_KEY=секрет_для_admin_API
```

Примечания:
- `DATABASE_URL` для приложения задаётся внутри `docker-compose.yml` и указывает на контейнер `db`.
- Схема БД: PostgreSQL (см. `prisma/schema.prisma`).

## Docker Compose стек (web + db + backup)
В репозитории уже есть `docker-compose.yml` со службами:
- `db`: PostgreSQL 16 (логин `stp`, пароль `change_me`, БД `stp`). Смените пароль на свой.
- `web`: Next.js (standalone). Переменные берутся из `.env.production` и `docker-compose.yml`.
- `backup`: ежедневные дампы БД в том `pgbackups` (по умолчанию в 03:00).

## Сборка и запуск
```bash
# В каталоге проекта
npm run docker:build
npm run docker:up

# Применить миграции Prisma внутри контейнера web
docker compose exec web npm run db:deploy

# Healthcheck
curl http://127.0.0.1:3000/api/health
```

### Автоподготовка и деплой одной командой
```bash
sudo bash ./scripts/setup_and_deploy.sh --domain stp-service.com --email admin@stp-service.com
```
Флаги:
- `--domain` — домен (обязательно)
- `--email` — email для Certbot (обязательно, если не передан `--no-certbot`)
- `--no-certbot` — пропустить выдачу TLS-сертификата

## Nginx реверс-прокси + HTTPS
Файл `/etc/nginx/sites-available/stp-service`:
```nginx
server {
  server_name stp-service.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # Статика: долгий кэш
  location ~* \.(js|css|png|svg|jpg|jpeg|webp|woff2)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
  }

  listen 80;
}
```
Активация и перезагрузка:
```bash
sudo ln -s /etc/nginx/sites-available/stp-service /etc/nginx/sites-enabled/stp-service
sudo nginx -t && sudo systemctl reload nginx
```
TLS с Certbot:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d stp-service.com -m admin@stp-service.com --agree-tos -n
```

## Управление и обновления
```bash
# Обновить образ/приложение
npm run docker:build
docker compose up -d --no-deps web
docker compose exec web npm run db:deploy

# Перезапуск/стоп
docker compose restart web
docker compose down

# Логи
docker compose logs -f web
docker compose logs -f db
```

## Доступ к заявкам (только для админа)
```bash
curl -H "x-admin-key: $ADMIN_API_KEY" http://127.0.0.1:3000/api/contact
```

## Кратко
- Ubuntu LTS → UFW/fail2ban → Docker/Compose → `docker:build`/`docker:up` → миграции → Nginx → Certbot.
