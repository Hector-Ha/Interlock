# Interlock - A Modern Open Banking Experience

> **A modern and secure fintech application for bank account linking, transaction sync, and money transfers.**

## TL;DR

Interlock is a fintech monorepo that connects **Plaid** (banking data) and **Dwolla** (ACH payments) with a modern UI and secure backend. It's built with **Next.js 16 / React 19** on the frontend and **Express 5** on **Bun** on the backend, with **Prisma** + **PostgreSQL**.

The backend provides auth/session management, bank linking, transaction sync, ACH transfers, P2P transfers, notifications, webhooks, and metrics. The frontend includes full auth flows, dashboard, banks, transactions, transfers (internal + P2P), and settings/notifications.

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup Environment
# Create .env in server/ and .env.local in client/ (see Getting Started)

# 3. Run Development Server
bun run dev
```

## Project Stage

Interlock's core banking and user experience features are implemented; ongoing work focuses on polish, performance, and production hardening.

| Category                  | Backend     | Frontend    | Notes                                           |
| ------------------------- | ----------- | ----------- | ----------------------------------------------- |
| **Authentication**        | ✅ Complete | ✅ Complete | Sessions, refresh tokens, account lockout       |
| **Email Verification**    | ✅ Complete | ✅ Complete | Verify + resend flows                           |
| **Password Reset**        | ✅ Complete | ✅ Complete | Forgot + reset flows                            |
| **Plaid Integration**     | ✅ Complete | ✅ Complete | Link, exchange, update mode, balance sync       |
| **Dwolla Integration**    | ✅ Complete | ✅ Complete | Funding sources, transfers, webhooks            |
| **Bank Management**       | ✅ Complete | ✅ Complete | View linked banks and details                   |
| **Transactions**          | ✅ Complete | ✅ Complete | Full history with filters & visualization       |
| **Transfers**             | ✅ Complete | ✅ Complete | Internal ACH + status                           |
| **P2P Transfers**         | ✅ Complete | ✅ Complete | Recipient search + P2P flows                    |
| **Notifications**         | ✅ Complete | ✅ Complete | In-app notifications + preferences              |
| **Dashboard**             | ✅ Complete | ✅ Complete | Balance, banks list, recent transactions        |
| **Settings**              | ✅ Complete | ✅ Complete | Profile, security, notification settings        |
| **Observability/Metrics** | ✅ Complete | N/A         | Sentry + `/api/v1/metrics`                      |
| **Security**              | ✅ Complete | N/A         | Rate limiting, encryption, webhook verification |

## Roadmap

### Foundation (Complete)

- [x] Auth System with PII Encryption
- [x] Basic Plaid & Dwolla Handshakes
- [x] Security Hardening (Rate Limits, Headers)
- [x] Standardized Logging (Pino)

### Core Banking (Complete)

- [x] Account Details with Real-time Balances
- [x] Transaction History with Sync
- [x] ACH Transfers: Initiate & Monitor
- [x] Transfer Cancellation
- [x] Webhook Idempotency

### User Experience (Complete)

| Feature                   | Backend | Frontend |
| ------------------------- | ------- | -------- |
| Dashboard UI              | ✅      | ✅       |
| Sign In / Sign Up         | ✅      | ✅       |
| My Banks Page             | ✅      | ✅       |
| Transactions History Page | ✅      | ✅       |
| Transfer Funds Page       | ✅      | ✅       |
| P2P Transfers             | ✅      | ✅       |
| Notifications             | ✅      | ✅       |
| User Settings Page        | ✅      | ✅       |
| Password Reset Flow       | ✅      | ✅       |
| Email Verification        | ✅      | ✅       |

### Advanced Features (Planned)

- [ ] Recurring Transfers
- [ ] Transfer Limits
- [ ] Push Notifications
- [ ] API Documentation (Swagger)

## Known Limitations

1.  **Transaction Schema**: `destinationBankId` is derived from Dwolla metadata rather than a strict database relation.
2.  **Localization**: Currency and date formatting uses US locales (`en-US`).
3.  **Sandbox Defaults**: Plaid/Dwolla default to sandbox; production is supported via env config.
4.  **Redis**: Docker Compose starts Redis, but the app does not currently use it.
5.  **Build Scripts**: `server` has no `build` script, so root `bun run build` and `server` Dockerfile production builds will fail until added.

## Architecture

Interlock is a full-stack monorepo:

- **Frontend**: Next.js 16.1, React 19.2, TypeScript, Tailwind CSS 4, Zustand, Radix UI, Chart.js, Framer Motion
- **Backend**: Express 5.2, Bun Runtime, Prisma ORM, PostgreSQL
- **Integrations**: Plaid (Banking), Dwolla (Payments)
- **Security**: AES-256-GCM encryption (PBKDF2-derived keys), bcrypt, JWT + refresh token rotation
- **Observability**: Sentry (client + server), Pino logging, `/api/v1/metrics`
- **Email**: SendGrid (Transactional)
- **Testing**: Vitest, React Testing Library, Supertest

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+ (recommended)
- PostgreSQL 16+ (Docker Compose uses Postgres 18 for local dev)
- Docker + Docker Compose (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd interlock
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up Environment Variables**

   Create env files for the server and client:

   **`server/.env`**

   ```env
   # Server
   PORT=8080
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   # Required
   DATABASE_URL=postgresql://user:pass@localhost:5432/interlock
   JWT_SECRET=your-32-char-min-secret
   ENCRYPTION_KEY=32-character-key-here

   # Plaid (Sandbox by default)
   PLAID_CLIENT_ID=your-client-id
   PLAID_SECRET=your-secret
   PLAID_ENV=sandbox
   PLAID_PRODUCTS=auth,transactions,identity
   PLAID_COUNTRY_CODES=US

   # Dwolla (Sandbox by default)
   DWOLLA_KEY=your-key
   DWOLLA_SECRET=your-secret
   DWOLLA_ENV=sandbox
   DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
   DWOLLA_WEBHOOK_SECRET=your-webhook-secret

   # Email
   SENDGRID_API_KEY=your-sendgrid-key
   SENDGRID_SENDER_EMAIL=your-sender@domain.com

   # Monitoring
   SENTRY_DSN=your-sentry-dsn
   ENABLE_LOGS=false
   ```

   **`client/.env.local`**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

   **Key generation notes**:

   ```bash
   # 32-char JWT secret (min 32 chars)
   openssl rand -hex 32

   # 32-character encryption key
   openssl rand -hex 16
   ```

4. **Initialize Database**

   ```bash
   cd server
   bun run prisma:generate
   bunx prisma migrate dev
   ```

5. **Start Development**

   ```bash
   # From root
   bun run dev
   ```

   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080`

### Docker Support

```bash
# Local dev containers (Postgres + Redis + server)
docker compose up -d

# Production compose
docker compose -f docker-compose.prod.yml up -d
```

## Security Features

| Feature            | Implementation                                       |
| ------------------ | ---------------------------------------------------- |
| PII Encryption     | AES-256-GCM for addresses, DOB, SSN                  |
| Password Security  | bcrypt with salt, account lockout (5 attempts)       |
| Session Management | JWT (15-min) + Refresh tokens (30-day) with rotation |
| Webhook Security   | HMAC-SHA256 signature verification                   |
| API Protection     | Rate limiting on auth and API endpoints              |
| Secure Headers     | Helmet, CORS, SameSite cookies                       |
| Audit Trail        | Security event logging via audit logs                |

## Testing

```bash
# Server tests
cd server && bun test

# Client tests
cd client && bun test
```

## Contributing

This is a private project. For questions or issues, please contact the maintainers.

## License

GPL-3.0
