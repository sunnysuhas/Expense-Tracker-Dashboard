# Finora REST API Documentation

This document describes all available endpoints of the Finora API.

## Base URL
* Local development: `http://127.0.0.1:5050/api`
* Production: `https://expense-tracker-dashboard-dkio.onrender.com/api`

---

## Authentication APIs

### 1. Register User
* **Route**: `/auth/register`
* **Method**: `POST`
* **Description**: Register a new user account.
* **Authentication Required**: No
* **Request Body**:
```json
{
  "name": "Aarav Mehta",
  "email": "demo@finora.app",
  "password": "Password123"
}
```
* **Success Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64bc8a76a5b...",
    "name": "Aarav Mehta",
    "email": "demo@finora.app",
    "avatar": "",
    "createdAt": "2026-06-18T11:44:12.000Z"
  }
}
```

### 2. Login User
* **Route**: `/auth/login`
* **Method**: `POST`
* **Description**: Authenticate with email and password to receive a JWT.
* **Authentication Required**: No
* **Request Body**:
```json
{
  "email": "demo@finora.app",
  "password": "Password123"
}
```
* **Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64bc8a76a5b...",
    "name": "Aarav Mehta",
    "email": "demo@finora.app",
    "avatar": "",
    "createdAt": "2026-06-18T11:44:12.000Z"
  }
}
```

