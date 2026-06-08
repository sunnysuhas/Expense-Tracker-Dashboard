import { useEffect, useState } from "react";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { api } from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { initials } from "../../utils/formatters";
import Button from "../ui/Button";

const Topbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get("/health")
      .then(({ data }) => setHealth(data))
      .catch(() => setHealth({ status: "offline", database: { mode: "offline", state: "offline" } }));
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-slate-50/75 px-4 py-3 backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-ink/75 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Workspace</p>
          <h1 className="text-lg font-black sm:text-xl">Financial command center</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={`hidden rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wide lg:block ${
            health?.status === "offline"
              ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
              : health?.database?.mode === "demo"
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-warm"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-success"
          }`}>
            {health?.status === "offline" ? "API offline" : health?.database?.mode === "demo" ? "Demo data" : "MongoDB live"}
          </div>
          <Button variant="secondary" className="h-10 w-10 p-0" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <FiSun /> : <FiMoon />}
          </Button>
          <div className="hidden items-center gap-3 rounded-lg border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-900/80 sm:flex">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-softPink text-sm font-black text-ink">
                {initials(user?.name)}
              </div>
            )}
            <div className="max-w-36 truncate text-sm font-bold">{user?.name}</div>
          </div>
          <Button variant="ghost" className="h-10 w-10 p-0" onClick={logout} aria-label="Logout">
            <FiLogOut />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
