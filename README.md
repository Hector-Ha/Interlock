# Interlock

A modern fintech application for secure bank account linking and money transfers, built with Next.js and Express. Interlock integrates with Plaid for bank account connectivity and Dwolla for ACH transfers.

## 🏗️ Architecture

Interlock is a full-stack monorepo application:

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Express 5 API server running on Bun runtime
- **Database**: PostgreSQL with Prisma ORM
- **Integrations**: Plaid (banking), Dwolla (payments)
- **Security**: Sentry error tracking, encrypted PII storage

## 📁 Project Structure

```
interlock/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utility functions
│   └── package.json
├── server/                # Express backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic (Plaid, Dwolla)
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions (encryption)
│   │   ├── config/        # Configuration management
│   │   └── types/         # TypeScript type definitions
│   ├── prisma/            # Database schema and migrations
│   └── package.json
└── docker-compose.yml     # Docker services configuration
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.3 or later
- PostgreSQL 18+
- Node.js 22+ (for Docker services)

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

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=8080
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/interlock

   # Security
   JWT_SECRET=your-super-secret-jwt-key-here
   ENCRYPTION_KEY=your-32-byte-encryption-key-here

   # Plaid Integration
   PLAID_CLIENT_ID=your-plaid-client-id
   PLAID_SECRET=your-plaid-secret
   PLAID_ENV=sandbox
   PLAID_PRODUCTS=auth,transactions,identity
   PLAID_COUNTRY_CODES=US

   # Dwolla Integration
   DWOLLA_KEY=your-dwolla-key
   DWOLLA_SECRET=your-dwolla-secret
   DWOLLA_ENV=sandbox
   DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
   DWOLLA_WEBHOOK_SECRET=your-dwolla-webhook-secret

   # Sentry (Optional)
   SENTRY_DSN=your-sentry-dsn
   ```

4. **Set up the database**

   ```bash
   cd server
   bun run prisma:generate
   bun run prisma migrate dev
   ```

5. **Start the development servers**

   From the root directory:

   ```bash
   bun run dev
   ```

   This starts both the frontend (Next.js on port 3000) and backend (Express on port 8080).

## 🐳 Docker Development

Alternatively, use Docker Compose for a complete development environment:

```bash
# Start all services (PostgreSQL, Redis, Server)
docker compose up -d

# Start with Prisma Studio (database GUI)
docker compose --profile tools up studio

# Run Semgrep security scan
docker compose --profile tools run semgrep
```

Services:

- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Server**: `localhost:8080`
- **Prisma Studio**: `localhost:5555` (when using tools profile)

## 📡 API Endpoints

All API endpoints are prefixed with `/api/v1`.

### Authentication (`/api/v1/auth`)

- `POST /sign-up` - Register a new user
- `POST /sign-in` - Authenticate user and create session
- `GET /me` - Get current user information (requires auth)
- `POST /sign-out` - Clear session cookie

### Plaid Integration (`/api/v1/plaid`)

- `POST /link-token` - Generate Plaid Link token for bank connection (requires auth)
- `POST /exchange-token` - Exchange public token for access token and save bank (requires auth)

### Bank Management (`/api/v1/bank`)

- `GET /` - List user's connected banks (requires auth)
- `POST /link-dwolla` - Link bank account with Dwolla for transfers (requires auth)
- `POST /transfer` - Initiate transfer between two bank accounts (requires auth)

### Webhooks (`/api/v1/webhooks`)

- `POST /dwolla` - Receive Dwolla webhook events (signature verified)

### Health Check

- `GET /health` - Server health status

## 🔐 Security Features

- **Encryption**: All PII (address, date of birth, SSN) is encrypted using AES-256-GCM with PBKDF2 key derivation
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Webhook Verification**: HMAC-SHA256 signature verification for Dwolla webhooks
- **CORS**: Configured for client origin only
- **Helmet**: Security headers middleware
- **Sentry**: Error tracking and monitoring

## 🗄️ Database Schema

### Models

- **User**: User accounts with encrypted PII and Dwolla customer information
- **Bank**: Connected bank accounts via Plaid with encrypted access tokens
- **Transaction**: Transfer records with status tracking (PENDING, SUCCESS, FAILED, RETURNED)

### Enums

- `BankStatus`: ACTIVE, LOGIN_REQUIRED
- `TxStatus`: PENDING, SUCCESS, FAILED, RETURNED

