# Finora – Premium Expense Tracker Dashboard

Finora is a full-stack personal finance SaaS dashboard featuring rich analytics, smart budgets, interactive charts, data exports, theme persistence, and secure authentication.

---

## Internship Submission Details
* **Organization**: Codtech IT Solutions Private Limited
* **Intern ID**: CITS1993
* **Full Name**: Naguru Suhas
* **Duration**: 8 Weeks (MERN Stack Track)

---

## Project Links
* **GitHub Repository**: [https://github.com/sunnysuhas/Expense-Tracker-Dashboard](https://github.com/sunnysuhas/Expense-Tracker-Dashboard)
* **Live Application**: [https://expense-tracker-dashboard-mauve.vercel.app](https://expense-tracker-dashboard-mauve.vercel.app)
* **Backend API URL**: [https://expense-tracker-dashboard-dkio.onrender.com](https://expense-tracker-dashboard-dkio.onrender.com)
* **API Health Check**: [https://expense-tracker-dashboard-dkio.onrender.com/api/health](https://expense-tracker-dashboard-dkio.onrender.com/api/health)

---

## Project Overview
Finora is built to simplify personal wealth management by tracking cash flow with automated calculations. It eliminates manual bookkeeping errors by compiling incomes and expenses into visual metrics like monthly balances, savings rates, and budget pressure gauges.

## Project Scope
The scope of this project includes:
- **Authentication**: JWT-based sessions, password hashing with bcrypt, credentials validation, and Google OAuth integration.
- **Transaction CRUD**: Income and expense tracking with full search, multi-field filtering, pagination, and multi-field sorting.
- **Budgeting & Savings Goals**: Monthly spending limits with warning triggers and progress-funded savings metrics.
- **Analytics Visuals**: Charts detailing monthly spending patterns, savings trends, and category breakdowns.
- **Data Portability**: Clean CSV sheets and formatted PDF ledger exports.

---

## Architecture Overview
The system follows a classic decoupled Client-Server architecture:
1. **Frontend (React)**: Component-driven Single Page Application built on top of Vite. Manages client state, authentication context, and interactive visual charts.
2. **Backend (Express)**: Secure REST API handling authentication, controller validations, rate-limiting, and middleware operations.
3. **Database (MongoDB)**: Structured collections modeling users, transactions, budgets, and savings goals.

---

## Technology Stack

### Frontend:
- **React** (v18) & **Vite** — Core UI framework & bundling
- **Tailwind CSS** — Custom theme styling with dark mode support
- **Framer Motion** — Smooth micro-animations and page transitions
- **Recharts** — SVG charting engines (pie, area, bar, line charts)
- **Axios** — HTTP requests client with credentials configurations
- **jspdf** & **jspdf-autotable** — Native PDF generation exports

### Backend:
- **Node.js** & **Express** — Execution server & routing
- **Mongoose** — ODM mapper for MongoDB
- **jsonwebtoken** & **bcryptjs** — JWT sessions and security hashing
- **Helmet**, **compression**, **express-rate-limit** — Production API hardening

---

## Folder Structure

```text
├── backend/
│   ├── config/          # DB connections
│   ├── controllers/     # API logic
│   ├── middleware/      # Auth, security, and validations
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper libraries and stores
│   └── server.js        # Entry server script
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios client
│   │   ├── components/  # Layout, UI, and charts
│   │   ├── context/     # Auth and theme contexts
│   │   ├── pages/       # SPA Views
│   │   ├── styles/      # Globals and Tailwind
│   │   ├── utils/       # Formatter and export scripts
│   │   └── main.jsx     # Root mount element
├── screenshots/         # 12 actual UI screenshots
├── output-images/       # 11 action verification captures
└── documentation/       # Compiled API, database, and PDF reports
```

---

## Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or run in local demo fallback mode)

### 1. Clone & Install
```bash
git clone https://github.com/sunnysuhas/Expense-Tracker-Dashboard.git
cd Expense-Tracker-Dashboard
npm run install:all
```

### 2. Configure Environment Variables

Create `backend/.env` at `backend/` directory:
```env
PORT=5050
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://127.0.0.1:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
*Note: If `MONGODB_URI` is not provided, the API automatically triggers safe in-memory demo mode.*

Create `frontend/.env` at `frontend/` directory:
```env
VITE_API_URL=http://127.0.0.1:5050/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Run Locally
```bash
# Start backend
npm run dev:backend

# Start frontend
npm run dev:frontend
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## API Documentation Highlights
For detailed query parameters and responses, see [API_DOCUMENTATION.md](./documentation/API_DOCUMENTATION.md).

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `POST /api/auth/logout`
- **Transactions**: `GET /api/transactions`, `POST /api/transactions`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id`
- **Budgets**: `GET /api/budgets`, `PUT /api/budgets`
- **Savings Goals**: `GET /api/savings-goals`, `POST /api/savings-goals`, `PUT /api/savings-goals/:id`, `DELETE /api/savings-goals/:id`
- **Analytics**: `GET /api/analytics/summary`, `GET /api/analytics/charts`, `GET /api/analytics/activity`
- **Profile**: `GET /api/profile`, `PUT /api/profile`, `PUT /api/profile/password`

---

## Screenshots Section
All actual application states are saved in the [screenshots](./screenshots/) folder.
* **Landing Page**: [landing_page.png](./screenshots/landing_page.png)
* **Login Page**: [login_page.png](./screenshots/login_page.png)
* **Register Page**: [register_page.png](./screenshots/register_page.png)
* **Dashboard View**: [dashboard.png](./screenshots/dashboard.png)
* **Transactions Log**: [transactions.png](./screenshots/transactions.png)
* **Analytics Metrics**: [analytics.png](./screenshots/analytics.png)
* **Budget Limits**: [budget_planner.png](./screenshots/budget_planner.png)
* **Savings Goal Targets**: [savings_goals.png](./screenshots/savings_goals.png)
* **Profile Settings**: [profile.png](./screenshots/profile.png)
* **Theme Preferences**: [settings.png](./screenshots/settings.png)
* **Premium Dark Mode**: [dark_mode.png](./screenshots/dark_mode.png)
* **Mobile Responsive View**: [mobile_responsive.png](./screenshots/mobile_responsive.png)

---

## Output Images Section
Successful application flow captures are saved in the [output-images](./output-images/) folder.
* **Registration Success**: [registration_success.png](./output-images/registration_success.png)
* **Login Success**: [login_success.png](./output-images/login_success.png)
* **Transaction Added**: [transaction_created.png](./output-images/transaction_created.png)
* **Transaction Updated**: [transaction_updated.png](./output-images/transaction_updated.png)
* **Transaction Deleted**: [transaction_deleted.png](./output-images/transaction_deleted.png)
* **Budget Limit Set**: [budget_created.png](./output-images/budget_created.png)
* **Goal Added**: [savings_goal_added.png](./output-images/savings_goal_added.png)
* **Profile Updated**: [profile_updated.png](./output-images/profile_updated.png)
* **CSV Report Ready**: [csv_export.png](./output-images/csv_export.png)
* **PDF Sheet Exported**: [pdf_export.png](./output-images/pdf_export.png)
* **Interactive Analytics Summary**: [analytics_dashboard.png](./output-images/analytics_dashboard.png)

---

## Documentation Section
- **PDF Report**: [Project_Documentation.pdf](./documentation/Project_Documentation.pdf)
- **API Documentation**: [API_DOCUMENTATION.md](./documentation/API_DOCUMENTATION.md)
- **Database Schema Design**: [DATABASE_DESIGN.md](./documentation/DATABASE_DESIGN.md)
- **QA Testing Matrix**: [TESTING_REPORT.md](./documentation/TESTING_REPORT.md)
- **Production Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Final Submission Checklist**: [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md)

---

## Future Enhancements
- **Banks Integration**: Parse transaction receipts or banker SMS logs to automatically log values.
- **Smart Budgets Advisor**: LLM powered chat modules to suggest budget cutdowns.
- **Group expense splits**: Simple split bills integrations for shared house utilities.

---

## Author Information
* **Name**: Naguru Suhas
* **Intern ID**: CITS1993
* **Role**: Full-Stack Developer Intern
* **Organization**: Codtech IT Solutions Private Limited
