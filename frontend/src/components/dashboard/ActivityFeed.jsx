import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { currency, dateLabel } from "../../utils/formatters";
import EmptyState from "../ui/EmptyState";

const ActivityFeed = ({ items = [] }) => {
  if (!items.length) return <EmptyState title="No activity yet" description="Transactions will appear here as a timeline." />;

  return (
    <div className="premium-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="label">Timeline</p>
          <h2 className="mt-1 text-lg font-black">Recent activity</h2>
        </div>
        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">Live</span>
      </div>
      <div className="space-y-4">
        {items.map((item) => {
          const positive = item.amount >= 0;
          const Icon = positive ? FiArrowUpRight : FiArrowDownLeft;
          return (
            <div key={item.id} className="flex gap-3 rounded-lg p-2 transition hover:bg-slate-50 dark:hover:bg-slate-900/70">
              <div className={`mt-1 grid h-9 w-9 place-items-center rounded-lg ${positive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-100 text-rose-600 dark:bg-rose-500/10"}`}>
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-bold">{item.label}</p>
                  <p className={`text-sm font-black ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                    {positive ? "+" : "-"}
                    {currency(Math.abs(item.amount))}
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.category} · {dateLabel(item.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
