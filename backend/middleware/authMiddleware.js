import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isDemoMode } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getJwtSecret } from "../utils/token.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    const error = new Error("Not authorized. Token missing.");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = isDemoMode()
      ? demoStore.findUserById(decoded.id)
      : await User.findById(decoded.id).select("-password");
    if (!req.user) {
      const error = new Error("Not authorized. User no longer exists.");
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch {
    const error = new Error("Not authorized. Token invalid or expired.");
    error.statusCode = 401;
    throw error;
  }
});
