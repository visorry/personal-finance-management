# Personal Finance Management System

## Overview

This project is a backend system for managing personal finances, including budgeting, expense tracking, and financial reporting. It provides features such as user registration and authentication, CRUD operations for income and expenses, budget creation and tracking, monthly financial reports, and category-wise expense tracking.

## Features

- User registration and authentication
- CRUD operations for income and expenses
- Budget creation and tracking
- Monthly financial reports
- Category-wise expense tracking (e.g., groceries, rent, entertainment)

## Technologies Used

- Node.js with Express for the server
- Prisma for database management
- JWT for user authentication
- PostgreSQL as the database

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/visorry/personal-finance-management.git
   cd personal-finance-management


**Prerequisites**

* Node.js and npm installed ([https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager))

**Installation**

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

   Create a file named `.env` in your project's root directory and add the following content, replacing the placeholders with your actual values:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
   JWT_SECRET="your_jwt_secret"
   ```

3. **Generate Prisma client and run migrations:**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

**Running the server**

1. **Start the server:**

   ```bash
   npm start
   ```

**API Endpoints**

**User Registration**

* **URL:** `/auth/register`
* **Method:** POST
* **Body (JSON):**

```json
{
  "email": "testuser@example.com",
  "password": "testpassword"
}
```

* **Response (JSON):**

```json
{
  "id": 1,
  "email": "testuser@example.com"
}
```

**User Login**

* **URL:** `/auth/login`
* **Method:** POST
* **Body (JSON):**

```json
{
  "email": "testuser@example.com",
  "password": "testpassword"
}
```

* **Response (JSON):**

```json
{
  "token": "your_jwt_token"
}
```

**Create Transaction**

* **URL:** `/transactions`
* **Method:** POST
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

* **Body (JSON):**

```json
{
  "amount": 100,
  "type": "EXPENSE",
  "categoryId": 1
}
```

* **Response (JSON):**

```json
{
  "id": 1,
  "amount": 100,
  "type": "EXPENSE",
  "categoryId": 1,
  "userId": 1,
  "date": "2024-05-27T00:00:00.000Z"
}
```

**Get Transactions**

* **URL:** `/transactions`
* **Method:** GET
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

* **Response (JSON):**

```json
[
  {
    "id": 1,
    "amount": 100,
    "type": "EXPENSE",
    "categoryId": 1,
    "userId": 1,
    "date": "2024-05-27T00:00:00.000Z"
  }
]
```

**Create Budget**

* **URL:** `/budgets`
* **Method:** POST
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

* **Body (JSON):**

```json
{
  "amount": 500,
  "categoryId": 1,
  "startDate": "2024-05-01T00:00:00.000Z",
  "endDate": "2024-05-31T23:59:59.999Z"
}
```

* **Response (JSON):**

```json
{
  "id": 1,
  "amount": 500,
  "categoryId": 1,
  "userId": 1,
  "startDate": "2024-05-01T00:00:00.000Z",
  "endDate": "2024-05-31T23:59:59.999Z"
}
```

**Get Budgets**

* **URL:** `/budgets`
* **Method:** GET
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

## API Endpoints (continued)

**Create Category**

* **URL:** `/categories`
* **Method:** POST
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

* **Body (JSON):**

```json
{ "name": "Groceries" }
```

* **Response (JSON):**

```json
{ "id": 1, "name": "Groceries" }
```

**Get Categories**

* **URL:** `/categories`
* **Method:** GET
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

* **Response (JSON):**

```json
[ { "id": 1, "name": "Groceries" } ]
```

**Monthly Financial Report**

* **URL:** `/reports/monthly?month=5&year=2024`
* **Method:** GET
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

* **Response (JSON):**

```json
[ { "id": 1, "amount": 100, "type": "EXPENSE", "categoryId": 1, "userId": 1, "date": "2024-05-27T00:00:00.000Z" } ]
```

**Category-wise Expense Report with Budgets**

* **URL:** `/reports/category-wise?month=5&year=2024&categoryId=1`
* **Method:** GET
* **Headers:**

  * `Authorization: Bearer <your_jwt_token>`

* **Response (JSON):**

```json
{ "transactions": [ { "id": 1, "amount": 100, "type": "EXPENSE", "categoryId": 1, "userId": 1, "date": "2024-05-27T00:00:00.000Z" } ], "budgets": [ { "id": 1, "amount": 500, "categoryId": 1, "userId": 1, "startDate": "2024-05-01T00:00:00.000Z", "endDate": "2024-05-31T23:59:59.999Z" } ] }
```

## Running Tests in Postman

1. Open Postman and create a new collection.
2. Add requests to the collection for each endpoint described above.
3. For each request, set the appropriate method, URL, headers (including authorization), and body (if applicable).
4. Save the collection and run the requests to test the API endpoints.
