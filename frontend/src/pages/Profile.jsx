import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCamera, FiSave } from "react-icons/fi";
import { api, getErrorMessage } from "../api/http";
import Button from "../components/ui/Button";
import MotionPage from "../components/ui/MotionPage";
import Skeleton from "../components/ui/Skeleton";
import { currency, dateLabel, initials } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/profile");
        setProfile(data);
        setForm({ name: data.user.name, avatar: data.user.avatar || "" });
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/profile", form);
      setProfile(data);
      updateUser(data.user);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MotionPage><Skeleton rows={5} /></MotionPage>;

  const { user, stats } = profile;
  const showAvatarImage = Boolean(form.avatar && !avatarFailed);

  return (
    <MotionPage className="space-y-6">
      <section className="premium-surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-softPink via-highlight to-primary" />
        <p className="label">Profile</p>
        <h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">A professional account view that feels cared for.</h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
          Personal identity, portfolio-level financial totals, and editable account details in one polished view.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.28 }}
          className="premium-card relative overflow-hidden p-6 text-center"
        >
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-softPink/25 via-highlight/20 to-primary/20" />
          <div className="relative mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-softPink via-highlight to-primary text-4xl font-black text-white shadow-premium dark:border-slate-900">
            {showAvatarImage ? (
              <img src={form.avatar} alt={form.name || "Profile avatar"} onError={() => setAvatarFailed(true)} className="h-full w-full object-cover" />
            ) : (
              initials(form.name || user.name)
            )}
          </div>
          <h3 className="relative mx-auto mt-5 max-w-full truncate text-2xl font-black">{user.name}</h3>
          <p className="mx-auto mt-1 max-w-full truncate text-sm font-semibold text-slate-500 dark:text-slate-400">{user.email}</p>
          <p className="mt-4 inline-flex rounded-lg bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-300">Joined {dateLabel(user.createdAt)}</p>
        </motion.section>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.06 }}
          onSubmit={save}
          className="premium-card p-6"
        >
          <div>
            <p className="label">Account details</p>
            <h3 className="mt-1 text-lg font-black">Update profile</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="label">Name</span>
              <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="space-y-2">
              <span className="label">Avatar URL</span>
              <div className="relative">
                <FiCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input input-with-icon" value={form.avatar} onChange={(event) => { setAvatarFailed(false); setForm({ ...form, avatar: event.target.value }); }} placeholder="https://..." />
              </div>
            </label>
          </div>
          <Button type="submit" className="mt-5" disabled={saving}><FiSave /> Save changes</Button>
        </motion.form>
      </div>

      <motion.div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
        {[
          ["Total transactions", stats.totalTransactions],
          ["Total income", currency(stats.totalIncome)],
          ["Total expenses", currency(stats.totalExpenses)],
          ["Savings summary", currency(stats.savingsSummary)]
        ].map(([label, value]) => (
          <motion.div key={label} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} className="premium-card relative overflow-hidden p-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-highlight" />
            <p className="label">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
          </motion.div>
        ))}
      </motion.div>
    </MotionPage>
  );
};

export default Profile;
