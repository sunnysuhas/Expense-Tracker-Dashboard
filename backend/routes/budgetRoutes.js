import express from "express";
import { budgetQueryRules, budgetRules, getBudget, upsertBudget } from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.get("/", budgetQueryRules, validate, getBudget);
router.post("/", budgetRules, validate, upsertBudget);
router.put("/", budgetRules, validate, upsertBudget);

export default router;
