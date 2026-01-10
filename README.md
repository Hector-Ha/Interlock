# Interlock - A Modern Open Banking Experience

> **A production-ready fintech application for secure bank account linking and seamless money transfers.**

## TL;DR

Interlock is a fully-featured, enterprise-grade fintech platform that seamlessly integrates **Plaid** (banking data aggregation) and **Dwolla** (payment processing). Built as a modern full-stack monorepo using **Next.js 16** (Frontend) and **Express 5** (Backend), powered by the ultra-fast **Bun** runtime.

The application provides comprehensive banking features including secure authentication, multi-bank account linking, real-time account balances, detailed transaction history, ACH money transfers, and robust webhook-based payment processing.

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup Environment
# Create .env files in root and server/ (see Getting Started for details)

# 3. Run Development Server
bun run dev
```

## Application Features

Interlock is a **production-ready** fintech platform with all core features fully implemented and operational.

| Category                    | Status        | Capabilities                                              |
| --------------------------- | ------------- | --------------------------------------------------------- |
| **User Authentication**     | ✅ Complete   | Secure signup/login with AES-256-GCM PII encryption       |
| **Session Management**      | ✅ Complete   | JWT-based authentication with refresh token rotation      |
| **Plaid Integration**       | ✅ Complete   | Link tokens, access token exchange, account sync          |
| **Dwolla Integration**      | ✅ Complete   | Customer creation, funding sources, transfer processing   |
| **Multi-Bank Support**      | ✅ Complete   | Connect multiple banks, view consolidated balances        |
| **Account Management**      | ✅ Complete   | Real-time balance tracking, account details, bank linking |
| **Transaction History**     | ✅ Complete   | Comprehensive transaction logs with filtering & search    |
| **Money Transfers**         | ✅ Complete   | ACH transfers between accounts with real-time status      |
| **Webhook Processing**      | ✅ Complete   | Automated transaction status updates via Dwolla webhooks  |
| **Security & Compliance**   | ✅ Complete   | Rate limiting, CORS, Helmet, audit logging, Sentry        |
| **Real-time Dashboard**     | ✅ Complete   | Interactive charts, balance visualization, quick actions  |
| **Responsive UI**           | ✅ Complete   | Mobile-first design with full tablet/desktop support      |

## Core Functionalities

### 🔐 User Authentication & Security

Interlock implements enterprise-grade security measures for user authentication:

- **Secure Registration**: New users create accounts with encrypted personal information including name, address, date of birth, and identity verification details
- **Password Security**: Bcrypt-hashed passwords with configurable work factors for future-proof protection
- **Session Management**: JWT-based authentication with secure refresh token rotation and automatic session expiration
- **Account Lockout**: Automated protection against brute-force attacks with configurable failed attempt thresholds
- **PII Encryption**: All personally identifiable information is encrypted at rest using AES-256-GCM encryption
- **Audit Logging**: Comprehensive activity logs track all user actions and system events for compliance and security monitoring

### 🏦 Bank Account Integration

Seamlessly connect and manage multiple bank accounts through Plaid:

- **Plaid Link**: Intuitive OAuth-like flow for securely connecting to 11,000+ financial institutions
- **Multi-Bank Support**: Link unlimited bank accounts from different institutions to a single user account
- **Real-time Sync**: Automatic synchronization of account balances and transaction data
- **Account Types**: Support for checking, savings, credit cards, and investment accounts
- **Institution Metadata**: Display bank logos, names, and account details for easy identification
- **Secure Token Management**: Encrypted storage of Plaid access tokens with automatic refresh handling
- **Connection Health**: Monitor and maintain bank connection status with automatic re-authentication prompts

### 💳 Account Dashboard

Comprehensive view of all financial accounts in one place:

- **Consolidated Balance**: Total balance across all linked accounts with real-time updates
- **Account Cards**: Visual cards showing individual account balances, types, and institutions
- **Balance Visualization**: Interactive doughnut charts displaying account distribution
- **Animated Counters**: Smooth, animated balance updates for enhanced user experience
- **Quick Actions**: One-click access to transfer funds, view transactions, or link new accounts
- **Account Details**: Deep dive into individual account information including account numbers, routing numbers, and available balances

### 📊 Transaction Management

Complete transaction history with powerful filtering and search capabilities:

- **Comprehensive History**: View all transactions across all linked accounts in a unified timeline
- **Transaction Details**: See merchant names, amounts, dates, categories, and status for each transaction
- **Real-time Updates**: Automatic refresh of transaction data via webhooks and scheduled syncs
- **Status Tracking**: Monitor transaction status (pending, completed, failed, returned)
- **Multi-Channel Support**: Track transactions from ACH, wire transfers, and standard purchases
- **Date Filtering**: Filter transactions by custom date ranges or predefined periods
- **Search Functionality**: Quick search across transaction names, merchants, and categories
- **Category Organization**: Automatic transaction categorization for better financial insights

### 💸 Money Transfers

Secure ACH transfers between accounts via Dwolla integration:

- **Bank-to-Bank Transfers**: Initiate ACH transfers between any linked bank accounts
- **Dwolla Integration**: Reliable payment processing through Dwolla's secure ACH network
- **Transfer Validation**: Real-time validation of transfer amounts, source, and destination accounts
- **Status Monitoring**: Track transfer progress from initiation through completion
- **Webhook Updates**: Automatic status updates as transfers are processed by the ACH network
- **Transfer History**: Complete record of all past transfers with detailed status information
- **Same-Day ACH**: Support for expedited transfers when available (sandbox and production)
- **Transfer Limits**: Configurable daily and monthly transfer limits per user for fraud prevention

### 🔔 Webhook Processing

Automated event handling for real-time transaction updates:

- **Dwolla Webhooks**: Secure webhook endpoints for receiving payment status updates
- **HMAC Verification**: Cryptographic signature verification ensures webhook authenticity
- **Event Types**: Handle customer creation, transfer initiation, completion, failure, and cancellation events
- **Automatic Sync**: Transaction status automatically updated based on webhook notifications
- **Retry Logic**: Built-in retry mechanisms for failed webhook processing
- **Event Logging**: Comprehensive logging of all webhook events for debugging and audit trails

## Technical Architecture

### Frontend Stack

- **Framework**: Next.js 16 with App Router for optimal performance and SEO
- **React**: React 19 with Server Components and advanced hooks
- **TypeScript**: Fully typed codebase with strict mode enabled for type safety
- **Styling**: Tailwind CSS 4 for utility-first, responsive design
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: Zustand for lightweight, flexible client state
- **Forms**: React Hook Form with Zod schema validation
- **Charts**: Chart.js with react-chartjs-2 for data visualization
- **HTTP Client**: Axios with interceptors for API communication
- **Icons**: Lucide React for a consistent, modern icon set

### Backend Stack

- **Runtime**: Bun 1.3.3+ for ultra-fast JavaScript/TypeScript execution
- **Framework**: Express 5 with async/await support
- **Database**: PostgreSQL 18 with connection pooling
- **ORM**: Prisma 7 with type-safe database queries
- **Authentication**: JWT with bcryptjs password hashing
- **Validation**: Zod for request/response schema validation
- **Logging**: Pino structured logging with pino-http middleware
- **Monitoring**: Sentry for error tracking and performance monitoring
- **Security**: Helmet for HTTP headers, CORS for cross-origin control
- **Rate Limiting**: Express rate limiter for API protection

### Third-Party Integrations

- **Plaid**: Banking data aggregation and account linking
  - Plaid Link for OAuth-like bank connections
  - Transactions API for transaction history
  - Accounts API for balance and account details
  - Institutions API for bank metadata
- **Dwolla**: ACH payment processing
  - Customer creation and verification
  - Funding source management
  - Transfer initiation and tracking
  - Webhook event processing

### Database Schema

Interlock uses a well-structured PostgreSQL database with the following entities:

- **Users**: Core user accounts with encrypted personal information
- **Banks**: Linked bank accounts with Plaid and Dwolla credentials
- **Transactions**: Complete transaction history with Plaid and Dwolla references
- **Sessions**: Active user sessions with refresh tokens
- **AuditLog**: Security and compliance audit trail

### Security Architecture

- **Encryption at Rest**: AES-256-GCM encryption for all PII data
- **Encryption in Transit**: HTTPS/TLS for all API communications
- **Token Security**: Secure JWT signing with RS256 or HS256 algorithms
- **Password Hashing**: Bcrypt with configurable work factors (default: 10 rounds)
- **CSRF Protection**: SameSite cookies and CSRF tokens
- **XSS Prevention**: Content Security Policy headers via Helmet
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM
- **Rate Limiting**: IP-based rate limiting on authentication endpoints
- **Session Management**: Secure session storage with automatic expiration
- **Webhook Verification**: HMAC-SHA256 signature verification for Dwolla webhooks

## Getting Started

### Prerequisites

Before running Interlock, ensure you have the following installed:

- **Bun**: v1.3.3 or higher ([Installation Guide](https://bun.sh))
  ```bash
  # Install Bun (macOS, Linux, WSL)
  curl -fsSL https://bun.sh/install | bash
  
  # Or via npm
  npm install -g bun
  ```
- **PostgreSQL**: v18 or higher
  - Local installation or Docker container
  - Ensure PostgreSQL is running and accessible
- **Node.js**: v22+ (required for Docker setup only)

### API Keys & Credentials

You'll need API credentials from the following services:

1. **Plaid** (Sandbox Environment)
   - Sign up at [Plaid Dashboard](https://dashboard.plaid.com)
   - Create a new application
   - Copy your Client ID and Sandbox Secret
   - Note: Sandbox mode is free and doesn't require bank credentials

2. **Dwolla** (Sandbox Environment)
   - Sign up at [Dwolla Dashboard](https://dashboard.dwolla.com)
   - Navigate to Sandbox environment
   - Create API credentials (Key and Secret)
   - Note: Sandbox mode is free for development

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Hector-Ha/Interlock.git
   cd Interlock
   ```

