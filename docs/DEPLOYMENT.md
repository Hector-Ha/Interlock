# Interlock Deployment Guide (EC2 + GHCR)

## Prerequisites

- EC2 instance (Ubuntu recommended)
- Docker 24+ and Docker Compose plugin
- GitHub Container Registry (GHCR) access token with `read:packages`

## Environment Variables

Create a `.env` file next to `docker-compose.prod.yml` on the EC2 host.

### Required

| Variable         | Description                                 |
| ---------------- | ------------------------------------------- |
| `DB_PASSWORD`    | Postgres password                           |
| `JWT_SECRET`     | Min 32 char secret for JWT                  |
| `ENCRYPTION_KEY` | 32 char key for encryption                  |
| `GHCR_USERNAME`  | GitHub username or org                      |
| `GHCR_PAT`       | GitHub PAT with `read:packages`             |
| `CLIENT_URL`     | Vercel frontend URL (CORS + redirects)      |

### Optional / Common

| Variable          | Description                   | Default |
| ----------------- | ----------------------------- | ------- |
| `DB_USER`         | Postgres user                 | interlock |
| `DB_NAME`         | Postgres database             | interlock |
| `IMAGE_TAG`       | Image tag to pull             | latest |
| `PLAID_*`         | Plaid configuration           | - |
| `DWOLLA_*`        | Dwolla configuration          | - |
| `SENDGRID_*`      | SendGrid configuration        | - |
| `SENTRY_DSN`      | Sentry error tracking         | - |
| `ENABLE_LOGS`     | Verbose logging               | false |

## EC2 Setup

```bash
# Install Docker (Ubuntu)
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable --now docker

# Install Docker Compose plugin
sudo apt-get install -y docker-compose-plugin
```

## Deploy Steps

1. **Clone repository on EC2**

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
cp .env.example .env
# Edit .env with production values
```

2. **Pull and start services**

```bash
bash deploy.sh
```

That script will:
- Log in to GHCR
- Pull the latest image
- Run `prisma migrate deploy`
- Start containers with Docker Compose

## Health Check

```bash
curl http://localhost:8080/api/v1/health
```

## Logs

```bash
docker compose -f docker-compose.prod.yml logs -f server
```

## Rollback

Set `IMAGE_TAG` in `.env` to a previous SHA tag and re-run:

```bash
bash deploy.sh
```

---

_Last updated: February 8, 2026_
