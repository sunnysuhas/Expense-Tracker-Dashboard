import express from "express";
import rateLimit from "express-rate-limit";
import {
  forgotPassword,
  forgotPasswordRules,
  googleLogin,
  login,
  loginRules,
  logout,
  register,
  registerRules,
  resetPassword,
  resetPasswordRules
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);
router.post("/forgot-password", authLimiter, forgotPasswordRules, validate, forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordRules, validate, resetPassword);
router.post("/google", authLimiter, googleLogin);
router.post("/logout", protect, logout);

export default router;
