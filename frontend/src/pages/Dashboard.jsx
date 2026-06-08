import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiActivity, FiCreditCard, FiDollarSign, FiPieChart, FiTarget, FiTrendingDown, FiTrendingUp, FiZap } from "react-icons/fi";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, getErrorMessage } from "../api/http";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import InsightCard from "../components/dashboard/InsightCard";
import StatCard from "../components/dashboard/StatCard";
import ChartBox from "../components/charts/ChartBox";
import MotionPage from "../components/ui/MotionPage";
import Skeleton from "../components/ui/Skeleton";
import { currency } from "../utils/formatters";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, chartsRes, activityRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/charts"),
          api.get("/analytics/activity")
        ]);
        setSummary(summaryRes.data);
        setCharts(chartsRes.data);
        setActivity(activityRes.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <MotionPage><Skeleton rows={6} /></MotionPage>;

  const stats = [
    ["Total Balance", summary.totalBalance, FiDollarSign, "sky", true],
    ["Total Income", summary.totalIncome, FiTrendingUp, "green", true],
    ["Total Expenses", summary.totalExpenses, FiTrendingDown, "pink", true],
    ["Monthly Savings", summary.monthlySavings, FiZap, "violet", true],
    ["Savings Rate", summary.savingsRate, FiPieChart, "warm", false, "%"],
    ["Total Transactions", summary.totalTransactions, FiCreditCard, "sky", false],
    ["Current Month Spending", summary.currentMonthSpending, FiActivity, "pink", true],
    ["Monthly Budget Status", summary.budgetUsed, FiTarget, "green", false, "%"]
  ];

  const chartTooltip = {
    contentStyle: {
      borderRadius: 12,
      border: "1px solid rgba(148, 163, 184, 0.28)",
      boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
      fontWeight: 700
    }
  };

  return (
    <MotionPage className="space-y-6">
      <section className="premium-surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-softPink to-highlight" />
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-sky-50/70 to-transparent dark:from-sky-500/10" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="label">Dashboard</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Your money, organized into a calm operating system.
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              Monitor runway, savings, spending pressure, and budget health from one high-signal view.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/10">
              <p className="label">Budget score</p>
              <p className="mt-2 text-3xl font-black text-sky-600 dark:text-primary">{summary.budgetHealthScore}/100</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/10">
              <p className="label">Savings rate</p>
              <p className="mt-2 text-3xl font-black text-emerald-600">{summary.savingsRate}%</p>
            </div>
          </div>
        </div>
      </section>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      >
        {stats.map(([label, value, icon, tone, money, suffix]) => (
          <StatCard key={label} label={label} value={value} icon={icon} tone={tone} currencyValue={money} suffix={suffix || ""} />
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ChartBox title="Income vs expense" empty={!charts.incomeVsExpense.some((item) => item.income > 0 || item.expense > 0)}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.incomeVsExpense}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F9A8D4" stopOpacity={0.36} />
                  <stop offset="95%" stopColor="#F9A8D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => currency(value)} {...chartTooltip} />
              <Area type="monotone" dataKey="income" stroke="#22C55E" fill="url(#incomeFill)" strokeWidth={3} animationDuration={900} />
              <Area type="monotone" dataKey="expense" stroke="#F472B6" fill="url(#expenseFill)" strokeWidth={3} animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>
        <motion.div className="space-y-4" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
          {summary.insights.map((item) => (
            <motion.div key={item} variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}>
              <InsightCard text={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ActivityFeed items={activity} />
    </MotionPage>
  );
};

export default Dashboard;
