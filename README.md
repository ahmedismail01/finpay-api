# FinPay API - Wallet, Transaction & Payment Management System

A comprehensive NestJS application for managing digital wallets, transactions, and payments.

## Features

- 🔐 **User Authentication & Authorization** - JWT-based auth with role-based access control
- 💰 **Wallet Management** - Create and manage user wallets with multiple currencies
- 💳 **Payment Processing** - Process payments through multiple payment providers
- 📊 **Transaction Management** - Complete transaction history with idempotency keys
- 🛡️ **KYC Verification** - Know Your Customer verification system
- 📱 **Phone Number Support** - User registration with phone numbers
- 🔄 **Real-time Updates** - WebSocket support for real-time notifications
- 📦 **Job Queue** - Background job processing with Bull queue

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- Redis (optional, for Bull queue)
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd finpay-api

# Install dependencies
npm install
```

## Configuration

1. **Create environment files:**

```bash
# Development
cp .env.development .env.development.local

# Production
cp .env.production .env.production.local
```

2. **Update environment variables** with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=finpay

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRATION=24h

# Node Environment
NODE_ENV=development

# Application
PORT=3000

# Stripe Configuration (Optional for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

# Redis Configuration (Optional for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Database Setup

1. **Run migrations:**

```bash
npm run migration:run
```

2. **Generate new migrations (after schema changes):**

```bash
npm run migration:generate -- -n MigrationName
```

3. **Revert last migration:**

```bash
npm run migration:revert
```

## Running the Application

```bash
# Development mode (watch)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users
- `GET /users/profile` - Get current user profile
- `GET /users` - Get all users (Admin only)

### Wallets
- `POST /wallets` - Create wallet
- `GET /wallets/my-wallet` - Get user's wallet
- `GET /wallets/:walletId` - Get wallet details
- `GET /wallets` - Get all wallets (Admin only)
- `PUT /wallets/:walletId/suspend` - Suspend wallet (Admin only)
- `PUT /wallets/:walletId/activate` - Activate wallet (Admin only)

### Transactions
- `POST /transactions` - Create transaction
- `GET /transactions/:transactionId` - Get transaction details
- `GET /transactions/wallet/:walletId` - Get wallet transactions
- `GET /transactions` - Get all transactions (Admin only)
- `GET /transactions/by-type/:type` - Get transactions by type (Admin only)

### Payments
- `POST /payments` - Create payment
- `GET /payments/:paymentId` - Get payment details
- `GET /payments/user/my-payments` - Get user's payments
- `GET /payments/wallet/:walletId` - Get wallet payments
- `GET /payments` - Get all payments (Admin only)
- `PUT /payments/:paymentId/status` - Update payment status (Admin only)
- `POST /payments/:paymentId/refund` - Refund payment

### KYC
- `POST /kyc` - Create KYC submission
- `GET /kyc` - Get KYC records
- `PATCH /kyc/:id/approve` - Approve KYC (Admin only)
- `PATCH /kyc/:id/reject` - Reject KYC (Admin only)

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Project Structure

```
src/
├── auth/                 # Authentication & Authorization
│   ├── decorators/      # Custom decorators
│   ├── dtos/            # Data transfer objects
│   ├── guards/          # Authentication guards
│   ├── strategies/      # Passport strategies
│   └── auth.*           # Auth service & controller
├── user/                # User management
│   ├── dtos/            # User DTOs
│   ├── entities/        # User entity
│   └── user.*           # User service & controller
├── wallet/              # Wallet management
│   ├── dtos/            # Wallet DTOs
│   ├── entities/        # Wallet entity
│   └── wallet.*         # Wallet service & controller
├── transaction/         # Transaction management
│   ├── dtos/            # Transaction DTOs
│   ├── entities/        # Transaction entity
│   └── transaction.*    # Transaction service & controller
├── payment/             # Payment processing
│   ├── dtos/            # Payment DTOs
│   ├── entities/        # Payment entity
│   └── payment.*        # Payment service & controller
├── kyc/                 # KYC verification
│   ├── dtos/            # KYC DTOs
│   ├── entities/        # KYC entity
│   └── kyc.*            # KYC service & controller
├── common/              # Shared utilities
│   ├── decorators/      # Common decorators
│   ├── entities/        # Base entities
│   ├── enums/           # Enums
│   ├── filters/         # Exception filters
│   ├── interceptors/    # Global interceptors
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── database/            # Database configuration
│   ├── entities/        # Database entities
│   └── database.module  # Database module
├── migrations/          # TypeORM migrations
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

## Architecture Patterns

### DTOs (Data Transfer Objects)
All API inputs are validated using DTOs with `class-validator` decorators.

### Guards & Decorators
- `JWTAuthGuard` - Validates JWT tokens
- `RolesGuard` - Checks user roles/permissions
- `@Public()` - Marks endpoints as public
- `@Roles()` - Specifies required roles
- `@CurrentUser()` - Injects current user into handlers

### Services
All business logic is encapsulated in service classes with dependency injection.

### Interceptors
- `ResponseInterceptor` - Standardizes API responses
- `ClassSerializerInterceptor` - Handles DTO serialization

### Filters
- `HttpExceptionFilter` - Standardizes error responses

## Key Features Explained

### Wallet Management
- Users can create wallets with different currencies
- Balance tracked in cents to avoid floating-point issues
- Wallets can be suspended/activated by admins
- Wallet suspension prevents transactions

### Transactions
- Idempotency keys prevent duplicate transactions
- Transaction types: DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT
- Balance is tracked after each transaction
- Full transaction history available

### Payments
- Support for multiple payment providers
- Payment status tracking: pending, succeeded, failed, refunded
- Full refund capability
- Payment logs for auditing

### Security
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Environment-based configuration
- Input validation on all endpoints

## License

MIT
