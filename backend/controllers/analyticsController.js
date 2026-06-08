import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { isDemoMode } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { demoStore } from "../utils/demoStore.js";

const monthWindow = (monthOffset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);
  return { start, end, month: start.getMonth() + 1, year: start.getFullYear() };
};

const compactMonth = (date) =>
  date.toLocaleString("en-US", { month: "short", year: "2-digit" });

export const getSummary = asyncHandler(async (req, res) => {
  if (isDemoMode()) return res.json(demoStore.summary(req.user._id));

  const { start, end, month, year } = monthWindow();
  const prev = monthWindow(-1);

  const [totals, monthTotals, prevExpenses, count, budget, categories] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: start, $lt: end } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: "expense", date: { $gte: prev.start, $lt: prev.end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    Transaction.countDocuments({ userId: req.user._id }),
    Budget.findOne({ userId: req.user._id, month, year }),
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ])
  ]);

  const asMap = (rows) => Object.fromEntries(rows.map((row) => [row._id, row.total]));
  const all = asMap(totals);
  const current = asMap(monthTotals);
  const totalIncome = all.income || 0;
  const totalExpenses = all.expense || 0;
  const monthlyIncome = current.income || 0;
  const monthlyExpenses = current.expense || 0;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;
  const monthlyBudget = budget?.monthlyBudget || 0;
  const budgetUsed = monthlyBudget ? Math.round((monthlyExpenses / monthlyBudget) * 100) : 0;
  const previousExpenseTotal = prevExpenses[0]?.total || 0;
  const spendingChange = previousExpenseTotal
    ? Math.round(((monthlyExpenses - previousExpenseTotal) / previousExpenseTotal) * 100)
    : 0;
  const healthScore = Math.max(0, Math.min(100, 100 - Math.max(0, budgetUsed - 50) - Math.max(0, -savingsRate)));

  res.json({
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    monthlySavings,
    savingsRate,
    totalTransactions: count,
    currentMonthSpending: monthlyExpenses,
    monthlyBudgetStatus: monthlyBudget ? `${budgetUsed}% used` : "No budget set",
    monthlyBudget,
    budgetUsed,
    budgetHealthScore: Math.round(healthScore),
    highestSpendingCategory: categories[0]?._id || "None",
    lowestSpendingCategory: categories[categories.length - 1]?._id || "None",
    spendingChange,
    insights: [
      categories[0] ? `You spent most on ${categories[0]._id} this month.` : "Add expenses to unlock category insights.",
      spendingChange > 0
        ? `Spending increased by ${spendingChange}% compared with last month.`
        : `Spending decreased by ${Math.abs(spendingChange)}% compared with last month.`,
      `You saved INR ${monthlySavings.toLocaleString("en-IN")} this month.`,
      `Budget health score is ${Math.round(healthScore)}/100.`
    ]
  });
});

export const getCharts = asyncHandler(async (req, res) => {
  if (isDemoMode()) return res.json(demoStore.charts(req.user._id));

  const start = new Date();
  start.setMonth(start.getMonth() - 5, 1);
  start.setHours(0, 0, 0, 0);

  const [categoryDistribution, monthlyRows] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: "expense" } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $sort: { value: -1 } }
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: start } } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])
  ]);

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index), 1);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: compactMonth(date),
      income: 0,
      expense: 0,
      savings: 0
    };
  });

  monthlyRows.forEach((row) => {
    const target = months.find((item) => item.year === row._id.year && item.month === row._id.month);
    if (target) target[row._id.type] = row.total;
  });

  months.forEach((item) => {
    item.savings = item.income - item.expense;
  });

  res.json({
    categoryDistribution: categoryDistribution.map((item) => ({ name: item._id, value: item.value })),
    monthlyExpenses: months.map((item) => ({ month: item.label, amount: item.expense })),
    incomeVsExpense: months.map((item) => ({ month: item.label, income: item.income, expense: item.expense })),
    savingsTrend: months.map((item) => ({ month: item.label, savings: item.savings })),
    categoryTrend: categoryDistribution.slice(0, 6).map((item) => ({ category: item._id, amount: item.value }))
  });
});

export const getActivity = asyncHandler(async (req, res) => {
  if (isDemoMode()) return res.json(demoStore.activity(req.user._id));

  const transactions = await Transaction.find({ userId: req.user._id }).sort({ updatedAt: -1 }).limit(10);
  res.json(
    transactions.map((item) => ({
      id: item._id,
      label: `${item.createdAt.getTime() === item.updatedAt.getTime() ? "Added" : "Updated"} ${item.title}`,
      amount: item.type === "income" ? item.amount : -item.amount,
      category: item.category,
      timestamp: item.updatedAt
    }))
  );
});
