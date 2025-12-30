# Interlock - Open Banking For Everyone

> **A modern fintech application for secure bank account linking and money transfers.**

## TL;DR

Interlock is a secure fintech MVP that bridges **Plaid** (banking data) and **Dwolla** (payments). It's a full-stack monorepo built with **Next.js 16** (Frontend) and **Express 5** (Backend), running on the **Bun** runtime.

Currently **~60% complete** (Phase 1), it supports basic authentication, bank linking via Plaid, and ACH transfers via Dwolla in a sandbox environment.

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup Environment
# Create .env files in root and server/ (see Getting Started for details)

# 3. Run Development Server
bun run dev
```

## Project Stage: Phase 1 (MVP)

The project is currently in **Phase 1: Core Backend & Integration**.

| Category               | Status         | Notes                                     |
| ---------------------- | -------------- | ----------------------------------------- |
| **Authentication**     | ✅ Functional  | Needs refresh tokens & password reset     |
| **Plaid Integration**  | ✅ Functional  | Link token & Exchange working             |
| **Dwolla Integration** | ✅ Functional  | Funding sources & Transfers working       |
| **Bank Management**    | ⚠️ Partial     | Missing delete & detailed views           |
| **Transactions**       | ❌ Missing     | No history endpoints yet                  |
| **Security**           | ⚠️ In Progress | Rate limiting & logging being implemented |

## Roadmap

Based on the current implementation plan:

### Phase 1: Bug Fixes & Security (Current)

- [ ] Fix Critical Bugs (City field, Dockerfile CMD)
- [ ] Implement Rate Limiting on Auth Routes
- [ ] strict API Request Logging
- [ ] Security Audits (Env vars, Type safety)

### Phase 2: Core Banking Features

- [ ] **Account Balances**: `GET /api/v1/bank/:id/accounts`
- [ ] **Transaction History**: `GET /api/v1/bank/:id/transactions`
- [ ] **Disconnect Bank**: `DELETE /api/v1/bank/:id`
- [ ] **Transfer Status**: `GET /api/v1/transfer/:id`
- [ ] **Webhook Idempotency**

### Phase 3: User Experience

- [ ] Password Reset Flow
- [ ] Email Verification
- [ ] User Profile Updates
- [ ] Plaid Update Mode (Re-auth)

### Phase 4: Advanced Features

- [ ] Transaction Sync from Plaid
- [ ] Recurring Transfers
- [ ] Transfer Limits & Validation
- [ ] Push Notifications
- [ ] API Documentation (Swagger)

## Architecture

Interlock is a full-stack monorepo:

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express 5, Bun Runtime, Prisma ORM, PostgreSQL
- **Integrations**: Plaid (Banking), Dwolla (Payments)
- **Security**: AES-256-GCM Encryption for PII, Sentry Monitoring

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.3+

  > **Note**: Install via npm if needed: `npm install -g bun`.
  > For issues, check the [Bun Documentation](https://bun.com/docs).

- PostgreSQL 18+
- Node.js 22+ (for Docker)

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd interlock
    ```

2.  **Install dependencies**

    ```bash
    bun install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root based on `.env.example`. You will need API keys for:

    - **Plaid** (Sandbox)
    - **Dwolla** (Sandbox)
    - **PostgreSQL** (`DATABASE_URL`)
    - **Security** (`JWT_SECRET`, `ENCRYPTION_KEY`)

4.  **Initialize Database**

    ```bash
    cd server
    bun run prisma:generate
    bun run prisma migrate dev
    ```

5.  **Start Development**
    ```bash
    # From root
    bun run dev
    ```
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:8080`

### Docker Support

Alternatively, use Docker Compose to run the entire stack (Postgres, Redis, Server, Studio):

```bash
docker compose up -d
```

## Security Features

- **PII Encryption**: AES-256-GCM for sensitive user data.
- **Webhook Verification**: HMAC-SHA256 signature checks for Dwolla.
- **Strict TypeScript**: Zod validation for all inputs.
- **Secure Headers**: Helmet & CORS configured.

## Contributing

This is a private project. For questions or issues, please contact the maintainers.
