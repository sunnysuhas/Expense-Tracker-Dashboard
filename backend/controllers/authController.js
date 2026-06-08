import { OAuth2Client } from "google-auth-library";
import { body } from "express-validator";
import crypto from "node:crypto";
import { isDemoMode } from "../config/db.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { demoStore } from "../utils/demoStore.js";
import { signToken } from "../utils/token.js";

const authResponse = (user) => ({
  token: signToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt
  }
});

const usernameBase = (email = "user") => {
  const seed = email.split("@")[0] || "user";
  return seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "user";
};

const uniqueUsername = async (email) => {
  const base = usernameBase(email);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = crypto.randomBytes(3).toString("hex");
    const username = `${base}-${suffix}`;
    const exists = await User.exists({ username });
    if (!exists) return username;
  }

  return `${base}-${Date.now().toString(36)}-${crypto.randomBytes(2).toString("hex")}`;
};

export const registerRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

export const loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required")
];

export const forgotPasswordRules = [
  body("email").isEmail().normalizeEmail().withMessage("Enter a valid email")
];

export const resetPasswordRules = [
  body("token").trim().isLength({ min: 16 }).withMessage("Reset token is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (isDemoMode()) {
    const user = await demoStore.register({ name, email, password });
    return res.status(201).json(authResponse(user));
  }

  const exists = await User.findOne({ email });

  if (exists) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, username: await uniqueUsername(email) });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (isDemoMode()) {
    const user = await demoStore.login({ email, password });
    return res.json(authResponse(user));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  res.json(authResponse(user));
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error("Google login is not configured");
    error.statusCode = 503;
    throw error;
  }
  if (!credential) {
    const error = new Error("Google credential is required");
    error.statusCode = 422;
    throw error;
  }

  let payload;
  try {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    payload = ticket.getPayload();
  } catch {
    const error = new Error("Google login failed. Please try again.");
    error.statusCode = 401;
    throw error;
  }

  if (isDemoMode()) {
    const user = demoStore.googleUser(payload);
    return res.json(authResponse(user));
  }

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      username: await uniqueUsername(payload.email),
      avatar: payload.picture,
      googleId: payload.sub
    });
  } else {
    user.username = user.username || (await uniqueUsername(payload.email));
    user.avatar = user.avatar || payload.picture;
    user.googleId = user.googleId || payload.sub;
    await user.save();
  }

  res.json(authResponse(user));
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: "Logged out successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (isDemoMode()) {
    const reset = demoStore.createPasswordReset(email);
    return res.json({
      message: "If an account exists, a password reset link has been prepared.",
      resetToken: reset?.token || undefined
    });
  }

  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");
  if (!user) {
    return res.json({ message: "If an account exists, a password reset link has been prepared." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  res.json({
    message: "If an account exists, a password reset link has been prepared.",
    resetToken: process.env.NODE_ENV === "production" ? undefined : token
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (isDemoMode()) {
    const user = await demoStore.resetPassword(token, password);
    return res.json(authResponse(user));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  }).select("+password +passwordResetToken +passwordResetExpires");

  if (!user) {
    const error = new Error("Reset token is invalid or expired");
    error.statusCode = 400;
    throw error;
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json(authResponse(user));
});