2. **Install Dependencies**

   The project uses Bun workspaces to manage the monorepo structure:

   ```bash
   bun install
   ```

   This will install dependencies for both the client and server packages.

3. **Configure Environment Variables**

   Create environment files for both the root and server:

   **Root `.env` file:**
   ```bash
   cp .env.example .env
   ```

   **Server `.env` file:**
   ```bash
   cp server/.env.example server/.env
   ```

   Edit both files with your credentials:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/interlock"
   
   # Application Security
   JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
   ENCRYPTION_KEY="your-32-character-encryption-key"
   
   # Plaid Configuration (Sandbox)
   PLAID_CLIENT_ID="your_plaid_client_id"
   PLAID_SECRET="your_plaid_sandbox_secret"
   PLAID_ENV="sandbox"
   
   # Dwolla Configuration (Sandbox)
   DWOLLA_KEY="your_dwolla_key"
   DWOLLA_SECRET="your_dwolla_secret"
   DWOLLA_ENV="sandbox"
   
   # Server Configuration
   PORT=8080
   NODE_ENV=development
   
   # Optional: Sentry (for error monitoring)
   SENTRY_DSN="your_sentry_dsn"
   ```

4. **Initialize the Database**

   Generate Prisma client and run migrations:

   ```bash
   cd server
   bun run prisma:generate
   bun run prisma migrate dev
   cd ..
   ```

   This will:
   - Generate the Prisma client with type definitions
   - Create all necessary database tables
   - Set up indexes and relationships

5. **Start the Development Server**

   From the root directory:

   ```bash
   bun run dev
   ```

   This will start both the frontend and backend concurrently:
   - **Frontend**: http://localhost:3000 (Next.js)
   - **Backend**: http://localhost:8080 (Express)

### Alternative: Docker Setup

For a containerized environment with PostgreSQL, Redis, and Prisma Studio:

```bash
# Start all services
docker compose up -d