## 🛠️ Development

### Server Scripts

```bash
cd server

# Development with hot reload
bun run dev

# Production start
bun run start

# Prisma commands
bun run prisma:generate    # Generate Prisma Client
bun run prisma:studio      # Open Prisma Studio GUI

# Verification scripts
bun run verify:auth        # Test authentication endpoints
bun run verify:plaid       # Test Plaid integration
```

### Code Organization

The codebase follows the **Single Responsibility Principle**:

- **Controllers**: Handle HTTP requests/responses only
- **Services**: Contain business logic and external API calls
- **Routes**: Define API endpoints and middleware
- **Middleware**: Reusable request processing (auth, validation)
- **Utils**: Pure utility functions (encryption, validation)

## 📦 Dependencies

### Backend

- `express` - Web framework
- `@prisma/client` - Database ORM
- `plaid` - Banking API integration
- `dwolla-v2` - Payment processing
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `zod` - Schema validation
- `@sentry/node` - Error tracking

### Frontend

- `next` - React framework
- `react` - UI library
- `tailwindcss` - Styling
- `chart.js` - Data visualization
- `lucide-react` - Icons

## 🔄 Recent Changes

The application recently underwent a major migration to v1 API structure:

- ✅ Standardized configuration management
- ✅ Upgraded encryption with PBKDF2 key derivation
- ✅ Migrated to UUID-based identifiers
- ✅ Implemented comprehensive authentication with Zod validation
- ✅ Refactored Plaid and Dwolla integrations into service layers
- ✅ Added webhook handling with signature verification
- ✅ Cleaned up deprecated code and types

## 📋 TODO

### High Priority

- [ ] **Frontend API Integration**

  - [ ] Connect sign-up/sign-in pages to `/api/v1/auth` endpoints
  - [ ] Implement API client utilities for backend communication
  - [ ] Replace hardcoded user data with authenticated API calls
  - [ ] Integrate Plaid Link flow for bank account connection
  - [ ] Connect bank management UI to `/api/v1/bank` endpoints
  - [ ] Implement transaction history fetching and display

- [ ] **Testing**

  - [ ] Add unit tests for controllers and services
  - [ ] Add integration tests for API endpoints
  - [ ] Add E2E tests for critical user flows
  - [ ] Set up test coverage reporting

- [ ] **API Documentation**
  - [ ] Generate OpenAPI/Swagger documentation
  - [ ] Add request/response examples
  - [ ] Document error codes and error handling

### Medium Priority

- [ ] **Security Enhancements**

  - [ ] Implement rate limiting for API endpoints
  - [ ] Add request validation middleware
  - [ ] Set up CSRF protection
  - [ ] Add API key authentication for webhooks
  - [ ] Implement password reset flow

- [ ] **Error Handling**

  - [ ] Standardize error response format
  - [ ] Add comprehensive error logging
  - [ ] Implement error recovery mechanisms
  - [ ] Add user-friendly error messages

- [ ] **Database & Performance**

  - [ ] Add database indexes for frequently queried fields
  - [ ] Implement query optimization
  - [ ] Add database connection pooling configuration
  - [ ] Set up database backup strategy

- [ ] **Monitoring & Observability**
  - [ ] Configure Sentry for production error tracking
  - [ ] Add application performance monitoring (APM)
  - [ ] Set up logging infrastructure
  - [ ] Create health check endpoints for dependencies

### Low Priority

- [ ] **Features**

  - [ ] Add transaction filtering and search
  - [ ] Implement bank account balance fetching
  - [ ] Add transaction categories and tags
  - [ ] Create admin dashboard
  - [ ] Add email notifications for transfers

- [ ] **DevOps**

  - [ ] Set up CI/CD pipeline
  - [ ] Create production deployment scripts
  - [ ] Add environment-specific configurations
  - [ ] Set up staging environment

- [ ] **Documentation**

  - [ ] Add architecture diagrams
  - [ ] Create developer onboarding guide
  - [ ] Document deployment process
  - [ ] Add troubleshooting guide

- [ ] **Code Quality**
  - [ ] Set up ESLint/Prettier configuration
  - [ ] Add pre-commit hooks
  - [ ] Implement code review guidelines
  - [ ] Add dependency vulnerability scanning

## 🤝 Contributing

This is a private project. For questions or issues, please contact the maintainers.