### 3. Google OAuth Login
* **Route**: `/auth/google`
* **Method**: `POST`
* **Description**: Authenticate using a Google OAuth credential token.
* **Authentication Required**: No
* **Request Body**:
```json
{
  "credential": "google_credential_id_token..."
}
```
* **Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64bc8a76a5b...",
    "name": "Aarav Mehta",
    "email": "demo@finora.app",
    "avatar": "https://lh3.googleusercontent.com/a/...",
    "createdAt": "2026-06-18T11:44:12.000Z"
  }
}
```

### 4. Forgot Password
* **Route**: `/auth/forgot-password`
* **Method**: `POST`
* **Description**: Request a password reset link for the provided email address.
* **Authentication Required**: No
* **Request Body**:
```json
{
  "email": "demo@finora.app"
}
```
* **Success Response (200 OK)**:
```json
{
  "message": "If an account exists, a password reset link has been prepared.",
  "resetToken": "optional_token_in_development_only"
}
```

### 5. Reset Password
* **Route**: `/auth/reset-password`
* **Method**: `POST`
* **Description**: Reset user password using the token sent in the forgot-password flow.
* **Authentication Required**: No
* **Request Body**:
```json
{
  "token": "reset_token_here...",
  "password": "NewSecurePassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64bc8a76a5b...",
    "name": "Aarav Mehta",
    "email": "demo@finora.app",
    "avatar": "",
    "createdAt": "2026-06-18T11:44:12.000Z"
  }
}
```

### 6. Logout User
* **Route**: `/auth/logout`
* **Method**: `POST`
* **Description**: Log out the user.
* **Authentication Required**: Yes (JWT Bearer Token)
* **Success Response (200 OK)**:
```json
{
  "message": "Logged out successfully"
}
```

---

## Transaction APIs
All Transaction routes require a valid JWT in the `Authorization` header.

### 1. Get Transactions List
* **Route**: `/transactions`
* **Method**: `GET`
* **Description**: Get all transactions of the user with support for search, filters, pagination, and sorting.
* **Query Parameters**:
  - `search` (string): Search title or category.
  - `type` (string): Filter by type (`income` or `expense`).
  - `category` (string): Filter by category (e.g. `Food`, `Bills`, `Salary`).
  - `from` (date string YYYY-MM-DD): Filter transactions on or after this date.
  - `to` (date string YYYY-MM-DD): Filter transactions on or before this date.
  - `sort` (string): Sort order (`latest`, `oldest`, `highest`, `lowest`).
  - `page` (number): Page number (defaults to 1).
  - `limit` (number): Items per page (defaults to 10).
  - `all` (boolean): Fetch all transactions without page limits (defaults to `false`).
* **Success Response (200 OK)**:
```json
{
  "transactions": [
    {
      "_id": "txn-1",
      "title": "Monthly rent",
      "amount": 22000,
      "type": "expense",
      "category": "Bills",
      "notes": "Rent and electricity",
      "date": "2026-06-01T00:00:00.000Z",
      "userId": "demo-user",
      "createdAt": "2026-06-01T00:00:00.000Z",
      "updatedAt": "2026-06-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 17,
    "totalPages": 2
  }
}
```

### 2. Create Transaction
* **Route**: `/transactions`
* **Method**: `POST`
* **Description**: Create a new income or expense transaction.
* **Request Body**:
```json
{
  "title": "Groceries",
  "amount": 2500,
  "type": "expense",
  "category": "Food",
  "date": "2026-06-18",
  "notes": "Weekly snacks and supplies"
}
```
* **Success Response (201 Created)**:
```json
{
  "_id": "64bc9a...",
  "title": "Groceries",
  "amount": 2500,
  "type": "expense",
  "category": "Food",
  "date": "2026-06-18T00:00:00.000Z",
  "notes": "Weekly snacks and supplies",
  "userId": "64bc8a76a5b...",
  "createdAt": "2026-06-18T11:44:12.000Z",
  "updatedAt": "2026-06-18T11:44:12.000Z"
}
```

### 3. Get Single Transaction
* **Route**: `/transactions/:id`
* **Method**: `GET`
* **Description**: Retrieve transaction details by its ID.
* **Success Response (200 OK)**:
```json
{
  "_id": "txn-1",
  "title": "Monthly rent",
  "amount": 22000,
  "type": "expense",
  "category": "Bills",
  "notes": "Rent and electricity",
  "date": "2026-06-01T00:00:00.000Z",
  "userId": "demo-user"
}
```

### 4. Update Transaction
* **Route**: `/transactions/:id`
* **Method**: `PUT`
* **Description**: Update an existing transaction.
* **Request Body**: (Same schema as Create Transaction)
* **Success Response (200 OK)**: (Returns the updated transaction)

### 5. Delete Transaction
* **Route**: `/transactions/:id`
* **Method**: `DELETE`
* **Description**: Permanently delete a transaction.
* **Success Response (200 OK)**:
```json
{
  "message": "Transaction deleted"
}
```

---

## Budget APIs
All Budget routes require a valid JWT in the `Authorization` header.

### 1. Get Monthly Budget
* **Route**: `/budgets`
* **Method**: `GET`
* **Description**: Retrieve budget limits, amount spent, amount remaining, used percentage, and warning status for a given month.
* **Query Parameters**:
  - `month` (number, 1-12): Target month.
  - `year` (number): Target year.
* **Success Response (200 OK)**:
```json
{
  "budget": {
    "_id": "budget-current",
    "userId": "demo-user",
    "monthlyBudget": 75000,
    "month": 6,
    "year": 2026
  },
  "monthlyBudget": 75000,
  "spent": 58500,
  "remaining": 16500,
  "used": 78,
  "status": "Warning",
  "month": 6,
  "year": 2026
}
```

### 2. Set/Update Monthly Budget
* **Route**: `/budgets`
* **Method**: `POST` or `PUT`
* **Description**: Create or update the monthly budget limit.
* **Request Body**:
```json
{
  "monthlyBudget": 80000,
  "month": 6,
  "year": 2026
}
```
* **Success Response (200 OK)**:
```json
{
  "_id": "budget-current",
  "userId": "demo-user",
  "monthlyBudget": 80000,
  "month": 6,
  "year": 2026,
  "createdAt": "2026-06-01T00:00:00.000Z",
  "updatedAt": "2026-06-18T11:44:12.000Z"
}
```

---

## Analytics APIs
All Analytics routes require a valid JWT in the `Authorization` header.

### 1. Get Dashboard Summary
* **Route**: `/analytics/summary`
* **Method**: `GET`
* **Description**: Get key stats for the main dashboard dashboard view: balances, saving rate, monthly savings, and system-generated financial insights.
* **Success Response (200 OK)**:
```json
{
  "totalBalance": 28700,
  "totalIncome": 107000,
  "totalExpenses": 78300,
  "monthlySavings": 63500,
  "savingsRate": 75,
  "totalTransactions": 17,
  "currentMonthSpending": 58500,
  "monthlyBudgetStatus": "78% used",
  "monthlyBudget": 75000,
  "budgetUsed": 78,
  "budgetHealthScore": 72,
  "highestSpendingCategory": "Bills",
  "lowestSpendingCategory": "Entertainment",
  "spendingChange": 20,
  "insights": [
    "You spent most on Bills this month.",
    "Spending increased by 20% compared with last month.",
    "You saved INR 63,500 this month.",
    "Budget health score is 72/100."
  ]
}
```

### 2. Get Chart Metrics
* **Route**: `/analytics/charts`
* **Method**: `GET`
* **Description**: Get data arrays for rendering Recharts components: category distributions, monthly expenditure, income vs expenses, and savings curves.
* **Success Response (200 OK)**:
```json
{
  "categoryDistribution": [
    { "name": "Bills", "value": 26500, "amount": 26500 },
    { "name": "Investment", "value": 15000, "amount": 15000 }
  ],
  "monthlyExpenses": [
    { "month": "Jan 26", "amount": 24100 },
    { "month": "Feb 26", "amount": 58500 }
  ],
  "incomeVsExpense": [
    { "month": "Jan 26", "income": 83000, "expense": 24100 },
    { "month": "Feb 26", "income": 107000, "expense": 58500 }
  ],
  "savingsTrend": [
    { "month": "Jan 26", "savings": 58900 },
    { "month": "Feb 26", "savings": 48500 }
  ],
  "categoryTrend": []
}
```

### 3. Get Activity Logs
* **Route**: `/analytics/activity`
* **Method**: `GET`
* **Description**: Retrieve the list of 10 most recent transaction operations for the user activity log.
* **Success Response (200 OK)**:
```json
[
  {
    "id": "txn-12",
    "label": "Added Groceries",
    "amount": -2500,
    "category": "Food",
    "timestamp": "2026-06-18T11:44:12.000Z"
  }
]
```

---

## Profile APIs
All Profile routes require a valid JWT in the `Authorization` header.

### 1. Get Profile Details
* **Route**: `/profile`
* **Method**: `GET`
* **Description**: Get details of the currently logged in user and lifetime transaction tallies.
* **Success Response (200 OK)**:
```json
{
  "user": {
    "id": "demo-user",
    "name": "Aarav Mehta",
    "email": "demo@finora.app",
    "username": "demo",
    "avatar": "",
    "createdAt": "2026-06-01T00:00:00.000Z"
  },
  "stats": {
    "totalTransactions": 17,
    "totalIncome": 107000,
    "totalExpenses": 78300,
    "savingsSummary": 28700
  }
}
```

### 2. Update Profile Details
* **Route**: `/profile`
* **Method**: `PUT`
* **Description**: Modify user details.
* **Request Body**:
```json
{
  "name": "Aarav K. Mehta",
  "username": "aaravkmehta",
  "avatar": "https://example.com/avatar.jpg"
}
```
* **Success Response (200 OK)**: (Returns the updated profile statistics)

### 3. Change Account Password
* **Route**: `/profile/password`
* **Method**: `PUT`
* **Description**: Change password of the user.
* **Request Body**:
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewSecurePassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "message": "Password updated successfully"
}
```

---

## Savings Goal APIs
All Savings Goal routes require a valid JWT in the `Authorization` header.

### 1. Get Savings Goals List
* **Route**: `/savings-goals`
* **Method**: `GET`
* **Description**: Retrieve the list of active saving targets.
* **Success Response (200 OK)**:
```json
[
  {
    "_id": "goal-emergency",
    "userId": "demo-user",
    "name": "Emergency fund",
    "targetAmount": 150000,
    "currentAmount": 62500,
    "targetDate": "2026-11-01T00:00:00.000Z",
    "createdAt": "2026-04-18T00:00:00.000Z",
    "updatedAt": "2026-05-18T00:00:00.000Z"
  }
]
```

### 2. Create Savings Goal
* **Route**: `/savings-goals`
* **Method**: `POST`
* **Description**: Create a new savings goal target.
* **Request Body**:
```json
{
  "name": "Holiday Trip",
  "targetAmount": 80000,
  "currentAmount": 12000,
  "targetDate": "2026-12-15"
}
```
* **Success Response (201 Created)**:
```json
{
  "_id": "64bda...",
  "userId": "demo-user",
  "name": "Holiday Trip",
  "targetAmount": 80000,
  "currentAmount": 12000,
  "targetDate": "2026-12-15T00:00:00.000Z",
  "createdAt": "2026-06-18T11:44:12.000Z",
  "updatedAt": "2026-06-18T11:44:12.000Z"
}
```

### 3. Update Savings Goal
* **Route**: `/savings-goals/:id`
* **Method**: `PUT`
* **Description**: Modify the details or saved progress of a specific goal.
* **Request Body**: (Same schema as Create Savings Goal)
* **Success Response (200 OK)**: (Returns the updated savings goal)

### 4. Delete Savings Goal
* **Route**: `/savings-goals/:id`
* **Method**: `DELETE`
* **Description**: Remove a savings goal database entry.
* **Success Response (200 OK)**:
```json
{
  "message": "Savings goal deleted"
}
```
