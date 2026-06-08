import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiCreditCard,
  FiPieChart,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiZap
} from "react-icons/fi";
import Button from "../components/ui/Button";
import MotionPage from "../components/ui/MotionPage";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const bars = [72, 118, 86, 144, 104, 168, 132, 194, 156, 210, 172, 230];
const features = [
  { title: "Secure access", description: "JWT, protected routes, password recovery, and OAuth readiness.", icon: FiShield },
  { title: "Live analytics", description: "Category, savings, income, expense, and budget intelligence.", icon: FiPieChart },
  { title: "Fast workflows", description: "Filtered CRUD, pagination, exports, and polished feedback states.", icon: FiZap },
  { title: "Portfolio signal", description: "A complete SaaS-quality product architecture reviewers can trust.", icon: FiCheckCircle }
];

const PreviewScene = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="soft-grid absolute inset-0 opacity-70" />
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.22),transparent_34%,rgba(249,168,212,0.18)_67%,rgba(167,139,250,0.18))]" />
    <motion.div
      className="absolute left-1/2 top-[19%] hidden w-[920px] -translate-x-1/2 rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-[0_44px_110px_rgba(15,23,42,0.20)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 lg:block"
      initial={{ opacity: 0, y: 50, rotateX: 9 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.85, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="h-8 w-72 rounded-lg bg-slate-100/80 dark:bg-white/10" />
        <div className="h-8 w-24 rounded-lg bg-slate-950 dark:bg-primary" />
      </div>
      <div className="grid gap-4 pt-4 lg:grid-cols-[0.8fr_1.2fr_0.7fr]">
        <div className="space-y-3">
          {["Balance", "Income", "Expenses"].map((label, index) => (
            <div key={label} className="rounded-xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/10">
              <p className="text-xs font-black uppercase text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                {index === 0 ? "INR 1.84L" : index === 1 ? "INR 1.07L" : "INR 58K"}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-slate-400">Income vs expense</p>
              <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">Cash flow runway</p>
            </div>
            <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/20 dark:text-success">+18%</span>
          </div>
          <div className="flex h-56 items-end gap-2">
            {bars.map((height, index) => (
              <motion.span
                key={index}
                className="flex-1 rounded-t-md bg-gradient-to-t from-sky-400 to-sky-200 shadow-[0_8px_20px_rgba(56,189,248,0.16)]"
                initial={{ height: 20 }}
                animate={{ height }}
                transition={{ duration: 0.9, delay: index * 0.04 }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[
            ["Budget", "68% used", FiTarget],
            ["Savings", "INR 48K", FiTrendingUp],
            ["Exports", "PDF ready", FiCreditCard]
          ].map(([label, value, Icon]) => (
            <motion.div
              key={label}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase text-slate-400">{label}</p>
                <Icon className="text-sky-500" />
              </div>
              <p className="mt-3 text-xl font-black text-slate-950 dark:text-white">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

const Landing = () => (
  <MotionPage className="min-h-screen bg-white text-slate-950 dark:bg-ink dark:text-white">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/75">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-slate-950 to-sky-900 text-white shadow-glow dark:from-primary dark:to-highlight dark:text-ink">
            <FiBarChart2 />
          </span>
          <span className="text-lg font-black">Finora</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Login
          </Link>
          <Link to="/register">
            <Button>Start free <FiArrowRight /></Button>
          </Link>
        </div>
      </nav>
    </header>

    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-24">
      <PreviewScene />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.86)_72%,#fff)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.86)_72%,#0F172A)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl">
          <motion.p variants={reveal} className="mb-5 inline-flex rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-black uppercase tracking-wide text-sky-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-primary">
            Startup-grade finance workspace
          </motion.p>
          <motion.h1 variants={reveal} className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            Take Control of Your <span className="premium-gradient-text">Financial Future</span>
          </motion.h1>
          <motion.p variants={reveal} className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600 dark:text-slate-300">
            A polished finance OS for tracking money, planning budgets, reading trends, and exporting reports from one calm, recruiter-ready product surface.
          </motion.p>
          <motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register"><Button className="w-full sm:w-auto">Create account <FiArrowRight /></Button></Link>
            <Link to="/login"><Button variant="secondary" className="w-full sm:w-auto">View dashboard</Button></Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    <section className="border-y border-slate-200/70 bg-slate-50/80 py-20 dark:border-white/10 dark:bg-slate-900/35">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <motion.div key={title} variants={reveal} whileHover={{ y: -6 }} className="premium-card p-6">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-sky-100 to-violet-100 text-sky-700 shadow-sm dark:from-sky-500/10 dark:to-violet-500/10 dark:text-primary">
                <Icon />
              </div>
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <p className="label">Recruiter impression</p>
        <h2 className="mt-3 text-4xl font-black leading-tight">The details that make it feel built by a product team.</h2>
        <p className="mt-5 text-base font-semibold leading-7 text-slate-600 dark:text-slate-300">
          Not just charts on a page: Finora includes recoverable auth, protected workflows, responsive navigation, export-ready reports, intelligent states, and a coherent visual system.
        </p>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-4 sm:grid-cols-2">
        {["Polished app shell", "Real dashboard density", "Motion with restraint", "Clean production states"].map((item) => (
          <motion.div key={item} variants={reveal} className="premium-card p-6">
            <p className="text-sm font-black text-slate-950 dark:text-white">{item}</p>
            <div className="mt-5 h-2 rounded-full bg-gradient-to-r from-primary via-softPink to-highlight" />
          </motion.div>
        ))}
      </motion.div>
    </section>

    <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="label text-sky-300">Portfolio-ready</p>
        <h2 className="mt-3 text-4xl font-black leading-tight">A finance dashboard that can carry a resume conversation.</h2>
        <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-300">
          Built to show full-stack depth, product taste, and the kind of interface judgment expected from a modern SaaS team.
        </p>
        <Link to="/register" className="mt-8"><Button>Launch Finora <FiArrowRight /></Button></Link>
      </div>
    </section>

    <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800">
      Finora Expense Tracker Dashboard
    </footer>
  </MotionPage>
);

export default Landing;
