import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB, { getDbStatus } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { sanitizeRequest } from "./middleware/securityMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

connectDB();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173"
      ].filter(Boolean);
      if (!origin || allowed.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Finora API" });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Finora API",
    database: getDbStatus(),
    googleOAuthConfigured: Boolean(process.env.GOOGLE_CLIENT_ID)
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Finora API running on port ${port}`);
});
