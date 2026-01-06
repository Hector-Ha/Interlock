# Interlock - A Modern Open Banking Experience

> **A modern and secure fintech application for bank account linking and ACH money transfers.**

## TL;DR

Interlock is a fintech MVP that bridges **Plaid** (banking data) and **Dwolla** (ACH payments). It's a full-stack monorepo built with **Next.js 16** (Frontend) and **Express 5** (Backend), running on the **Bun** runtime.

Currently in **Phase 3**, the backend is feature-complete with full authentication, bank management, transaction syncing, and ACH transfers. The frontend has core dashboard functionality with additional pages in development.

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup Environment
# Create .env files in root and server/ (see Getting Started for details)

# 3. Run Development Server
bun run dev
```

## Project Stage: Phase 3 (User Experience)

The project has completed **Phase 2** (Core Banking APIs) and entered **Phase 3** (User Experience & Frontend).

| Category               | Backend     | Frontend    | Notes                                     |
| ---------------------- | ----------- | ----------- | ----------------------------------------- |
| **Authentication**     | ✅ Complete | ✅ Complete | Full flow including password reset        |
| **Plaid Integration**  | ✅ Complete | ✅ Complete | Link, Exchange, Update Mode, Balance Sync |
| **Dwolla Integration** | ✅ Complete | ✅ Complete | Funding sources, Transfers, Webhooks      |
| **Bank Management**    | ✅ Complete | ⚠️ Partial  | Backend ready; `/my-banks` page pending   |
| **Transactions**       | ✅ Complete | ⚠️ Partial  | Backend ready; history page pending       |
| **Transfers**          | ✅ Complete | ⚠️ Partial  | Backend ready; transfer page pending      |
| **Dashboard**          | ✅ Complete | ✅ Complete | Balance, banks list, recent transactions  |
| **Security**           | ✅ Complete | N/A         | Rate limiting, encryption, webhooks       |

## Roadmap

### Phase 1: Foundation (Complete)

- [x] Auth System with PII Encryption
- [x] Basic Plaid & Dwolla Handshakes
- [x] Security Hardening (Rate Limits, Headers)
- [x] Standardized Logging (Pino)

### Phase 2: Core Banking (Complete)

- [x] Account Details with Real-time Balances
- [x] Transaction History with Sync
- [x] ACH Transfers: Initiate & Monitor
- [x] Transfer Cancellation
- [x] Webhook Idempotency

### Phase 3: User Experience (WIP)

| Feature                   | Backend | Frontend |
| ------------------------- | ------- | -------- |
| Dashboard UI              | ✅      | ✅       |
| Password Reset Flow       | ✅      | ❌       |
| Email Verification        | ✅      | ❌       |
| My Banks Page             | ✅      | ❌       |
| Transactions History Page | ✅      | ❌       |
| Transfer Funds Page       | ✅      | ❌       |
| User Settings Page        | ✅      | ❌       |

### Phase 4: Advanced Features (Planned)

- [ ] Recurring Transfers
- [ ] Transfer Limits
- [ ] Push Notifications
- [ ] API Documentation (Swagger)

## Known Limitations

1. **Transaction Schema**: The `destinationBankId` is derived from Dwolla metadata rather than a strict database relation.
2. **Localization**: Currency and date formatting uses US locales (`en-US`).
3. **Sandbox Only**: Configured exclusively for Plaid/Dwolla Sandbox environments.
4. **Transfer Limits**: No daily/monthly limits enforced yet.
5. **Missing Pages**: `/my-banks`, `/transactions-history`, `/payment-transfer`, `/forgot-password`, `/reset-password` need frontend implementation.

## Architecture

Interlock is a full-stack monorepo:

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Express 5, Bun Runtime, Prisma ORM, PostgreSQL
- **Integrations**: Plaid (Banking), Dwolla (Payments)
- **Security**: AES-256-GCM Encryption, bcrypt, JWT with rotation
- **Monitoring**: Sentry, Pino Logging
- **Email**: SendGrid (Transactional)
- **Testing**: Vitest, React Testing Library

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.3+ (`npm install -g bun`)
- PostgreSQL 18+
- Node.js 22+ (for Docker builds)

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

   Create `.env` files in root and `server/` directories:

   ```env
   # Required
   DATABASE_URL=postgresql://user:pass@localhost:5432/interlock
   JWT_SECRET=your-256-bit-secret-key
   ENCRYPTION_KEY=your-64-character-hex-key

   # Plaid (Sandbox)
   PLAID_CLIENT_ID=your-client-id
   PLAID_SECRET=your-secret
   PLAID_ENV=sandbox

   # Dwolla (Sandbox)
   DWOLLA_KEY=your-key
   DWOLLA_SECRET=your-secret
   DWOLLA_ENV=sandbox
   DWOLLA_WEBHOOK_SECRET=your-webhook-secret

   # Email (for password reset)
   SENDGRID_API_KEY=your-sendgrid-key
   ```

4. **Initialize Database**

   ```bash
   cd server
   bun run prisma:generate
   bun run prisma migrate dev
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
docker compose up -d
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
| Audit Trail        | Comprehensive logging of security events             |

## Testing

```bash
# Run all tests
bun test

# Server tests
cd server && bun test

# Client tests
cd client && bun test
```

## Contributing

This is a private project. For questions or issues, please contact the maintainers.

## License

GPL-3.0