# Start with Prisma Studio
docker compose --profile tools up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Reset everything (including data)
docker compose down -v
```

**Services provided by Docker:**
- **PostgreSQL**: Database server on port 5432
- **Redis**: Caching layer on port 6379
- **Express Server**: Backend API on port 8080
- **Prisma Studio**: Database GUI on port 5555 (with `--profile tools`)

### Verification

After setup, verify everything is working:

1. **Check Database Connection**
   ```bash
   cd server
   bun run prisma studio
   ```
   This should open Prisma Studio at http://localhost:5555

2. **Test Backend API**
   ```bash
   curl http://localhost:8080/health
   ```
   Expected response: `{"status":"ok"}`

3. **Access Frontend**
   - Navigate to http://localhost:3000
   - You should see the login/signup page

4. **Create Test Account**
   - Click "Sign Up"
   - Fill in the registration form
   - Use any email format (no verification required in sandbox)
   - Password must be at least 8 characters

## Usage Guide

### First-Time User Flow

1. **Create an Account**
   - Navigate to http://localhost:3000/sign-up
   - Enter your personal information (encrypted and stored securely)
   - Create a strong password
   - Submit the registration form

2. **Sign In**
   - Use your email and password to log in
   - Session tokens are automatically managed

3. **Link Your First Bank**
   - From the dashboard, click "Link Bank" or "Add Bank"
   - Plaid Link modal will open
   - In sandbox mode, use these test credentials:
     - Institution: Search for "Chase" or any bank
     - Username: `user_good`
     - Password: `pass_good`
     - MFA: `1234` (if prompted)
   - Complete the linking process

4. **View Account Details**
   - After linking, your accounts appear on the dashboard
   - View real-time balances and account information
   - Explore the account breakdown chart

5. **Check Transaction History**
   - Navigate to the Transactions section
   - View all transactions from your linked accounts
   - Use filters to find specific transactions

6. **Make a Transfer**
   - From the dashboard, click "Transfer Money"
   - Select source and destination accounts
   - Enter transfer amount
   - Confirm and initiate the transfer
   - Monitor transfer status in real-time

### Bank Linking Process

The application uses Plaid Link for secure bank connections:

1. Click "Link Bank" from anywhere in the application
2. Plaid Link modal opens in a secure iframe
3. Search for your financial institution
4. Enter credentials (sandbox test credentials provided)
5. Complete MFA if required
6. Select accounts to link
7. Confirm and complete the connection
8. Accounts appear immediately on your dashboard

### Making Transfers

To transfer money between your linked accounts:

1. Ensure you have at least two linked bank accounts
2. Navigate to the Transfer section or click "Transfer Money"
3. Fill in the transfer form:
   - **From Account**: Select the source account
   - **To Account**: Select the destination account
   - **Amount**: Enter the transfer amount (must be positive)
   - **Note** (optional): Add a description for your records
4. Review the transfer details
5. Click "Confirm Transfer"
6. The transfer is initiated via Dwolla
7. Track the transfer status in your transaction history

**Transfer Statuses:**
- **Pending**: Transfer initiated, awaiting processing
- **Processing**: Transfer is being processed by the ACH network
- **Completed**: Transfer successfully completed
- **Failed**: Transfer failed (insufficient funds, invalid account, etc.)
- **Cancelled**: Transfer was cancelled before processing

### Managing Connected Banks

- **View Banks**: All connected banks are displayed on the dashboard
- **Account Details**: Click on any bank card to view detailed information
- **Disconnect Bank**: Remove a bank connection from the settings (preserves transaction history)
- **Reconnect**: If a bank shows "LOGIN_REQUIRED", click to reconnect via Plaid Link

## Development

### Project Structure

```
Interlock/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── (auth)/   # Authentication pages (login, signup)
│   │   │   └── (root)/   # Protected pages (dashboard, transactions)
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Primitive UI components (shadcn/ui)
│   │   │   ├── layout/   # Layout components (Sidebar, Navbar)
│   │   │   ├── features/ # Feature-specific components (bank, transfers)
│   │   │   └── shared/   # Reusable shared components
│   │   ├── lib/          # Utilities and helpers
│   │   ├── types/        # TypeScript type definitions
│   │   └── styles/       # Global styles
│   └── package.json
├── server/                # Express backend application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Express middleware
│   │   ├── validators/   # Zod schema validators
│   │   ├── utils/        # Helper functions
│   │   └── config/       # Configuration files
│   ├── prisma/           # Database schema and migrations
│   └── package.json
├── docker-compose.yml     # Docker configuration
├── package.json          # Root package.json (workspaces)
└── README.md             # This file
```

### Running Tests

```bash
# Run client tests
cd client
bun test

