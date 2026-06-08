import { body, query } from "express-validator";
import { isDemoMode } from "../config/db.js";
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { demoStore } from "../utils/demoStore.js";

export const budgetRules = [
  body("monthlyBudget").isFloat({ min: 0 }).withMessage("Budget must be zero or more"),
  body("month").isInt({ min: 1, max: 12 }).withMessage("Month must be 1-12"),
  body("year").isInt({ min: 2020, max: 2100 }).withMessage("Year must be valid")
];

export const budgetQueryRules = [
  query("month").optional().isInt({ min: 1, max: 12 }),
  query("year").optional().isInt({ min: 2020, max: 2100 })
];

const selectedMonth = (req) => {
  const today = new Date();
  return {
    month: Number(req.query.month || req.body.month || today.getMonth() + 1),
    year: Number(req.query.year || req.body.year || today.getFullYear())
  };
};

export const upsertBudget = asyncHandler(async (req, res) => {
  const { monthlyBudget, month, year } = req.body;
  if (isDemoMode()) {
    return res.json(demoStore.upsertBudget(req.user._id, { monthlyBudget, month, year }));
  }

  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id, month, year },
    { monthlyBudget, month, year, userId: req.user._id },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json(budget);
});

export const getBudget = asyncHandler(async (req, res) => {
  const { month, year } = selectedMonth(req);
  if (isDemoMode()) return res.json(demoStore.budgetStatus(req.user._id, month, year));

  const budget = await Budget.findOne({ userId: req.user._id, month, year });
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  const [spentAgg] = await Transaction.aggregate([
    { $match: { userId: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
    { $group: { _id: null, spent: { $sum: "$amount" } } }
  ]);
  const monthlyBudget = budget?.monthlyBudget || 0;
  const spent = spentAgg?.spent || 0;
  const remaining = Math.max(monthlyBudget - spent, 0);
  const used = monthlyBudget ? Math.min(Math.round((spent / monthlyBudget) * 100), 999) : 0;
  const status = used >= 90 ? "Critical" : used >= 70 ? "Warning" : "Safe";

  res.json({ budget, monthlyBudget, spent, remaining, used, status, month, year });
});
