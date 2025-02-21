# aaw-marketplace

Givarrel Veivel's Assignment 01 for AAW class.

## List of Microservices

Services:
```sh
service-auth @ localhost:8881
service-order @ localhost:8882
service-product @ localhost:8883
service-tenant @ localhost:8884
service-wishlist @ localhost:8885
```

Corresponding databases:
```sh
db-auth @ localhost:5441
db-order @ localhost:5442
db-product @ localhost:5443
db-tenant @ localhost:5444
db-wishlist @ localhost:5445
```

To test out each service's API, feel free to import the API collection `./Insomnia_2025-02-20.json`.

## Prerequisites

- Node.js 18.18.2
- pnpm
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>

# Start each Service with Docker Compose
cd <service> && docker compose up -d
```

## Alternative Flow

```bash
# Clone the repository
git clone <repository-url>

# Start all 5 services at once
docker compose up
```

## Local Development Setup

```bash
# You need to repeat the steps below for each service
cd <service>

# Install dependencies
pnpm install

# Setup database
pnpm run generate # Generate migrations

pnpm run migrate # Run migrations

# If you are having issues with migrate, run the database first
# don't forget to docker compose down
docker compose up db-<service>

# Start development server
pnpm dev

```

## Environment Variables

When using docker compose, the microservice URLs `http://192.168.2.156:<port>`
need to be changed depending on your host machine's local IP. (e.g. `http://192.168.1.4:<port>`, etc). Change these in each service's `docker-compose.yaml` files.

When *not* using docker, copy `.env.example` to `./<service>/.env` and configure:

```conf
TENANT_ID=47dd6b24-0b23-46b0-a662-776158d089ba
ADMIN_TENANT_ID=xxx
JWT_SECRET=auth_ms_jwt_secret
ADMIN_JWT_SECRET=xxx
AUTH_MS_URL=http://localhost:8881
ORDER_MS_URL=http://localhost:8882
PRODUCT_MS_URL=http://localhost:8883
TENANT_MS_URL=http://localhost:8883
WISHLIST_MS_URL=http://localhost:8885
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=marketplace
PORT=8000
NODE_ENV=development
```

## Available Scripts

```bash
pnpm dev # Development mode with hot reload
pnpm build # Build production
pnpm start # Start production server
pnpm generate # Generate DB migrations
pnpm migrate # Run DB migrations
```