import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { FiBarChart2, FiCreditCard, FiGrid, FiPieChart, FiSettings, FiTarget, FiUser } from "react-icons/fi";
import clsx from "clsx";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/transactions", label: "Transactions", icon: FiCreditCard },
  { to: "/analytics", label: "Analytics", icon: FiPieChart },
  { to: "/budget", label: "Budget", icon: FiTarget },
  { to: "/profile", label: "Profile", icon: FiUser },
  { to: "/settings", label: "Settings", icon: FiSettings }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <motion.aside
    className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/90 px-2 py-2 shadow-[0_-18px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-ink/90 lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-r lg:border-t-0 lg:px-5 lg:py-6 lg:shadow-none"
    initial={{ x: -24, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
  >
    <div className="hidden items-center gap-3 lg:flex">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white shadow-glow dark:bg-primary dark:text-ink">
        <FiBarChart2 />
      </div>
      <div>
        <p className="text-lg font-black">Finora</p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Finance OS</p>
      </div>
    </div>
    <nav className="grid grid-cols-6 gap-1 lg:mt-10 lg:block lg:space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isCurrent = location.pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "group relative flex min-h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-lg px-1 text-[10px] font-black transition duration-200 lg:min-h-0 lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-sm",
                isActive
                  ? "text-sky-700 shadow-sm dark:text-primary"
                  : "text-slate-500 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              )
            }
          >
            {isCurrent && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-100 to-violet-100 dark:from-sky-500/10 dark:to-violet-500/10"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative z-10 text-lg transition group-hover:scale-110" />
            <span className="relative z-10 max-w-full truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  </motion.aside>
  );
};

export default Sidebar;