# Run server tests
cd server
bun test

# Run all tests
bun test
```

### Linting and Formatting

```bash
# Lint client code
cd client
bun run lint

# Lint server code
cd server
bun run lint
```

### Database Management

```bash
# Generate Prisma Client
bun run prisma:generate

# Create a new migration
bun run prisma migrate dev --name migration_name

# Apply migrations in production
bun run prisma migrate deploy

# Open Prisma Studio (GUI)
bun run prisma:studio

# Reset database (WARNING: deletes all data)
bun run prisma migrate reset
```

### Building for Production

```bash
# Build both client and server
bun run build

# Build client only
cd client
bun run build

# Build server only
cd server
bun run build
```

### Starting Production Server

```bash
# After building, start the production server
bun run start
```

This will start the Express server which serves both the API and the built Next.js application.

## Deployment

### Production Environment Setup

Interlock is designed to be deployed on modern cloud platforms. Here are the recommended deployment strategies:

#### Environment Configuration

Before deploying, ensure all production environment variables are set:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/interlock_prod
JWT_SECRET=<strong-production-secret-min-64-chars>
ENCRYPTION_KEY=<strong-32-character-key>
PLAID_CLIENT_ID=<production-client-id>
PLAID_SECRET=<production-secret>
PLAID_ENV=production
DWOLLA_KEY=<production-key>
DWOLLA_SECRET=<production-secret>
DWOLLA_ENV=production
SENTRY_DSN=<your-sentry-dsn>
```

