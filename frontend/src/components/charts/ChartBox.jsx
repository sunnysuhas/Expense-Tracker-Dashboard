import { motion } from "framer-motion";

import EmptyState from "../ui/EmptyState";

const ChartBox = ({ title, children, empty = false, eyebrow = "Live analytics" }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.28 }}
    className="premium-card min-h-80 p-5"
  >
    <div className="mb-5 flex items-center justify-between gap-3">
      <div>
        <p className="label">{eyebrow}</p>
        <h2 className="mt-1 text-base font-black text-slate-950 dark:text-white">{title}</h2>
      </div>
      <span className="h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_0_5px_rgba(34,197,94,0.12)]" />
    </div>
    <div className="h-64">
      {empty ? <EmptyState title="No chart data yet" description="Add transactions to populate this visualization." /> : children}
    </div>
  </motion.section>
);

export default ChartBox;
