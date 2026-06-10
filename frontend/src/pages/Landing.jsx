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

const HeroBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="soft-grid absolute inset-0 opacity-70" />
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.22),transparent_34%,rgba(249,168,212,0.18)_67%,rgba(167,139,250,0.18))]" />
  </div>
);

const DashboardPreview = () => (
  <motion.div
    className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-[26px] border border-white/80 bg-white/78 p-3 shadow-[0_42px_110px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/72 sm:p-4"
    initial={{ opacity: 0, y: 42, scale: 0.96, rotateX: 8 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
    transition={{ duration: 0.85, ease: "easeOut", delay: 0.16 }}
    style={{ transformPerspective: 1200 }}
  >
    <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 dark:border-white/10 sm:pb-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400 sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300 sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 sm:h-3 sm:w-3" />
      </div>
      <div className="h-7 w-1/3 rounded-lg bg-slate-100/80 dark:bg-white/10 sm:h-8" />
      <div className="h-7 w-16 rounded-lg bg-slate-950 dark:bg-primary sm:h-8 sm:w-24" />
    </div>
    <div className="grid gap-4 pt-3 sm:pt-4 lg:grid-cols-[0.85fr_1.25fr_0.75fr]">
      <div className="grid gap-4 sm:grid-cols-3 lg:block lg:space-y-4">
        {["Balance", "Income", "Expenses"].map((label, index) => (
          <div key={label} className="rounded-xl border border-slate-200/70 bg-white/82 p-3 shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-4">
            <p className="text-[10px] font-black uppercase text-slate-400 sm:text-xs">{label}</p>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white sm:text-xl xl:text-2xl">
              {index === 0 ? "INR 1.84L" : index === 1 ? "INR 1.07L" : "INR 58K"}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200/70 bg-white/82 p-4 shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 sm:text-xs">Income vs expense</p>
            <p className="mt-1 text-base font-black text-slate-950 dark:text-white sm:text-lg">Cash flow runway</p>
          </div>
          <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/20 dark:text-success">+18%</span>
        </div>
        <div className="flex h-44 items-end gap-1.5 sm:h-56 sm:gap-2">
          {bars.map((height, index) => (
            <motion.span
              key={index}
              className="flex-1 rounded-t-md bg-gradient-to-t from-sky-400 to-sky-200 shadow-[0_8px_20px_rgba(56,189,248,0.16)]"
              initial={{ height: 18 }}
              animate={{ height: `${Math.max(18, Math.round(height * 0.78))}px` }}
              transition={{ duration: 0.9, delay: index * 0.04 }}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:block lg:space-y-4">
        {[
          ["Budget", "68% used", FiTarget],
          ["Savings", "INR 48K", FiTrendingUp],
          ["Exports", "PDF ready", FiCreditCard]
        ].map(([label, value, Icon], index) => (
          <motion.div
            key={label}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.45 }}
            className="rounded-xl border border-slate-200/70 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase text-slate-400 sm:text-xs">{label}</p>
              <Icon className="text-sky-500" />
            </div>
            <p className="mt-3 text-base font-black text-slate-950 dark:text-white sm:text-xl">{value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
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
          <Button as={Link} to="/register">Start free <FiArrowRight /></Button>
        </div>
      </nav>
    </header>

    <section className="relative overflow-hidden pt-24">
      <HeroBackdrop />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.92)_82%,#fff)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.92)_82%,#0F172A)]" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8 lg:px-8 xl:gap-14">
        <motion.div variants={stagger} initial="hidden" animate="show" className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
          <motion.p variants={reveal} className="mb-5 inline-flex rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-black uppercase tracking-wide text-sky-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-primary">
            Startup-grade finance workspace
          </motion.p>
          <motion.h1 variants={reveal} className="text-4xl font-black leading-[1.04] tracking-normal sm:text-5xl md:text-6xl xl:text-7xl">
            Take Control of Your <span className="premium-gradient-text">Financial Future</span>
          </motion.h1>
          <motion.p variants={reveal} className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">
            A polished finance OS for tracking money, planning budgets, reading trends, and exporting reports from one calm, recruiter-ready product surface.
          </motion.p>
          <motion.div variants={reveal} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button as={Link} to="/register" className="w-full sm:w-auto">Create account <FiArrowRight /></Button>
            <Button as={Link} to="/login" variant="secondary" className="w-full sm:w-auto">View dashboard</Button>
          </motion.div>
        </motion.div>
        <div className="relative z-10 lg:pl-4">
          <DashboardPreview />
        </div>
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
        <Button as={Link} to="/register" className="mt-8">Launch Finora <FiArrowRight /></Button>
      </div>
    </section>

    <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800">
      Finora Expense Tracker Dashboard
    </footer>
  </MotionPage>
);

export default Landing;
