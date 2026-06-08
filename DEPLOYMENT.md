# Deployment Guide

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add the Render outbound IPs or temporarily allow `0.0.0.0/0` during setup.
4. Copy the connection string into `backend/.env` as `MONGODB_URI`.

## Backend on Render

1. Create a new Web Service.
2. Set root directory to `backend`.
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm start
```

5. Add environment variables from `backend/.env.example`.
6. Set `CLIENT_URL` to the deployed Vercel frontend URL.

## Frontend on Vercel

1. Import the repository.
2. Set root directory to `frontend`.
3. Build command:

```bash
npm run build
```

4. Output directory:

```bash
dist
```

5. Add environment variables from `frontend/.env.example`.
6. Set `VITE_API_URL` to the Render backend URL plus `/api`.

## Production Checklist

- Use strong `JWT_SECRET`.
- Configure `GOOGLE_CLIENT_ID` on both frontend and backend.
- Restrict MongoDB network access before public launch.
- Set `NODE_ENV=production`.
- Confirm CORS `CLIENT_URL` matches the Vercel domain.
