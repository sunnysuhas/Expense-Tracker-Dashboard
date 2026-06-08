import { body } from "express-validator";
import { isDemoMode } from "../config/db.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { demoStore } from "../utils/demoStore.js";

export const profileRules = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("avatar").optional({ checkFalsy: true }).isURL().withMessage("Avatar must be a valid URL")
];

export const passwordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
];

const statsFor = async (userId) => {
  const [totals, count] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]),
    Transaction.countDocuments({ userId })
  ]);
  const map = Object.fromEntries(totals.map((row) => [row._id, row.total]));
  return {
    totalTransactions: count,
    totalIncome: map.income || 0,
    totalExpenses: map.expense || 0,
    savingsSummary: (map.income || 0) - (map.expense || 0)
  };
};

export const getProfile = asyncHandler(async (req, res) => {
  if (isDemoMode()) return res.json(demoStore.profile(req.user._id));

  res.json({ user: req.user, stats: await statsFor(req.user._id) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.avatar !== undefined) updates.avatar = req.body.avatar;

  if (isDemoMode()) return res.json(demoStore.updateProfile(req.user._id, updates));

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
  res.json({ user, stats: await statsFor(req.user._id) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (isDemoMode()) {
    await demoStore.changePassword(req.user._id, currentPassword, newPassword);
    return res.json({ message: "Password updated successfully" });
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await user.matchPassword(currentPassword))) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: "Password updated successfully" });
});
