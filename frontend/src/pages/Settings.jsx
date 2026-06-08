import { useState } from "react";
import toast from "react-hot-toast";
import { FiBell, FiLock, FiMoon, FiSave, FiShield } from "react-icons/fi";
import { api, getErrorMessage } from "../api/http";
import Button from "../components/ui/Button";
import MotionPage from "../components/ui/MotionPage";
import { useTheme } from "../context/ThemeContext";

const settingsKey = "finora_settings";

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem(settingsKey);
    return stored ? JSON.parse(stored) : { monthlyDigest: true, budgetAlerts: true, exportNaming: "date" };
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);

  const saveSettings = (event) => {
    event.preventDefault();
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    toast.success("Settings saved");
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put("/profile/password", passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MotionPage className="space-y-6">
      <section className="premium-surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-highlight via-primary to-softPink" />
        <p className="label">Settings</p>
        <h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Controls that make the product feel complete.</h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
          Preferences, appearance, and account security live in a tidy command surface.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={saveSettings} className="premium-card p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-primary">
              <FiBell />
            </div>
            <div>
              <h3 className="text-lg font-black">Preferences</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Local notification and reporting preferences.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-lg bg-slate-50/90 p-4 font-bold transition hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800">
              Monthly financial digest
              <input type="checkbox" checked={settings.monthlyDigest} onChange={(event) => setSettings({ ...settings, monthlyDigest: event.target.checked })} className="h-5 w-5 accent-sky-500" />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-lg bg-slate-50/90 p-4 font-bold transition hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800">
              Budget threshold alerts
              <input type="checkbox" checked={settings.budgetAlerts} onChange={(event) => setSettings({ ...settings, budgetAlerts: event.target.checked })} className="h-5 w-5 accent-sky-500" />
            </label>
            <label className="block space-y-2">
              <span className="label">Export naming</span>
              <select className="input" value={settings.exportNaming} onChange={(event) => setSettings({ ...settings, exportNaming: event.target.value })}>
                <option value="date">Include export date</option>
                <option value="month">Include current month</option>
                <option value="plain">Plain filename</option>
              </select>
            </label>
            <Button type="submit"><FiSave /> Save preferences</Button>
          </div>
        </form>

        <section className="premium-card p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-highlight">
              <FiMoon />
            </div>
            <div>
              <h3 className="text-lg font-black">Appearance</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Theme preference is saved on this device.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-3 rounded-lg bg-slate-50/90 p-4 dark:bg-slate-900/80 sm:flex-row sm:items-center">
            <span className="font-bold">{isDark ? "Dark mode enabled" : "Light mode enabled"}</span>
            <Button variant="secondary" onClick={toggleTheme}>Toggle theme</Button>
          </div>
        </section>
      </div>

      <form onSubmit={changePassword} className="premium-card p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-success">
            <FiShield />
          </div>
          <div>
            <h3 className="text-lg font-black">Security</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Change your password without leaving the dashboard.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="label">Current password</span>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-11" type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required />
            </div>
          </label>
          <label className="space-y-2">
            <span className="label">New password</span>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-11" type="password" minLength={8} value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required />
            </div>
          </label>
        </div>
        <Button type="submit" className="mt-5" disabled={saving}><FiSave /> Update password</Button>
      </form>
    </MotionPage>
  );
};

export default Settings;
