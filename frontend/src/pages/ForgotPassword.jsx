import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { api, getErrorMessage } from "../api/http";
import Button from "../components/ui/Button";
import MotionPage from "../components/ui/MotionPage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setResetToken(data.resetToken || "");
      toast.success("Reset instructions prepared");
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
        <h1 className="text-3xl font-black">Reset your password</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
          Enter your account email and Finora will prepare a secure reset token.
        </p>
        <label className="mt-6 block space-y-2">
          <span className="label">Email</span>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-11" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
        </label>
        <Button type="submit" className="mt-5 w-full" disabled={loading}>Prepare reset</Button>
        {resetToken && (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-warm">
            Local demo reset token:
            <code className="mt-2 block break-all rounded bg-white/70 p-2 text-xs dark:bg-slate-900">{resetToken}</code>
            <Link to="/reset-password" className="mt-3 inline-flex font-black text-sky-700 dark:text-primary">Continue to reset</Link>
          </div>
        )}
      </form>
    </MotionPage>
  );
};

export default ForgotPassword;
