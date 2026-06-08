import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import Button from "./Button";

const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-premium dark:border-slate-700 dark:bg-cardDark"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="modal-title" className="text-lg font-extrabold text-slate-950 dark:text-white">{title}</h2>
            <Button variant="ghost" className="h-10 w-10 p-0" onClick={onClose} aria-label="Close modal">
              <FiX />
            </Button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
