# Finora - Premium Expense Tracker Dashboard

Finora is a full-stack personal finance SaaS dashboard built with React, Express, MongoDB, and JWT authentication. It includes transaction management, budget planning, savings goals, analytics, profile management, settings, exports, dark mode, and a polished responsive UI.

## Features

- User registration, login, logout, forgot password, and reset password
- JWT protected routes and API authorization
- Google OAuth integration
- Transaction CRUD with search, filters, sorting, and pagination
- Dashboard statistics, smart insights, and activity feed
- Analytics charts for expenses, income, savings, and categories
- Monthly budget planner
- Database-backed savings goals
- Profile management, settings, theme persistence, and password change
- CSV and PDF exports
- Loading states, empty states, toast notifications, and dark mode
- MongoDB Atlas production support with local demo-mode fallback

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Framer Motion, Recharts, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT, bcrypt password hashing, Google OAuth
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
    utils/
```

## Quick Start

```bash
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://127.0.0.1:5173`

Backend: `http://127.0.0.1:5050`

## Environment

Backend variables:

- `PORT` - backend server port
- `NODE_ENV` - `development` or `production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - secret key for signing JWTs
- `JWT_EXPIRES_IN` - token lifetime, for example `7d`
- `CLIENT_URL` - frontend origin
- `GOOGLE_CLIENT_ID` - Google OAuth client ID

Frontend variables:

- `VITE_API_URL` - backend API URL ending in `/api`
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

If `MONGODB_URI` is not provided, the backend runs in demo mode with in-memory sample data.

## API Highlights

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/budgets`
- `PUT /api/budgets`
- `GET /api/savings-goals`
- `POST /api/savings-goals`
- `PUT /api/savings-goals/:id`
- `DELETE /api/savings-goals/:id`
- `GET /api/analytics/summary`
- `GET /api/analytics/charts`
- `GET /api/analytics/activity`
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/profile/password`

## Verification

```bash
npm run build
npm audit --omit=dev --prefix backend
npm audit --omit=dev --prefix frontend
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md).
