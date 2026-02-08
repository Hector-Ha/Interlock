#!/bin/bash
# Interlock - Production Deploy Script
# Pulls the latest pre-built image from GHCR and restarts the server.
# Usage: bash deploy.sh

set -e

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Create it from .env.example first."
  exit 1
fi

source "$ENV_FILE"

if [ -z "$GHCR_USERNAME" ] || [ -z "$GHCR_PAT" ]; then
  echo "ERROR: GHCR_USERNAME and GHCR_PAT must be set in $ENV_FILE"
  exit 1
fi

echo "==> Logging in to GitHub Container Registry..."
echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

echo "==> Pulling latest server image..."
docker compose -f docker-compose.prod.yml pull server

echo "==> Running database migrations..."
docker compose -f docker-compose.prod.yml run --rm server bunx prisma migrate deploy

echo "==> Restarting containers..."
docker compose -f docker-compose.prod.yml up -d

echo "==> Deploy complete. Checking health..."
sleep 5
docker compose -f docker-compose.prod.yml ps
