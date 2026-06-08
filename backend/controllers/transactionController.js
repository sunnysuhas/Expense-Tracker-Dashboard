import { body, query } from "express-validator";
import { isDemoMode } from "../config/db.js";
import Transaction, { CATEGORIES } from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { demoStore } from "../utils/demoStore.js";

export const transactionRules = [
  body("title").trim().isLength({ min: 2 }).withMessage("Title is required"),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than zero"),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("category").isIn(CATEGORIES).withMessage("Choose a valid category"),
  body("date").isISO8601().withMessage("Date must be valid"),
  body("notes").optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage("Notes are too long")
];

export const listRules = [
  query("type").optional().isIn(["income", "expense"]),
  query("category").optional().isIn(CATEGORIES),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("all").optional().isBoolean()
];

const buildFilters = (req) => {
  const { search, type, category, from, to } = req.query;
  const filters = { userId: req.user._id };

  if (type) filters.type = type;
  if (category) filters.category = category;
  if (from || to) {
    filters.date = {};
    if (from) filters.date.$gte = new Date(from);
    if (to) filters.date.$lte = new Date(to);
  }
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } }
    ];
  }

  return filters;
};

const sortMap = {
  latest: { date: -1, createdAt: -1 },
  oldest: { date: 1, createdAt: 1 },
  highest: { amount: -1 },
  lowest: { amount: 1 }
};

export const getTransactions = asyncHandler(async (req, res) => {
  if (isDemoMode()) return res.json(demoStore.listTransactions(req.user._id, req.query));

  const sort = sortMap[req.query.sort] || sortMap.latest;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const filters = buildFilters(req);
  const query = Transaction.find(filters).sort(sort);
  if (req.query.all !== "true") query.skip((page - 1) * limit).limit(limit);
  const [transactions, total] = await Promise.all([
    query,
    Transaction.countDocuments(filters)
  ]);
  res.json({
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  });
});

export const getTransaction = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    const demoTransaction = demoStore.getTransaction(req.user._id, req.params.id);
    if (!demoTransaction) {
      const error = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }
    return res.json(demoTransaction);
  }

  const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(transaction);
});

export const createTransaction = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    return res.status(201).json(demoStore.createTransaction(req.user._id, req.body));
  }

  const transaction = await Transaction.create({ ...req.body, userId: req.user._id });
  res.status(201).json(transaction);
});

export const updateTransaction = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    const demoTransaction = demoStore.updateTransaction(req.user._id, req.params.id, req.body);
    if (!demoTransaction) {
      const error = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }
    return res.json(demoTransaction);
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  res.json(transaction);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    const demoTransaction = demoStore.deleteTransaction(req.user._id, req.params.id);
    if (!demoTransaction) {
      const error = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }
    return res.json({ message: "Transaction deleted" });
  }

  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Transaction deleted" });
});
