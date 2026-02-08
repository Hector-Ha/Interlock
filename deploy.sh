#!/usr/bin/env bash
# Interlock - Production Deploy Script (EC2)
# Pulls the latest pre-built image from GHCR and restarts the server.
# Usage: bash deploy.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Create it from .env.example first."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [ -z "${GHCR_USERNAME:-}" ] || [ -z "${GHCR_PAT:-}" ]; then
  echo "ERROR: GHCR_USERNAME and GHCR_PAT must be set in $ENV_FILE"
  exit 1
fi

echo "==> Logging in to GitHub Container Registry..."
echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

echo "==> Pulling latest server image..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" pull server

echo "==> Running database migrations..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" run --rm server bunx prisma migrate deploy

echo "==> Restarting containers..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d

echo "==> Deploy complete. Checking health..."
sleep 5
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" ps
