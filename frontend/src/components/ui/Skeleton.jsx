const Skeleton = ({ rows = 3 }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="premium-card shimmer h-28 p-5"
      >
        <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-5 h-7 w-36 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-5 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
    ))}
  </div>
);

export default Skeleton;