#### Deployment Platforms

**Vercel (Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

**Railway / Render / Fly.io (Backend)**
```bash
# Example with Railway
railway login
railway init
railway up
```

**Docker (Full Stack)**
```bash
# Build production images
docker build -t interlock-server ./server
docker build -t interlock-client ./client

# Run with docker-compose
docker compose -f docker-compose.prod.yml up -d
```

#### Database Migrations

Always run migrations before deploying new versions:

```bash
cd server
bun run prisma migrate deploy
```

### Production Checklist

Before going live, ensure:

- ✅ All environment variables are properly configured
- ✅ Database backups are automated
- ✅ HTTPS/TLS is enabled for all endpoints
- ✅ Sentry or error monitoring is configured
- ✅ Rate limiting is enabled and configured appropriately
- ✅ Plaid and Dwolla are in production mode (not sandbox)
- ✅ Webhook endpoints are publicly accessible
- ✅ CORS is configured for your production domain
- ✅ Security headers are properly set via Helmet
- ✅ Database connection pooling is optimized
- ✅ Logging is configured for production (not verbose)
- ✅ Session expiration times are appropriate for production use

## Security Features

Interlock implements industry-standard security practices:

### Data Protection

- **Encryption at Rest**: All PII data is encrypted using AES-256-GCM before storage
- **Encryption in Transit**: All API communications use HTTPS/TLS 1.2+
- **Password Security**: Bcrypt hashing with configurable work factors (minimum 10 rounds)
- **Token Security**: Secure JWT generation with expiration and refresh token rotation
- **Database Security**: Parameterized queries prevent SQL injection attacks

### Application Security

- **CORS Protection**: Configurable cross-origin resource sharing policies
- **XSS Prevention**: Content Security Policy (CSP) headers via Helmet
- **CSRF Protection**: SameSite cookie attributes and CSRF tokens
- **Rate Limiting**: IP-based rate limiting on authentication and sensitive endpoints
- **Account Lockout**: Automatic account locking after failed login attempts
- **Session Management**: Secure session storage with automatic expiration
- **Input Validation**: Comprehensive request validation using Zod schemas

### API Security

- **Webhook Verification**: HMAC-SHA256 signature verification for Dwolla webhooks
- **API Authentication**: Bearer token authentication for all protected endpoints
- **Request Sanitization**: Input sanitization to prevent injection attacks
- **Error Handling**: Secure error messages that don't leak sensitive information

### Monitoring & Compliance

- **Audit Logging**: Comprehensive logging of all user actions and system events
- **Error Tracking**: Sentry integration for real-time error monitoring
- **Structured Logging**: Pino logger for consistent, searchable logs
- **Performance Monitoring**: Sentry performance tracking for bottleneck identification

### Security Best Practices

- All secrets are stored in environment variables, never committed to code
- Regular dependency updates to patch security vulnerabilities
- Minimal permissions principle for database access
- Secure credential rotation procedures
- Regular security audits recommended before production deployment

## API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup`
- Register a new user account
- Request body: `{ email, password, firstName, lastName, address, dateOfBirth, country, identityDocumentId }`
- Returns: `{ user, accessToken, refreshToken }`

**POST** `/api/auth/signin`
- Authenticate existing user
- Request body: `{ email, password }`
- Returns: `{ user, accessToken, refreshToken }`

**POST** `/api/auth/refresh`
- Refresh expired access token
- Request body: `{ refreshToken }`
- Returns: `{ accessToken }`

**POST** `/api/auth/signout`
- Invalidate current session
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success: true }`

### Bank Management Endpoints

**GET** `/api/banks`
- Get all linked banks for authenticated user
- Headers: `Authorization: Bearer <token>`
- Returns: Array of bank objects

**GET** `/api/banks/:bankId`
- Get detailed information for a specific bank
- Headers: `Authorization: Bearer <token>`
- Returns: Bank object with accounts

**DELETE** `/api/banks/:bankId`
- Disconnect a linked bank account
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success: true }`

