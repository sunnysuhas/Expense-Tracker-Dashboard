import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const now = new Date();
const monthDate = (offset, day) => new Date(now.getFullYear(), now.getMonth() + offset, day);

const seededUserId = "demo-user";
const seededPasswordHash = bcrypt.hashSync("Password123", 10);

const store = {
  users: [
    {
      _id: seededUserId,
      name: "Aarav Mehta",
      email: "demo@finora.app",
      password: seededPasswordHash,
      avatar: "",
      createdAt: monthDate(-4, 4),
      updatedAt: monthDate(-4, 4)
    }
  ],
  transactions: [
    ["Salary", 85000, "income", "Salary", "Monthly salary", monthDate(0, 1)],
    ["Freelance UI audit", 22000, "income", "Freelance", "Client payment", monthDate(0, 6)],
    ["Rent and utilities", 26500, "expense", "Bills", "Apartment and electricity", monthDate(0, 3)],
    ["Groceries", 7800, "expense", "Food", "Weekly grocery run", monthDate(0, 8)],
    ["Metro card", 2200, "expense", "Transport", "Monthly commute pass", monthDate(0, 9)],
    ["Sneakers", 5200, "expense", "Shopping", "Running shoes", monthDate(0, 12)],
    ["Mutual fund SIP", 15000, "expense", "Investment", "Monthly SIP", monthDate(0, 14)],
    ["Movie night", 1800, "expense", "Entertainment", "Weekend outing", monthDate(0, 18)],
    ["Health checkup", 3200, "expense", "Health", "Routine tests", monthDate(0, 20)],
    ["Online course", 4500, "expense", "Education", "Data visualization course", monthDate(-1, 11)],
    ["Goa tickets", 9400, "expense", "Travel", "Flight booking", monthDate(-1, 17)],
    ["Salary", 85000, "income", "Salary", "Monthly salary", monthDate(-1, 1)],
    ["Freelance dashboard", 18000, "income", "Freelance", "Analytics project", monthDate(-1, 9)],
    ["Groceries", 9200, "expense", "Food", "Monthly food expenses", monthDate(-1, 6)],
    ["Shopping", 12800, "expense", "Shopping", "Festive shopping", monthDate(-1, 21)],
    ["Salary", 83000, "income", "Salary", "Monthly salary", monthDate(-2, 1)],
    ["Bills", 24100, "expense", "Bills", "Rent and subscriptions", monthDate(-2, 4)]
  ].map(([title, amount, type, category, notes, date], index) => ({
    _id: `txn-${index + 1}`,
    title,
    amount,
    type,
    category,
    notes,
    date,
    userId: seededUserId,
    createdAt: date,
    updatedAt: date
  })),
  budgets: [
    {
      _id: "budget-current",
      userId: seededUserId,
      monthlyBudget: 75000,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      createdAt: monthDate(0, 1),
      updatedAt: monthDate(0, 1)
    }
  ],
  resetTokens: []
};

const publicUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

const matchMonth = (date, month, year) => {
  const value = new Date(date);
  return value.getMonth() + 1 === Number(month) && value.getFullYear() === Number(year);
};

const monthWindow = (offset = 0) => {
  const date = new Date();
  date.setMonth(date.getMonth() + offset, 1);
  return { month: date.getMonth() + 1, year: date.getFullYear() };
};

const monthLabel = (month, year) =>
  new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short", year: "2-digit" });

const userTransactions = (userId) => store.transactions.filter((item) => item.userId === String(userId));

const toResponse = (item) => ({ ...item });

const sum = (items, predicate) =>
  items.filter(predicate).reduce((total, item) => total + Number(item.amount || 0), 0);

