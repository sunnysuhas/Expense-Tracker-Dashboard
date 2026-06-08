import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  listRules,
  transactionRules,
  updateTransaction
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.get("/", listRules, validate, getTransactions);
router.post("/", transactionRules, validate, createTransaction);
router.get("/:id", getTransaction);
router.put("/:id", transactionRules, validate, updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