### Plaid Integration Endpoints

**POST** `/api/plaid/create-link-token`
- Generate Plaid Link token for bank connection
- Headers: `Authorization: Bearer <token>`
- Returns: `{ linkToken }`

**POST** `/api/plaid/exchange-public-token`
- Exchange Plaid public token for access token
- Request body: `{ publicToken, institutionId, institutionName }`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ bank }`

### Transaction Endpoints

**GET** `/api/transactions`
- Get transaction history for authenticated user
- Query params: `?bankId=<id>&startDate=<date>&endDate=<date>&limit=<number>`
- Headers: `Authorization: Bearer <token>`
- Returns: Array of transactions

**GET** `/api/transactions/:transactionId`
- Get details for a specific transaction
- Headers: `Authorization: Bearer <token>`
- Returns: Transaction object

### Transfer Endpoints

**POST** `/api/transfers`
- Initiate a new ACH transfer
- Request body: `{ sourceBankId, destinationBankId, amount, note }`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ transfer, transaction }`

**GET** `/api/transfers`
- Get all transfers for authenticated user
- Headers: `Authorization: Bearer <token>`
- Returns: Array of transfers

**GET** `/api/transfers/:transferId`
- Get status of a specific transfer
- Headers: `Authorization: Bearer <token>`
- Returns: Transfer object with current status

### Webhook Endpoints

**POST** `/api/webhooks/dwolla`
- Receive Dwolla webhook events
- Headers: `X-Request-Signature-SHA-256: <signature>`
- Request body: Dwolla event payload
- Returns: `{ success: true }`

