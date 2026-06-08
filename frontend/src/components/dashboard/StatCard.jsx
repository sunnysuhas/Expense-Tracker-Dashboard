import CountUp from "react-countup";
import { motion } from "framer-motion";
import clsx from "clsx";
import { currency, number } from "../../utils/formatters";

const StatCard = ({ label, value, icon: Icon, tone = "sky", currencyValue = true, suffix = "", detail }) => {
  const tones = {
    sky: "from-primary/20 to-sky-50 text-sky-600 dark:from-primary/20 dark:to-sky-500/5 dark:text-primary",
    pink: "from-softPink/30 to-pink-50 text-pink-600 dark:from-softPink/20 dark:to-pink-500/5 dark:text-softPink",
    green: "from-success/20 to-emerald-50 text-emerald-600 dark:from-success/20 dark:to-emerald-500/5 dark:text-success",
    warm: "from-warm/50 to-orange-50 text-orange-600 dark:from-warm/20 dark:to-orange-500/5 dark:text-warm",
    violet: "from-highlight/20 to-violet-50 text-violet-600 dark:from-highlight/20 dark:to-violet-500/5 dark:text-highlight"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ duration: 0.26 }}
      className="premium-card group relative overflow-hidden p-5"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-softPink to-highlight opacity-80" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-sky-50/70 to-transparent opacity-0 transition group-hover:opacity-100 dark:from-sky-500/10" />
      <div className={clsx("relative mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm", tones[tone])}>
        <Icon className="text-xl" />
      </div>
      <p className="relative text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="relative mt-2 text-2xl font-black tracking-normal text-slate-950 dark:text-white">
        <CountUp
          end={Number(value) || 0}
          duration={1.1}
          formattingFn={(item) => (currencyValue ? currency(item) : `${number(item)}${suffix}`)}
        />
      </p>
      {detail && <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{detail}</p>}
    </motion.div>
  );
};

export default StatCard;