const sortedByDate = (items) =>
  [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const demoStore = {
  async register({ name, email, password }) {
    const normalized = email.toLowerCase();
    if (store.users.some((user) => user.email === normalized)) {
      const error = new Error("An account with this email already exists");
      error.statusCode = 409;
      throw error;
    }
    const user = {
      _id: randomUUID(),
      name,
      email: normalized,
      password: await bcrypt.hash(password, 12),
      avatar: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.users.push(user);
    return publicUser(user);
  },

  async login({ email, password }) {
    const user = store.users.find((item) => item.email === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
    return publicUser(user);
  },

  createPasswordReset(email) {
    const user = store.users.find((item) => item.email === email.toLowerCase());
    if (!user) return null;
    const token = randomUUID().replaceAll("-", "") + randomUUID().replaceAll("-", "");
    store.resetTokens = store.resetTokens.filter((item) => item.userId !== user._id);
    store.resetTokens.push({
      token,
      userId: user._id,
      expiresAt: Date.now() + 15 * 60 * 1000
    });
    return { token };
  },

  async resetPassword(token, password) {
    const reset = store.resetTokens.find((item) => item.token === token && item.expiresAt > Date.now());
    if (!reset) {
      const error = new Error("Reset token is invalid or expired");
      error.statusCode = 400;
      throw error;
    }
    const user = store.users.find((item) => item._id === reset.userId);
    user.password = await bcrypt.hash(password, 12);
    user.updatedAt = new Date();
    store.resetTokens = store.resetTokens.filter((item) => item.token !== token);
    return publicUser(user);
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = store.users.find((item) => item._id === String(userId));
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      const error = new Error("Current password is incorrect");
      error.statusCode = 401;
      throw error;
    }
    user.password = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date();
    return publicUser(user);
  },

  googleUser(payload) {
    let user = store.users.find((item) => item.email === payload.email.toLowerCase());
    if (!user) {
      user = {
        _id: randomUUID(),
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: "",
        avatar: payload.picture || "",
        googleId: payload.sub,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      store.users.push(user);
    }
    return publicUser(user);
  },

  findUserById(id) {
    return publicUser(store.users.find((user) => user._id === String(id)));
  },

  listTransactions(userId, query = {}) {
    const { search, type, category, from, to, sort = "latest", all } = query;
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    let rows = userTransactions(userId);
    if (type) rows = rows.filter((item) => item.type === type);
    if (category) rows = rows.filter((item) => item.category === category);
    if (from) rows = rows.filter((item) => new Date(item.date) >= new Date(from));
    if (to) rows = rows.filter((item) => new Date(item.date) <= new Date(to));
    if (search) {
      const needle = search.toLowerCase();
      rows = rows.filter(
        (item) => item.title.toLowerCase().includes(needle) || item.category.toLowerCase().includes(needle)
      );
    }
    const sorters = {
      latest: (a, b) => new Date(b.date) - new Date(a.date),
      oldest: (a, b) => new Date(a.date) - new Date(b.date),
      highest: (a, b) => b.amount - a.amount,
      lowest: (a, b) => a.amount - b.amount
    };
    const sorted = [...rows].sort(sorters[sort] || sorters.latest);
    const total = sorted.length;
    const paged = all === "true" ? sorted : sorted.slice((page - 1) * limit, page * limit);
    return {
      transactions: paged.map(toResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    };
  },

  getTransaction(userId, id) {
    return toResponse(userTransactions(userId).find((item) => item._id === id));
  },

  createTransaction(userId, payload) {
    const transaction = {
      _id: randomUUID(),
      ...payload,
      amount: Number(payload.amount),
      userId: String(userId),
      date: new Date(payload.date),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.transactions.push(transaction);
    return toResponse(transaction);
  },

  updateTransaction(userId, id, payload) {
    const index = store.transactions.findIndex((item) => item._id === id && item.userId === String(userId));
    if (index === -1) return null;
    store.transactions[index] = {
      ...store.transactions[index],
      ...payload,
      amount: Number(payload.amount),
      date: new Date(payload.date),
      updatedAt: new Date()
    };
    return toResponse(store.transactions[index]);
  },

  deleteTransaction(userId, id) {
    const index = store.transactions.findIndex((item) => item._id === id && item.userId === String(userId));
    if (index === -1) return null;
    return store.transactions.splice(index, 1)[0];
  },

  upsertBudget(userId, payload) {
    const index = store.budgets.findIndex(
      (item) => item.userId === String(userId) && item.month === Number(payload.month) && item.year === Number(payload.year)
    );
    const budget = {
      _id: index === -1 ? randomUUID() : store.budgets[index]._id,
      userId: String(userId),
      monthlyBudget: Number(payload.monthlyBudget),
      month: Number(payload.month),
      year: Number(payload.year),
      createdAt: index === -1 ? new Date() : store.budgets[index].createdAt,
      updatedAt: new Date()
    };
    if (index === -1) store.budgets.push(budget);
    else store.budgets[index] = budget;
    return toResponse(budget);
  },

  budgetStatus(userId, month = now.getMonth() + 1, year = now.getFullYear()) {
    const budget = store.budgets.find(
      (item) => item.userId === String(userId) && item.month === Number(month) && item.year === Number(year)
    );
    const monthlyBudget = budget?.monthlyBudget || 0;
    const spent = sum(userTransactions(userId), (item) => item.type === "expense" && matchMonth(item.date, month, year));
    const remaining = Math.max(monthlyBudget - spent, 0);
    const used = monthlyBudget ? Math.min(Math.round((spent / monthlyBudget) * 100), 999) : 0;
    const status = used >= 90 ? "Critical" : used >= 70 ? "Warning" : "Safe";
    return { budget: budget || null, monthlyBudget, spent, remaining, used, status, month: Number(month), year: Number(year) };
  },

  summary(userId) {
    const rows = userTransactions(userId);
    const current = monthWindow();
    const previous = monthWindow(-1);
    const totalIncome = sum(rows, (item) => item.type === "income");
    const totalExpenses = sum(rows, (item) => item.type === "expense");
    const monthlyIncome = sum(rows, (item) => item.type === "income" && matchMonth(item.date, current.month, current.year));
    const monthlyExpenses = sum(rows, (item) => item.type === "expense" && matchMonth(item.date, current.month, current.year));
    const prevExpenses = sum(rows, (item) => item.type === "expense" && matchMonth(item.date, previous.month, previous.year));
    const budget = this.budgetStatus(userId, current.month, current.year);
    const categories = Object.entries(
      rows
        .filter((item) => item.type === "expense" && matchMonth(item.date, current.month, current.year))
        .reduce((acc, item) => ({ ...acc, [item.category]: (acc[item.category] || 0) + item.amount }), {})
    ).sort((a, b) => b[1] - a[1]);
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;
    const spendingChange = prevExpenses ? Math.round(((monthlyExpenses - prevExpenses) / prevExpenses) * 100) : 0;
    const budgetUsed = budget.monthlyBudget ? Math.round((monthlyExpenses / budget.monthlyBudget) * 100) : 0;
    const healthScore = Math.max(0, Math.min(100, 100 - Math.max(0, budgetUsed - 50) - Math.max(0, -savingsRate)));

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      monthlySavings,
      savingsRate,
      totalTransactions: rows.length,
      currentMonthSpending: monthlyExpenses,
      monthlyBudgetStatus: budget.monthlyBudget ? `${budgetUsed}% used` : "No budget set",
      monthlyBudget: budget.monthlyBudget,
      budgetUsed,
      budgetHealthScore: Math.round(healthScore),
      highestSpendingCategory: categories[0]?.[0] || "None",
      lowestSpendingCategory: categories[categories.length - 1]?.[0] || "None",
      spendingChange,
      insights: [
        categories[0] ? `You spent most on ${categories[0][0]} this month.` : "Add expenses to unlock category insights.",
        spendingChange > 0
          ? `Spending increased by ${spendingChange}% compared with last month.`
          : `Spending decreased by ${Math.abs(spendingChange)}% compared with last month.`,
        `You saved INR ${monthlySavings.toLocaleString("en-IN")} this month.`,
        `Budget health score is ${Math.round(healthScore)}/100.`
      ]
    };
  },

  charts(userId) {
    const rows = userTransactions(userId);
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index), 1);
      return { month: date.getMonth() + 1, year: date.getFullYear(), label: monthLabel(date.getMonth() + 1, date.getFullYear()) };
    });
    const monthly = months.map((item) => {
      const income = sum(rows, (row) => row.type === "income" && matchMonth(row.date, item.month, item.year));
      const expense = sum(rows, (row) => row.type === "expense" && matchMonth(row.date, item.month, item.year));
      return { month: item.label, income, expense, savings: income - expense, amount: expense };
    });
    const categoryMap = rows
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => ({ ...acc, [item.category]: (acc[item.category] || 0) + item.amount }), {});
    const categories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, category: name, value, amount: value }));

    return {
      categoryDistribution: categories,
      monthlyExpenses: monthly.map(({ month, amount }) => ({ month, amount })),
      incomeVsExpense: monthly.map(({ month, income, expense }) => ({ month, income, expense })),
      savingsTrend: monthly.map(({ month, savings }) => ({ month, savings })),
      categoryTrend: categories.slice(0, 6)
    };
  },

  activity(userId) {
    return sortedByDate(userTransactions(userId))
      .slice(0, 10)
      .map((item) => ({
        id: item._id,
        label: `${new Date(item.createdAt).getTime() === new Date(item.updatedAt).getTime() ? "Added" : "Updated"} ${item.title}`,
        amount: item.type === "income" ? item.amount : -item.amount,
        category: item.category,
        timestamp: item.updatedAt
      }));
  },

  profile(userId) {
    const user = this.findUserById(userId);
    const rows = userTransactions(userId);
    const totalIncome = sum(rows, (item) => item.type === "income");
    const totalExpenses = sum(rows, (item) => item.type === "expense");
    return {
      user,
      stats: {
        totalTransactions: rows.length,
        totalIncome,
        totalExpenses,
        savingsSummary: totalIncome - totalExpenses
      }
    };
  },

  updateProfile(userId, payload) {
    const index = store.users.findIndex((user) => user._id === String(userId));
    if (index === -1) return null;
    store.users[index] = { ...store.users[index], ...payload, updatedAt: new Date() };
    return this.profile(userId);
  }
};
