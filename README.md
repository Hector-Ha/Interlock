# Interlock - A Modern Open Banking Experience

> **A modern fintech application for secure bank account linking and money transfers.**

## TL;DR

Interlock is a secure fintech MVP that bridges **Plaid** (banking data) and **Dwolla** (payments). It's a full-stack monorepo built with **Next.js 16** (Frontend) and **Express 5** (Backend), running on the **Bun** runtime.

Currently in **Phase 2**, it supports authentication, bank linking, detailed account views, transaction history, and ACH transfers in a sandbox environment.

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup Environment
# Create .env files in root and server/ (see Getting Started for details)

# 3. Run Development Server
bun run dev
```

## Project Stage: Phase 2 (Core Features)

The project has advanced to **Phase 2**, with core banking and transaction features implemented.

| Category               | Status        | Notes                                    |
| ---------------------- | ------------- | ---------------------------------------- |
| **Authentication**     | ✅ Functional | Secure login/signup with PII encryption  |
| **Plaid Integration**  | ✅ Functional | Link token, Exchange, & Account Sync     |
| **Dwolla Integration** | ✅ Functional | Funding sources, Transfers, & Webhooks   |
| **Bank Management**    | ✅ Functional | Connect, View Accounts, & Disconnect     |
| **Transactions**       | ✅ Functional | History view & Real-time updates         |
| **Security**           | ✅ Functional | Rate limiting, Sentry, Helmet, & Logging |

## Roadmap

### Phase 1: Foundation (Completed)

- [x] Auth System with PII Encryption
- [x] Basic Plaid & Dwolla Handshakes
- [x] Security Hardening (Rate Limits, Headers)
- [x] Standardized Logging (Pino)

### Phase 2: Core Banking (In Progress/Checking)

- [x] **Account Details**
- [x] **Transaction History**
- [x] **Transfers**: Initiate & Monitor ACH transfers
- [ ] **Transfer Cancellation**

### Phase 3: User Experience

- [x] **Dashboard UI**
- [ ] Password Reset Flow
- [ ] Email Verification
- [ ] User Profile Updates

### Phase 4: Advanced Features

- [ ] Recurring Transfers
- [ ] Push Notifications
- [ ] API Documentation (Swagger)

## Known Issues

Current limitations of the application:

1.  **Transaction Schema**: The local database schema for Transactions does not yet strictly enforce a `destinationBankId` relationship, relying instead on Dwolla metadata for transfer destinations.
2.  **Localization**: Currency formatting and date displays are currently hardcoded to US locales (`en-US`).
3.  **Sandbox Only**: The application is strictly configured for Plaid/Dwolla Sandbox environments. Real money movement is disabled.
4.  **Transfer Limits**: There is no logic currently enforcing daily or monthly transfer limits per user.

## Architecture

Interlock is a full-stack monorepo:

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Chart.js
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
- **Rate Limiting**: Protected auth endpoints.
- **Observability**: Pino logging & Sentry integration.

## Contributing

This is a private project. For questions or issues, please contact the maintainers.
