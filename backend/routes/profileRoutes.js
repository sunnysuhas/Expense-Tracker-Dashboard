import express from "express";
import { changePassword, getProfile, passwordRules, profileRules, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.get("/", getProfile);
router.put("/", profileRules, validate, updateProfile);
router.put("/password", passwordRules, validate, changePassword);

export default router;
