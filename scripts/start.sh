#!/usr/bin/env bash
set -euo pipefail

# Usage: sudo ./scripts/setup_and_deploy.sh --domain your-domain.com --email admin@your-domain.com [--no-certbot]

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

echo "[1/7] Updating system and installing base packages" 
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg ufw fail2ban nginx

echo "[2/7] Configure UFW"
ufw allow OpenSSH || true
ufw allow 80 || true
ufw allow 443 || true
echo "y" | ufw enable || true

echo "[3/7] Install Docker Engine and Compose"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "[4/7] Build and start docker compose stack"
docker compose version || { echo "docker compose not found"; exit 1; }

# Build image
npm run docker:build

# Start services
docker compose up -d

echo "[5/7] Run Prisma migrations"
docker compose exec -T web npm run db:deploy || true

echo "[6/7] Configure Nginx reverse proxy for $DOMAIN"
NGINX_SITE=/etc/nginx/sites-available/stp-service
cat > "$NGINX_SITE" <<EOF
server {
  server_name $DOMAIN;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location ~* \.(js|css|png|svg|jpg|jpeg|webp|woff2)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
  }

  listen 80;
}
EOF

ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/stp-service
nginx -t
systemctl reload nginx

if [[ $USE_CERTBOT -eq 1 ]]; then
  if [[ -z "$CERTBOT_EMAIL" ]]; then
    echo "--email is required when using certbot"; exit 1
  fi
  echo "[7/7] Issue TLS certificate via certbot"
  apt-get install -y certbot python3-certbot-nginx
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL"
else
  echo "[7/7] Skipping certbot per --no-certbot"
fi

echo "Done. Healthcheck: curl http://127.0.0.1:3000/api/health"