## Troubleshooting

### Common Issues

**Issue**: Database connection errors
```
Error: P1001: Can't reach database server at `localhost:5432`
```
**Solution**: 
- Ensure PostgreSQL is running: `pg_ctl status`
- Verify DATABASE_URL in your `.env` file
- Check firewall rules allow port 5432

---

**Issue**: Plaid Link not opening
```
Error: INVALID_LINK_TOKEN
```
**Solution**:
- Verify PLAID_CLIENT_ID and PLAID_SECRET are correct
- Ensure PLAID_ENV is set to "sandbox" for development
- Check that link token hasn't expired (valid for 30 minutes)

---

**Issue**: Dwolla transfer failures
```
Error: Insufficient balance in source funding source
```
**Solution**:
- In sandbox mode, use Dwolla's test funding sources
- Verify the source account has sufficient funds
- Check that both accounts are verified in Dwolla

---

**Issue**: Webpack/Build errors
```
Error: Module not found
```
**Solution**:
- Clear node_modules and reinstall: `rm -rf node_modules && bun install`
- Clear Next.js cache: `rm -rf client/.next`
- Ensure all dependencies are installed: `bun install`

---

**Issue**: Session expires immediately
```
Error: Token expired
```
**Solution**:
- Verify JWT_SECRET is set and consistent
- Check system time is synchronized
- Ensure refresh token logic is implemented

### Debug Mode

Enable verbose logging for troubleshooting:

```env
# In .env
NODE_ENV=development
LOG_LEVEL=debug
```

Then check server logs for detailed information:
```bash
cd server
bun run dev
```

### Getting Help

- **Documentation**: Review this README and inline code comments
- **Logs**: Check Sentry dashboard for error details
- **Database**: Use Prisma Studio to inspect data: `bun run prisma:studio`
- **Network**: Use browser DevTools to inspect API requests/responses

## Performance Optimization

### Frontend Optimizations

- **Code Splitting**: Automatic route-based code splitting via Next.js
- **Image Optimization**: Next.js Image component for optimized images
- **Font Optimization**: Local font files with `next/font` for instant loading
- **Lazy Loading**: React.lazy() for component-level code splitting
- **Memoization**: React.memo() and useMemo() for expensive computations
- **Bundle Analysis**: Use `ANALYZE=true bun run build` to analyze bundle size

### Backend Optimizations

- **Database Indexing**: Strategic indexes on frequently queried columns
- **Connection Pooling**: PostgreSQL connection pooling via Prisma
- **Caching**: Redis caching for frequently accessed data (when enabled)
- **Async Operations**: Non-blocking async/await patterns throughout
- **Query Optimization**: Efficient Prisma queries with select and include
- **Compression**: Gzip compression for API responses

### Monitoring Performance

```bash
# Analyze client bundle
cd client
ANALYZE=true bun run build

# Database query performance
cd server
bun run prisma studio
# Use the query analyzer
```

## License

This project is **proprietary and confidential**. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without explicit written permission from the copyright holder.

## Acknowledgments

Built with industry-leading technologies:

- [Next.js](https://nextjs.org) - React framework for production
- [Express](https://expressjs.com) - Fast, unopinionated web framework
- [Bun](https://bun.sh) - All-in-one JavaScript runtime & toolkit
- [Plaid](https://plaid.com) - Banking data infrastructure
- [Dwolla](https://dwolla.com) - ACH payment processing
- [Prisma](https://prisma.io) - Next-generation ORM
- [PostgreSQL](https://postgresql.org) - Powerful, open source database
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Radix UI](https://radix-ui.com) - Unstyled, accessible components
- [Sentry](https://sentry.io) - Application monitoring platform

## Contact

For questions, issues, or feature requests, please contact the maintainers:

**Project Maintainer**: Hector Ha  
**Repository**: [Hector-Ha/Interlock](https://github.com/Hector-Ha/Interlock)

---

**Interlock** - Secure, Modern, Open Banking Made Simple 🔐💳✨
