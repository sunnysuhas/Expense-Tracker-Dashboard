import clsx from "clsx";

const variants = {
  primary: "bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 text-white shadow-[0_16px_38px_rgba(15,23,42,0.24)] hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(56,189,248,0.24)] dark:from-primary dark:via-sky-300 dark:to-highlight dark:text-ink",
  secondary:
    "border border-slate-200/90 bg-white/90 text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-primary hover:bg-white hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900/90 dark:text-white",
  ghost: "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_14px_34px_rgba(244,63,94,0.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(244,63,94,0.28)]"
};

const Button = ({ children, className, variant = "primary", type = "button", ...props }) => (
  <button
    type={type}
    className={clsx(
      "focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition duration-200 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      className
    )}
    aria-busy={props.disabled ? true : undefined}
    {...props}
  >
    {children}
  </button>
);

export default Button;
