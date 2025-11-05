#!/usr/bin/env bash
set -euo pipefail

# Usage: sudo ./scripts/start.sh --domain your-domain.com --email admin@your-domain.com [--no-certbot]

DOMAIN=""
CERTBOT_EMAIL=""
USE_CERTBOT=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN="$2"; shift 2 ;;
    --email)
      CERTBOT_EMAIL="$2"; shift 2 ;;
    --no-certbot)
      USE_CERTBOT=0; shift 1 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ -z "$DOMAIN" ]]; then
  echo "--domain is required"; exit 1
fi

# Проверка запуска под sudo
if [[ $EUID -ne 0 ]]; then
  echo "Ошибка: скрипт должен быть запущен с sudo" >&2
  exit 1
fi

# Проверка ОС
if [[ ! -f /etc/os-release ]]; then
  echo "Ошибка: не удалось определить ОС" >&2
  exit 1
fi

source /etc/os-release
if [[ "$ID" != "ubuntu" ]]; then
  echo "Предупреждение: скрипт предназначен для Ubuntu, текущая ОС: $ID" >&2
  read -p "Продолжить? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Проверка, что скрипт запущен из корня проекта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

if [[ ! -f docker-compose.yml ]] || [[ ! -f Dockerfile ]] || [[ ! -f package.json ]]; then
  echo "Ошибка: скрипт должен быть запущен из корня проекта (где есть docker-compose.yml, Dockerfile, package.json)" >&2
  exit 1
fi

echo "[1/7] Updating system and installing base packages" 
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg ufw fail2ban nginx
systemctl enable --now fail2ban || true

echo "[2/7] Configure UFW"
ufw allow OpenSSH || true
ufw allow 80 || true
ufw allow 443 || true
echo "y" | ufw enable || true

echo "[3/7] Install Docker Engine and Compose"
# Проверка, установлен ли Docker
if ! command -v docker &> /dev/null; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  echo "Docker уже установлен, пропускаем"
fi

# Добавляем текущего пользователя в группу docker (если не root)
if [[ -n "${SUDO_USER:-}" ]]; then
  usermod -aG docker "$SUDO_USER" || true
  echo "Пользователь $SUDO_USER добавлен в группу docker (перелогиньтесь для применения)"
fi

echo "[4/7] Build and start docker compose stack"
docker compose version || { echo "docker compose not found"; exit 1; }

# Ensure env file exists
if [[ ! -f .env.production ]]; then
  echo "ERROR: .env.production не найден. Создайте файл рядом с docker-compose.yml" >&2
  echo "Пример содержимого см. в docs/DEPLOY_PROD.md" >&2
  exit 1
fi

# Проверка, что порт 3000 свободен
if netstat -tuln 2>/dev/null | grep -q ":3000 " || ss -tuln 2>/dev/null | grep -q ":3000 "; then
  echo "Предупреждение: порт 3000 уже занят. Убедитесь, что старый контейнер остановлен" >&2
  read -p "Продолжить? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Build & start services (db -> migrate -> seed -> web)
docker compose up -d --build

echo "[5/7] Wait for web health"
# Установка curl если не установлен
if ! command -v curl &> /dev/null; then
  apt-get install -y curl
fi

for i in {1..30}; do
  if curl -fsS http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    echo "Web is healthy"
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Предупреждение: веб-сервис не отвечает после 60 секунд. Проверьте логи: docker compose logs web" >&2
  fi
  sleep 2
done

echo "[6/7] Configure Nginx reverse proxy for $DOMAIN"
NGINX_SITE=/etc/nginx/sites-available/stp-service
cat > "$NGINX_SITE" <<EOF
server {
  server_name $DOMAIN;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }

  # Статика: долгий кэш через прокси
  location ~* \.(js|css|png|svg|jpg|jpeg|webp|woff2|ico)$ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  listen 80;
}
EOF

# Disable default site to avoid conflicts
rm -f /etc/nginx/sites-enabled/default || true
ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/stp-service
nginx -t
systemctl reload nginx

if [[ $USE_CERTBOT -eq 1 ]]; then
  if [[ -z "$CERTBOT_EMAIL" ]]; then
    echo "--email is required when using certbot"; exit 1
  fi
  echo "[7/7] Issue TLS certificate via certbot"
  apt-get install -y certbot python3-certbot-nginx || true
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL" || {
    echo "Предупреждение: не удалось получить SSL сертификат. Проверьте:" >&2
    echo "  - DNS запись для домена $DOMAIN указывает на этот сервер" >&2
    echo "  - Порт 80 открыт в firewall" >&2
    echo "  - Можно запустить certbot позже: sudo certbot --nginx -d $DOMAIN" >&2
  }
else
  echo "[7/7] Skipping certbot per --no-certbot"
fi

echo ""
echo "=========================================="
echo "Развертывание завершено!"
echo "=========================================="
echo "Домен: $DOMAIN"
echo "Путь проекта: $PROJECT_ROOT"
echo "Healthcheck: curl http://127.0.0.1:3000/api/health"
echo "Логи: docker compose logs -f web"
echo "Статус: docker compose ps"
echo ""
if [[ -n "${SUDO_USER:-}" ]]; then
  echo "ВАЖНО: Перелогиньтесь для применения группы docker"
fi


