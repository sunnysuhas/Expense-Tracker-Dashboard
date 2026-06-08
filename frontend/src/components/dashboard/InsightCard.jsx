import { FiZap } from "react-icons/fi";

const InsightCard = ({ text }) => (
  <div className="premium-card group p-4">
    <div className="flex gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-100 to-sky-100 text-highlight transition group-hover:scale-105 dark:from-violet-500/10 dark:to-sky-500/10">
        <FiZap />
      </div>
      <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{text}</p>
    </div>
  </div>
);

export default InsightCard;
