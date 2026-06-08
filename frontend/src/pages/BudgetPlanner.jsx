import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle, FiTarget, FiTrendingUp } from "react-icons/fi";
import { api, getErrorMessage } from "../api/http";
import Button from "../components/ui/Button";
import MotionPage from "../components/ui/MotionPage";
import Skeleton from "../components/ui/Skeleton";
import { currency, monthName } from "../utils/formatters";

const now = new Date();
const savingsKey = "finora_savings_goal";

const BudgetPlanner = () => {
  const [budget, setBudget] = useState(null);
  const [form, setForm] = useState({
    monthlyBudget: "",
    month: now.getMonth() + 1,
    year: now.getFullYear()
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [goal, setGoal] = useState(() => {
    const stored = localStorage.getItem(savingsKey);
    return stored ? JSON.parse(stored) : { name: "Emergency fund", targetAmount: 150000, currentAmount: 62500 };
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/budgets", { params: { month: form.month, year: form.year } });
      setBudget(data);
      setForm((current) => ({ ...current, monthlyBudget: data.monthlyBudget || "" }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [form.month, form.year]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put("/budgets", {
        monthlyBudget: Number(form.monthlyBudget),
        month: Number(form.month),
        year: Number(form.year)
      });
      toast.success("Budget updated");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const saveGoal = (event) => {
    event.preventDefault();
    const normalized = {
      name: goal.name || "Savings goal",
      targetAmount: Number(goal.targetAmount) || 0,
      currentAmount: Number(goal.currentAmount) || 0
    };
    setGoal(normalized);
    localStorage.setItem(savingsKey, JSON.stringify(normalized));
    toast.success("Savings goal updated");
  };

  if (loading) return <MotionPage><Skeleton rows={4} /></MotionPage>;

  const statusStyles = {
    Safe: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-success",
    Warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-warm",
    Critical: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
  };
  const statusIcon = budget.status === "Safe" ? FiCheckCircle : FiAlertTriangle;
  const StatusIcon = statusIcon;
  const goalProgress = goal.targetAmount ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) : 0;

  return (
    <MotionPage className="space-y-6">
      <section className="premium-surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success via-primary to-highlight" />
        <p className="label">Budget planner</p>
        <h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Plan the month before the month spends you.</h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
          Set budget limits, monitor spend pressure, and keep savings goals visible while the month unfolds.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={save} className="premium-card p-5">
          <h3 className="text-lg font-black">Set monthly budget</h3>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2">
              <span className="label">Budget amount</span>
              <input className="input" type="number" min="0" value={form.monthlyBudget} onChange={(event) => setForm({ ...form, monthlyBudget: event.target.value })} placeholder="20000" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="label">Month</span>
                <select className="input" value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })}>
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{monthName(index + 1)}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="label">Year</span>
                <input className="input" type="number" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} />
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>Save budget</Button>
          </div>
        </form>

        <section className="premium-card p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="label">{monthName(budget.month)} {budget.year}</p>
              <h3 className="mt-2 text-2xl font-black">Budget status</h3>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-black ${statusStyles[budget.status]}`}>
              <StatusIcon /> {budget.status}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-slate-50/90 p-4 dark:bg-slate-900/80">
              <p className="label">Budget</p>
              <p className="mt-2 text-2xl font-black">{currency(budget.monthlyBudget)}</p>
            </div>
            <div className="rounded-lg bg-slate-50/90 p-4 dark:bg-slate-900/80">
              <p className="label">Spent</p>
              <p className="mt-2 text-2xl font-black text-rose-600">{currency(budget.spent)}</p>
            </div>
            <div className="rounded-lg bg-slate-50/90 p-4 dark:bg-slate-900/80">
              <p className="label">Remaining</p>
              <p className="mt-2 text-2xl font-black text-emerald-600">{currency(budget.remaining)}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex justify-between text-sm font-black">
              <span>Percentage used</span>
              <span>{budget.used}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
              <div
                className={`h-full rounded-full transition-all duration-700 ${budget.used >= 90 ? "bg-rose-500" : budget.used >= 70 ? "bg-amber-400" : "bg-success"}`}
                style={{ width: `${Math.min(budget.used, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-lg bg-sky-50 p-4 text-sky-900 dark:bg-sky-500/10 dark:text-sky-100">
            <FiTrendingUp className="mt-1 shrink-0" />
            <p className="text-sm font-semibold leading-6">
              Keeping monthly usage below 70% preserves room for unexpected costs and improves your budget health score.
            </p>
          </div>
        </section>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="premium-card p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="label">Savings goal</p>
              <h3 className="mt-2 text-2xl font-black">{goal.name}</h3>
            </div>
            <span className="rounded-lg bg-violet-100 px-3 py-2 text-sm font-black text-violet-700 dark:bg-violet-500/10 dark:text-highlight">
              {goalProgress}% funded
            </span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50/90 p-4 dark:bg-slate-900/80">
              <p className="label">Target</p>
              <p className="mt-2 text-xl font-black">{currency(goal.targetAmount)}</p>
            </div>
            <div className="rounded-lg bg-slate-50/90 p-4 dark:bg-slate-900/80">
              <p className="label">Saved</p>
              <p className="mt-2 text-xl font-black text-emerald-600">{currency(goal.currentAmount)}</p>
            </div>
            <div className="rounded-lg bg-slate-50/90 p-4 dark:bg-slate-900/80">
              <p className="label">Remaining</p>
              <p className="mt-2 text-xl font-black">{currency(Math.max(goal.targetAmount - goal.currentAmount, 0))}</p>
            </div>
          </div>
          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
            <div className="h-full rounded-full bg-highlight transition-all duration-700" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>

        <form onSubmit={saveGoal} className="premium-card p-6">
          <h3 className="text-lg font-black">Update savings goal</h3>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2">
              <span className="label">Goal name</span>
              <input className="input" value={goal.name} onChange={(event) => setGoal({ ...goal, name: event.target.value })} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="label">Target amount</span>
                <input className="input" type="number" min="0" value={goal.targetAmount} onChange={(event) => setGoal({ ...goal, targetAmount: event.target.value })} />
              </label>
              <label className="block space-y-2">
                <span className="label">Current savings</span>
                <input className="input" type="number" min="0" value={goal.currentAmount} onChange={(event) => setGoal({ ...goal, currentAmount: event.target.value })} />
              </label>
            </div>
            <Button type="submit" className="w-full"><FiTarget /> Save goal</Button>
          </div>
        </form>
      </section>
    </MotionPage>
  );
};

export default BudgetPlanner;
