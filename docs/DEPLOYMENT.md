# Interlock Deployment Guide

## Prerequisites

- Docker 24.0+
- Docker Compose 2.0+
- PostgreSQL 16+ (if not using Docker)
- Bun 1.0+ (for development)

## Environment Variables

### Required (Server)

| Variable          | Description                  | Example                               |
| ----------------- | ---------------------------- | ------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`      | Min 32 char secret for JWT   | Generate with `openssl rand -hex 32`  |
| `ENCRYPTION_KEY`  | 32 char key for encryption   | Generate with `openssl rand -hex 16`  |
| `PLAID_CLIENT_ID` | Plaid API client ID          | From Plaid dashboard                  |
| `PLAID_SECRET`    | Plaid API secret             | From Plaid dashboard                  |
| `DWOLLA_KEY`      | Dwolla API key               | From Dwolla dashboard                 |
| `DWOLLA_SECRET`   | Dwolla API secret            | From Dwolla dashboard                 |

### Optional

| Variable           | Description               | Default |
| ------------------ | ------------------------- | ------- |
| `SENTRY_DSN`       | Sentry error tracking DSN | -       |
| `SENDGRID_API_KEY` | SendGrid email API key    | -       |
| `ENABLE_LOGS`      | Enable verbose logging    | `false` |

## Deployment Steps

### 1. Clone and Configure

```bash
git clone https://github.com/your-org/interlock.git
cd interlock
cp .env.example .env
# Edit .env with production values
```

### 2. Generate Secrets

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate ENCRYPTION_KEY
openssl rand -hex 16
```

### 3. Build Docker Images

```bash
docker compose -f docker-compose.prod.yml build
```

### 4. Run Database Migrations

```bash
docker compose -f docker-compose.prod.yml run --rm server bunx prisma migrate deploy
```

### 5. Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 6. Verify Deployment

```bash
curl http://localhost:8080/api/v1/health
# Should return: {"status":"healthy",...}
```

## Health Endpoints

| Endpoint             | Purpose                   |
| -------------------- | ------------------------- |
| `GET /api/v1/health` | Full health with DB check |
| `GET /api/v1/ready`  | Readiness probe           |
| `GET /api/v1/live`   | Liveness probe            |

## Rollback Procedure

1. Identify previous working image tag
2. Update docker-compose.prod.yml with previous tag
3. Restart: `docker compose -f docker-compose.prod.yml up -d`
4. If database rollback needed:
   ```bash
   docker compose run --rm server bunx prisma migrate reset --skip-seed
   ```

## Monitoring

- **Health**: `GET /api/v1/health`
- **Metrics**: `GET /api/v1/metrics`
- **Sentry**: Configure `SENTRY_DSN` for error tracking
- **Logs**: `docker compose logs -f server`

## Troubleshooting

### Database Connection Failed

```bash
# Check Postgres is running
docker compose ps postgres

# Check connection
docker compose exec postgres pg_isready
```

### Server Won't Start

```bash
# Check logs
docker compose logs server

# Verify env vars
docker compose run --rm server env | grep -E "(DATABASE|JWT|PLAID)"
```

---

_Last updated: January 16, 2026_
