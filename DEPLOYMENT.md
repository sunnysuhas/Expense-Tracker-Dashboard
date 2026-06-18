# Finora Production Deployment Guide

This guide details the step-by-step instructions to deploy the Finora Expense Tracker Dashboard to production environments using **MongoDB Atlas**, **Render (Backend)**, and **Vercel (Frontend)**.

---

## 1. Database Configuration (MongoDB Atlas)

1. **Create Cluster**: Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and spin up a new shared cluster.
2. **Database Access**: Under *Database Access*, create a new database user. Use a secure password and note down the credentials.
3. **Network Access**: Under *Network Access*, add outbound server IP addresses or temporarily set access to `0.0.0.0/0` (allow access from anywhere) during testing.
4. **Connection String**: Click *Connect*, select *Drivers (Node.js)*, and copy the connection string. Replace `<db_password>` with your database user password and specify the database name (e.g. `finora`).
   - Example: `mongodb+srv://finoraadmin:<password>@nexora-cluster.gbqiuzd.mongodb.net/finora?retryWrites=true&w=majority`

---

## 2. API Deployment (Render)

Render is used to host the Express backend service.

1. **New Web Service**: Connect your GitHub repository to [Render](https://render.com/) and create a new **Web Service**.
2. **Root Directory**: Set the root directory field to `backend`.
3. **Runtime Config**:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**: Add variables from `backend/.env.example`:
   - `PORT`: `10000` (or leave default, Render sets this automatically)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *A long, randomly generated secure token string*
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: *Your deployed Vercel frontend URL* (e.g. `https://expense-tracker-dashboard-mauve.vercel.app`)
   - `GOOGLE_CLIENT_ID`: *Optional Google OAuth Client ID*

---

## 3. Client Deployment (Vercel)

Vercel is used to host the React client Single Page Application.

1. **Import Repository**: Connect your GitHub repository to [Vercel](https://vercel.com/) and import the project.
2. **Root Directory**: Set the root directory field to `frontend`.
3. **Build & Development Settings**:
   - **Framework Preset**: `Vite` (Vercel detects this automatically)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add variables from `frontend/.env.example`:
   - `VITE_API_URL`: *Your Render backend URL plus `/api`* (e.g. `https://expense-tracker-dashboard-dkio.onrender.com/api`)
   - `VITE_GOOGLE_CLIENT_ID`: *Your Google OAuth Client ID*
5. **Deploy**: Click Deploy. Vercel will build the React bundles and distribute them.

---

## 4. Production Checklist & Verification

* [x] **Secure HTTPS**: Render and Vercel automatically configure SSL certificates. Ensure client calls use `https`.
* [x] **CORS Configuration**: Verify `CLIENT_URL` in backend exactly matches the frontend domain.
* [x] **Rate Limiting Active**: Ensure rate limiters block excessive login attempts.
* [x] **Database Connectivity**: Call the backend health check `https://<api-url>/api/health` to confirm the MDB state is `connected`.
* [x] **Assets Bundled**: Verify build logs show zero compile errors.
