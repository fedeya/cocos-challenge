# 🏦 Cocos Challenge Backend

This project is an API to manage users' portfolios, assets, and market orders, built for a technical challenge. The API allows users to authenticate, view their portfolios, search for instruments, and manage orders for buying and selling assets.

## 🛠️ Tech Stack
- **Monorepo**: Managed with `turborepo` and `pnpm`.
- **Framework**: Built using `Hono`, a fast and minimalist framework.
- **Database**: PostgreSQL for production, `better-sqlite` for in-memory testing.
- **ORM**: `TypeORM` for database interaction.
- **Testing**: `Jest` for unit and functional tests.
- **API Documentation**: `Swagger UI` for API exploration.
- **API Client**: `Bruno` collection for testing the API.
- **Node Version**: Minimum Node.js version is `20.6.0`.
- **Caching**: `Redis` and `lru-cache` for caching search results.
  
## 🎯 Features

- **Authentication**:  
  The authentication is handled via a simple cookie-based system to make sense of portfolio and order operations. Even though the challenge did not require authentication, we implemented a basic solution:
  - Endpoint: `/v1/auth`
  - Body:  
    ```json
    {
      "userId": 1
    }
    ```
  - This sets a `userId` cookie for subsequent requests. If using an API client that doesn't manage cookies, manually set the `Cookie` header like this:
    ```bash
    Cookie: userId=1
    ```

- **Endpoints**:
  - `/v1/portfolio`: Get user’s portfolio (cash, assets, and returns).
  - `/v1/orders/cash`: Manage cash orders (`CASH_IN`, `CASH_OUT`).
  - `/v1/orders/asset`: Buy or sell assets (Market or Limit orders).
  - `/v1/orders/cancel`: Cancel new limit order.
  - `/v1/instruments/search`: Search for instruments by ticker or name.

## ⚙️ Design Decisions

- **Cookie-based Authentication**: Endpoints like `/portfolio` and order execution require user context, so I added a simple authentication mechanism even though it wasn't strictly required. It ensures that these operations make sense within the context of a specific user.
- **Monorepo Setup**: The core logic and database handling are decoupled from the API, allowing flexibility and easy maintenance or migration to a different framework if needed.

  Using `turborepo` for easy management of the packages and apps within the monorepo, and `pnpm` to handle dependencies efficiently.
  
  The monorepo includes:
  - `apps/api`: The Hono-based API server.
  - `packages/core`: Business logic services and utilities.
  - `packages/db`: Database connection and repositories with TypeORM.
  - `apps/bruno-req`: API request collection to test the API using Bruno.

- **Swagger Documentation**: A Swagger UI has been included to make it easier for users to explore and test the API without needing an external client. 
- **Caching**: The search endpoint caches the results for 5 minutes to reduce the load on the database and improve performance.

## 🚀 Getting Started

To get the project up and running, follow these steps:

### Installation

1. **Clone the repo**:
   ```bash
   git clone https://github.com/fedeya/cocos-challenge.git
   cd cocos-challenge
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

### Configuration

Make sure to configure the environment variables. A .env.example file is provided; create your own .env file and set the required values:

```bash
cp .env.example .env
```

The **DATABASE_URL** should be set to the provided cloud database URL:
```js
DATABASE_URL=postgres://user:password@host:port/dbname
```

### Usage

To start the API server:
   ```bash
   pnpm dev
   ```

The API server will be available at `http://localhost:3000`.

#### Docker (Recommended)

You can also run the API server using Docker:
   ```bash
   docker-compose up
   ```

##  Testing

The project includes unit and functional tests for the services. To run the tests:
   ```bash
   pnpm test
   ```

## 🗂️ API Documentation

- Swagger UI is available to test and explore the API at `/api`.
- You can also import the API request collection available in `apps/bruno-req` to [Bruno](https://www.usebruno.com/) to test the API.

## Troubleshooting

- **Swagger Cookie Issue**: The Swagger UI may not handle cookies effectively when set using the Authorize button due to browser restrictions. To ensure that the cookie is sent to the server correctly, I recommend using the `/auth` endpoint to set the cookie manually.
