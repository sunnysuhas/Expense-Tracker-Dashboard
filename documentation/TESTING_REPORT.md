# Finora Testing Report

This document reports the testing procedures, verification matrix, and quality assurance audits conducted for the Finora Expense Tracker Dashboard.

## Overview
All features have been validated through end-to-end integration flows using real browser environments (automated via Playwright/Patchright) and manual API inspection. Testing confirms 100% feature compliance and execution security.

---

## Testing Matrix

| Test ID | Feature Area | Test Case Description | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Auth | Register a new user | Email: `jane.doe@finora.test`<br>Password: `Password123` | Account created, session cookie stored, redirect to `/dashboard` | **PASS** |
| **TC-02** | Auth | Login with valid credentials | Email: `demo@finora.app`<br>Password: `Password123` | Token retrieved, profile loaded, redirect to `/dashboard` | **PASS** |
| **TC-03** | Auth | Login with invalid credentials | Email: `demo@finora.app`<br>Password: `wrong_pass` | Error toast: "Invalid email or password" (HTTP 401) | **PASS** |
| **TC-04** | Auth | Google Sign-In placeholder check | Render Google login button | Script checks OAuth properties, defaults to fallback alert if client ID absent | **PASS** |
| **TC-05** | Auth | Forgot Password reset token generation | Email: `demo@finora.app` | Reset link prepared, returns token in non-production environments | **PASS** |
| **TC-06** | Dashboard | Load totals and statistics counts | Valid login session | Total Balance, Income, Expenses, and Savings rate match aggregate values | **PASS** |
| **TC-07** | Dashboard | Generate Smart Financial Insights | Seeded transaction items | Insight list correctly identifies top category and month-on-month trend | **PASS** |
| **TC-08** | Transactions | Create new Transaction | Title: `Office Supplies`<br>Amount: `1250`<br>Type: `expense` | Row added to table, balance subtracted, success toast displayed | **PASS** |
| **TC-09** | Transactions | Edit existing Transaction | Title: `Office Supplies (Updated)` | Row values change instantly, database changes committed, success toast | **PASS** |
| **TC-10** | Transactions | Delete Transaction | Select delete -> Confirm | Row removed, balances recalculated, success toast | **PASS** |
| **TC-11** | Transactions | Search, Sort and Filters | Type: `expense`<br>Search: `Groceries` | Table pagination filters list to matching rows only | **PASS** |
| **TC-12** | Budget | Set/Save monthly limit | Budget: `85000` | Saved budget index updated, Remaining budget bar recalibrated | **PASS** |
| **TC-13** | Savings Goal | Add/Save Savings Goal target | Name: `Emergency fund`<br>Target: `200000` | Goal progress bar updates to show percentage funded | **PASS** |
| **TC-14** | Analytics | Dynamic Chart Renderings | Six-month historical values | SVG curves render correctly via Recharts without throwing canvas crashes | **PASS** |
| **TC-15** | Profile | Update profile name and email | Name: `Aarav K. Mehta` | Header profile name changes instantly, local state updated | **PASS** |
| **TC-16** | Settings | Toggle Dark Mode state | Click "Toggle theme" | `html` class changes to `dark`, styles reload with premium slate palette | **PASS** |
| **TC-17** | Exports | Export filtered transactions to CSV | Click "CSV" | Browser starts downloading file matching naming preferences, success toast | **PASS** |
| **TC-18** | Exports | Export filtered transactions to PDF | Click "PDF" | `jspdf` generates tabular layout, download starts, success toast | **PASS** |
| **TC-19** | Responsive | Mobile view layouts (375px) | Render `/dashboard` | Navigation slides into mobile drawer, grids stack vertically | **PASS** |

---

## Security Verification

1. **Helmet headers**: Applied on backend to set frame guard protections, content security policies (CSP), and cross-origin controls.
2. **Rate Limiter**: Endpoint limits successfully restrict spam:
   - General API: 300 requests per 15 minutes window.
   - Auth routes: 30 requests per 15 minutes window.
3. **Data Sanitization**: MongoDB query injections prevented. Mongoose enforces schema definitions, ignoring any extra key payloads submitted on requests.
4. **JWT Verification**: Secured routes block requests with missing or expired authorization headers, returning `401 Unauthorized`.

---

## Deployment Testing
- **Frontend URL accessibility**: Verified that `https://expense-tracker-dashboard-mauve.vercel.app` loads correctly, retrieves scripts, and has valid meta configurations.
- **Backend API health check**: Endpoint `https://expense-tracker-dashboard-dkio.onrender.com/api/health` queries connection to the production MongoDB Atlas cluster, returning `status: "ok"` and `database.state: "connected"`.
