import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { api, getErrorMessage } from "../api/http";
import ChartBox from "../components/charts/ChartBox";
import MotionPage from "../components/ui/MotionPage";
import Skeleton from "../components/ui/Skeleton";
import { currency } from "../utils/formatters";

const palette = ["#38BDF8", "#F9A8D4", "#22C55E", "#F5D0A9", "#A78BFA", "#60A5FA", "#FB7185"];

const Analytics = () => {
  const [charts, setCharts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [chartsRes, summaryRes] = await Promise.all([
          api.get("/analytics/charts"),
          api.get("/analytics/summary")
        ]);
        setCharts(chartsRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <MotionPage><Skeleton rows={6} /></MotionPage>;
  const tooltip = {
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
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-highlight via-primary to-success" />
        <div className="relative">
          <p className="label">Analytics</p>
          <h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Signals behind every spending decision.</h2>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
            Explore spending distribution, monthly momentum, category pressure, and savings trend from one polished analytics layer.
          </p>
        </div>
      </section>

      <motion.div className="grid gap-4 md:grid-cols-3" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="premium-card relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
          <p className="label">Top category</p>
          <p className="mt-2 text-2xl font-black">{summary.highestSpendingCategory}</p>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="premium-card relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-softPink" />
          <p className="label">Lowest category</p>
          <p className="mt-2 text-2xl font-black">{summary.lowestSpendingCategory}</p>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="premium-card relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-highlight" />
          <p className="label">Spending change</p>
          <p className={`mt-2 text-2xl font-black ${summary.spendingChange > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {summary.spendingChange > 0 ? "+" : ""}{summary.spendingChange}%
          </p>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartBox title="Expense distribution" empty={!charts.categoryDistribution.length}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={charts.categoryDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                {charts.categoryDistribution.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => currency(value)} {...tooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Monthly expenses" empty={!charts.monthlyExpenses.some((item) => item.amount > 0)}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => currency(value)} {...tooltip} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#38BDF8" animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Income vs expense" empty={!charts.incomeVsExpense.some((item) => item.income > 0 || item.expense > 0)}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.incomeVsExpense}>
              <defs>
                <linearGradient id="incomeAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F9A8D4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F9A8D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => currency(value)} {...tooltip} />
              <Area dataKey="income" stroke="#22C55E" fill="url(#incomeAnalytics)" strokeWidth={3} animationDuration={900} />
              <Area dataKey="expense" stroke="#F472B6" fill="url(#expenseAnalytics)" strokeWidth={3} animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Savings trend" empty={!charts.savingsTrend.some((item) => item.savings !== 0)}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => currency(value)} {...tooltip} />
              <Line type="monotone" dataKey="savings" stroke="#A78BFA" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} animationDuration={900} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Category spending trend" empty={!charts.categoryTrend.length}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.categoryTrend} layout="vertical" margin={{ left: 22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => currency(value)} {...tooltip} />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                {charts.categoryTrend.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
    </MotionPage>
  );
};

export default Analytics;
