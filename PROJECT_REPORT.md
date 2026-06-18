# Finora – Project Report

## Project Details
* **Organization**: Codtech IT Solutions Private Limited
* **Intern ID**: CITS1993
* **Full Name**: Naguru Suhas
* **Duration**: 8 Weeks (MERN stack personal finance dashboard development)

---

## 1. Project Abstract
Finora is a comprehensive personal finance and expense tracking application that provides users with a visual, secure, and interactive workspace to manage cash flow. It solves the issue of manual cash flow logs by offering a clean, automated web dashboard featuring rich graphics, smart budget tracking, goal setting, data exporting, and responsive layouts. 

The application is structured as a full-stack SPA (Single Page Application) using React for the interface, Node.js & Express for the REST API, and MongoDB as the document database.

---

## 2. Problem Statement
Many individuals fail to maintain their savings rate and stay within monthly budgets because financial tracking tools are either overly complex, require manual spreadsheet maintenance, or fail to offer actionable insights. Additionally, traditional finance apps do not allow for simple offline exports (such as CSV and PDF) for bookkeeping, nor do they support secure multi-device authentication (JWT and Google OAuth) with modern, visually appealing interfaces.

---

## 3. Solution Overview
Finora addresses these problems with the following core items:
- **Instant Financial Insights**: Precalculated balance metrics, savings rates, and budget health scores.
- **Visual Analytics**: Interactive, animated chart visualizers to study spending trends, savings curves, and category distributions.
- **Budget Control**: Real-time spending limits that warn users when they approach thresholds.
- **Offline Storage**: Export utilities to instantly save records as clean CSV tables and high-resolution PDF spreadsheets.
- **Secure Authentication**: Traditional credentials hashing with bcrypt combined with JWT sessions and Google OAuth integration.

---

## 4. Technical Architecture
The project follows a standard decoupled architectural design:

```text
┌─────────────────┐       HTTPS       ┌──────────────────┐
│  React Client   │ ◄───────────────► │   Express API    │
│  (Vite, Vercel) │                   │ (NodeJS, Render) │
└────────┬────────┘                   └────────┬─────────┘
         │                                     │
         ▼                                     ▼
   Local Storage                        MongoDB Atlas
(Auth Token, Theme)                   (Document Store)
```

### Key Modules:
- **Client (Frontend)**: React Router v7 for routing, Axios with interceptors for auth headers, Recharts for data charts, and Tailwind CSS for custom dark-mode styling.
- **Server (Backend)**: Express routing, CORS middleware, security handlers (Helmet, compression, rate limiters), Mongoose ODM, and jsonwebtoken signer.

---

## 5. Development Timeline (8-Week Lifecycle)

* **Weeks 1-2**: Requirements engineering, database schema design, and local MongoDB server setup.
* **Weeks 3-4**: Implementing JWT auth endpoints, Google OAuth sign-in API, and transaction controllers.
* **Weeks 5-6**: Designing the React SPA interface, context handlers (Auth, Theme), and custom UI components.
* **Weeks 7-8**: Integrating Recharts, adding CSV/PDF export capabilities, debugging, writing automated tests, and deploying to Vercel/Render.

---

## 6. Challenges Faced & Mitigations

1. **Third-Party Script Vulnerabilities**:
   - *Challenge*: Malicious requests or security leaks from loading scripts.
   - *Mitigation*: Configured Helmet middleware with strict Content Security Policy (CSP) headers and input sanitizers.
2. **Offline Mode Fallback**:
   - *Challenge*: Keeping the application fully functional during database maintenance.
   - *Mitigation*: Implemented an in-memory `demoStore` database that automatically triggers if `MONGODB_URI` environment string is absent.
3. **Responsive Canvas Redraws**:
   - *Challenge*: Recharts elements failing to resize when switching screen sizes.
   - *Mitigation*: Enclosed charts in responsive containers (`ResponsiveContainer` components) and configured dynamic CSS flex boxes.

---

## 7. Future Enhancements
- **Multi-currency support**: Auto-convert balances using live exchange rates.
- **OCR Receipt Scan**: Extract transaction details automatically using optical character recognition (OCR) on uploaded receipts.
- **SMS Parser**: Read banking notification texts to auto-populate transaction rows.
- **AI Personal Advisor**: Provide personalized saving tips using an integrated LLM parser.

---

## 8. Conclusion
Finora successfully merges modern UI design with a secure, highly-performant backend service. The 8-week development cycle provided extensive, real-world MERN development experience, culminating in a recruiter-ready portfolio asset that meets all Codtech IT Solutions submission requirements.
