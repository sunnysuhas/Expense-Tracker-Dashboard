import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiKey, FiLock } from "react-icons/fi";
import { api, getErrorMessage } from "../api/http";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import MotionPage from "../components/ui/MotionPage";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ token: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", form);
      setSession(data);
      toast.success("Password reset successful");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPage className="soft-grid grid min-h-screen place-items-center bg-slate-50 px-4 py-10 text-slate-950 dark:bg-ink dark:text-white">
      <form onSubmit={submit} className="premium-surface w-full max-w-md p-6">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <FiArrowLeft /> Back to login
        </Link>
        <h1 className="text-3xl font-black">Create new password</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
          Paste your reset token and choose a new secure password.
        </p>
        <div className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="label">Reset token</span>
            <div className="relative">
              <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input input-with-icon" value={form.token} onChange={(event) => setForm({ ...form, token: event.target.value })} required />
            </div>
          </label>
          <label className="block space-y-2">
            <span className="label">New password</span>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input input-with-icon" type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            </div>
          </label>
        </div>
        <Button type="submit" className="mt-5 w-full" disabled={loading}>Reset password</Button>
      </form>
    </MotionPage>
  );
};

export default ResetPassword;
