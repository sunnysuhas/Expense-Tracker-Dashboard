import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiBarChart2, FiLock, FiMail, FiUser } from "react-icons/fi";
import Button from "../components/ui/Button";
import MotionPage from "../components/ui/MotionPage";
import Skeleton from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ mode, googleConfigured = false }) => {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const location = useLocation();
  const { checkingSession, isAuthenticated, login, register, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const target = location.state?.from?.pathname || "/dashboard";
  const justLoggedOut = Boolean(location.state?.loggedOut);

  if (checkingSession) return <div className="min-h-screen bg-slate-50 p-6 dark:bg-ink"><Skeleton rows={4} /></div>;
  if (isAuthenticated && !justLoggedOut) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await (isRegister ? register(form) : login({ email: form.email, password: form.password }));
      navigate(target, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPage className="soft-grid grid min-h-screen bg-slate-50 text-slate-950 dark:bg-ink dark:text-white lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.20),transparent_42%,rgba(167,139,250,0.18))]" />
        <div className="relative">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-ink"><FiBarChart2 /></span>
          <span className="text-xl font-black">Finora</span>
        </Link>
        <div className="mt-24 max-w-xl">
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black leading-tight">
            Premium finance workspace for modern money decisions.
          </motion.h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Authenticate, analyze, budget, and export from one polished product experience.
          </p>
        </div>
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-3">
            {["JWT Auth", "MongoDB", "Analytics"].map((item) => (
              <div key={item} className="rounded-lg bg-white/10 p-4 text-sm font-black">{item}</div>
            ))}
          </div>
        </div>
        </div>
      </section>
      <section className="grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white dark:bg-primary dark:text-ink"><FiBarChart2 /></span>
            <span className="text-lg font-black">Finora</span>
          </Link>
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-surface p-6"
          >
            <h1 className="text-3xl font-black">{isRegister ? "Create account" : "Welcome back"}</h1>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              {isRegister ? "Start tracking your financial future." : "Log in to your dashboard."}
            </p>
            <div className="mt-6 space-y-4">
              {isRegister && (
                <label className="block space-y-2">
                  <span className="label">Name</span>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input input-with-icon" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                  </div>
                </label>
              )}
              <label className="block space-y-2">
                <span className="label">Email</span>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className="input input-with-icon" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
                </div>
              </label>
              <label className="block space-y-2">
                <span className="label">Password</span>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className="input input-with-icon" type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
                </div>
              </label>
            </div>
            <Button type="submit" className="mt-6 w-full" disabled={loading}>{isRegister ? "Create account" : "Login"}</Button>
            {!isRegister && (
              <div className="mt-3 text-right">
                <Link to="/forgot-password" className="text-sm font-bold text-sky-600 hover:text-sky-700">
                  Forgot password?
                </Link>
              </div>
            )}
            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase text-slate-400">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> or <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            {googleConfigured ? (
              <div className="grid place-items-center overflow-hidden rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                <GoogleLogin
                  onSuccess={(response) => googleLogin(response.credential).then(() => navigate(target, { replace: true }))}
                  onError={() => toast.error("Google login was cancelled or failed")}
                />
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                Google login is ready for production. Add VITE_GOOGLE_CLIENT_ID to enable it locally.
              </div>
            )}
            <p className="mt-6 text-center text-sm font-semibold text-slate-500">
              {isRegister ? "Already have an account?" : "New to Finora?"}{" "}
              <Link className="text-sky-600" to={isRegister ? "/login" : "/register"}>
                {isRegister ? "Login" : "Create account"}
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </MotionPage>
  );
};

export default AuthPage;
