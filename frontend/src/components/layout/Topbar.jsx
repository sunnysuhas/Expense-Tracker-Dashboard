import { useEffect, useState } from "react";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { initials } from "../../utils/formatters";
import Button from "../ui/Button";

const Topbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.avatar]);

  const handleLogout = async () => {
    const logoutPromise = logout();
    navigate("/login", { replace: true, state: { loggedOut: true } });
    await logoutPromise;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-slate-50/75 px-4 py-3 backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-ink/75 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Workspace</p>
          <h1 className="truncate text-lg font-black sm:text-xl">Financial command center</h1>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            className="h-12 w-12 shrink-0 rounded-xl p-0 text-base shadow-[0_10px_28px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_34px_rgba(56,189,248,0.16)]"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </Button>
          <div className="hidden min-w-0 max-w-[16rem] items-center gap-3 rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 shadow-sm dark:border-white/10 dark:bg-slate-900/80 sm:flex">
            {user?.avatar && !avatarFailed ? (
              <img src={user.avatar} alt={user.name || "User avatar"} onError={() => setAvatarFailed(true)} className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm dark:border-white/10" />
            ) : (
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-softPink via-highlight to-primary text-base font-black text-white shadow-sm">
                {initials(user?.name)}
              </div>
            )}
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-black text-slate-950 dark:text-white">{user?.name || "User"}</p>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
          <Button variant="secondary" className="h-11 shrink-0 px-3 sm:h-12 sm:px-4" onClick={handleLogout} aria-label="Logout" title="Logout">
            <FiLogOut />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
