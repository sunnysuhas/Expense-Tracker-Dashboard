import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

const EmptyState = ({ title = "Nothing here yet", description = "Create your first item to fill this space." }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid min-h-56 place-items-center rounded-xl border border-dashed border-slate-300/80 bg-white/75 p-6 text-center shadow-inner dark:border-slate-700 dark:bg-slate-900/60"
  >
    <div>
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-sky-100 to-violet-100 text-primary shadow-sm dark:from-sky-500/10 dark:to-violet-500/10">
        <FiInbox />
      </div>
      <h3 className="font-extrabold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </motion.div>
);

export default EmptyState;
