import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiDownload, FiEdit3, FiEye, FiFileText, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { api, getErrorMessage } from "../api/http";
import TransactionForm from "../components/transactions/TransactionForm";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import MotionPage from "../components/ui/MotionPage";
import Skeleton from "../components/ui/Skeleton";
import { categories, currency, dateLabel } from "../utils/formatters";
import { exportTransactionsCsv, exportTransactionsPdf } from "../utils/exporters";

const initialFilters = { search: "", type: "", category: "", sort: "latest", from: "", to: "" };
const settingsKey = "finora_settings";

const exportFilename = (type) => {
  const stored = localStorage.getItem(settingsKey);
  const preference = stored ? JSON.parse(stored).exportNaming : "date";
  const today = new Date();
  const stamp = preference === "month"
    ? today.toLocaleString("en-US", { month: "short", year: "numeric" }).replace(" ", "-")
    : today.toISOString().slice(0, 10);
  const suffix = preference === "plain" ? "" : `-${stamp}`;
  return `finora-transactions${suffix}.${type}`;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [modal, setModal] = useState({ type: null, transaction: null });

  const query = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/transactions", { params: { ...query, page: pagination.page, limit: pagination.limit } });
      setTransactions(data.transactions || data);
      setPagination((current) => data.pagination || { ...current, total: data.length, totalPages: 1 });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 220);
    return () => clearTimeout(timer);
  }, [query.search, query.type, query.category, query.sort, query.from, query.to, pagination.page, pagination.limit]);

  const updateFilters = (next) => {
    setFilters(next);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const save = async (form) => {
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (modal.transaction) {
        await api.put(`/transactions/${modal.transaction._id}`, payload);
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", payload);
        toast.success("Transaction added");
      }
      setModal({ type: null, transaction: null });
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (transaction) => {
    try {
      await api.delete(`/transactions/${transaction._id}`);
      toast.success("Transaction deleted");
      setModal({ type: null, transaction: null });
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const runExport = async (type) => {
    setExporting(type);
    try {
      const { data } = await api.get("/transactions", { params: { ...query, all: true, limit: 100 } });
      const exportRows = data.transactions || data;
      if (!exportRows.length) {
        toast.error("There is no transaction data to export");
        return;
      }
      if (type === "csv") {
        exportTransactionsCsv(exportRows, exportFilename("csv"));
      } else {
        await exportTransactionsPdf(exportRows, exportFilename("pdf"));
      }
      toast.success(`${type.toUpperCase()} export ready`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setExporting(null);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((current) => ({ ...current, page }));
  };

  const updateLimit = (limit) => {
    setPagination((current) => ({ ...current, limit: Number(limit), page: 1 }));
  };

  const hasRows = transactions.length > 0;

  return (
    <MotionPage className="space-y-6">
      <section className="premium-surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-success to-softPink" />
        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="label">Transactions</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Every cash movement, searchable and export-ready.</h2>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              Manage income and expenses with fast filters, detail views, safe deletion, pagination, and polished reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => runExport("csv")} disabled={exporting === "csv"}><FiDownload /> CSV</Button>
            <Button variant="secondary" onClick={() => runExport("pdf")} disabled={exporting === "pdf"}><FiFileText /> PDF</Button>
            <Button onClick={() => setModal({ type: "form", transaction: null })}><FiPlus /> Add transaction</Button>
          </div>
        </div>
      </section>

      <section className="premium-card p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="relative xl:col-span-2">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input input-with-icon" placeholder="Search title or category" value={filters.search} onChange={(event) => updateFilters({ ...filters, search: event.target.value })} />
          </label>
          <select className="input" value={filters.type} onChange={(event) => updateFilters({ ...filters, type: event.target.value })}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="input" value={filters.category} onChange={(event) => updateFilters({ ...filters, category: event.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select className="input" value={filters.sort} onChange={(event) => updateFilters({ ...filters, sort: event.target.value })}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
          <Button variant="ghost" onClick={() => updateFilters(initialFilters)}>Reset</Button>
          <input className="input" type="date" value={filters.from} onChange={(event) => updateFilters({ ...filters, from: event.target.value })} />
          <input className="input" type="date" value={filters.to} onChange={(event) => updateFilters({ ...filters, to: event.target.value })} />
        </div>
      </section>

      {loading ? <Skeleton rows={5} /> : hasRows ? (
        <>
          <div className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Amount</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((item) => (
                    <tr key={item._id} className="transition hover:bg-slate-50 dark:hover:bg-slate-900/60">
                      <td className="px-5 py-4">
                        <p className="font-black">{item.title}</p>
                        <p className="max-w-xs truncate text-xs font-medium text-slate-500">{item.notes || "No notes"}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold">{item.category}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-lg px-3 py-1 text-xs font-black ${item.type === "income" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10" : "bg-rose-100 text-rose-700 dark:bg-rose-500/10"}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-500">{dateLabel(item.date)}</td>
                      <td className={`px-5 py-4 text-right font-black ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {item.type === "income" ? "+" : "-"}{currency(item.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" className="h-9 w-9 p-0" onClick={() => setModal({ type: "details", transaction: item })} aria-label="View details"><FiEye /></Button>
                          <Button variant="ghost" className="h-9 w-9 p-0" onClick={() => setModal({ type: "form", transaction: item })} aria-label="Edit"><FiEdit3 /></Button>
                          <Button variant="ghost" className="h-9 w-9 p-0 text-rose-500" onClick={() => setModal({ type: "delete", transaction: item })} aria-label="Delete"><FiTrash2 /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="premium-card flex flex-col items-center justify-between gap-3 p-4 text-sm font-bold sm:flex-row">
            <span className="text-slate-500 dark:text-slate-400">
              Showing page {pagination.page} of {pagination.totalPages} - {pagination.total} transactions
            </span>
            <div className="flex items-center gap-2">
              <select className="input w-24 py-2" value={pagination.limit} onChange={(event) => updateLimit(event.target.value)} aria-label="Rows per page">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <Button variant="secondary" onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page <= 1}>Previous</Button>
              <Button variant="secondary" onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>Next</Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState title="No transactions found" description="Adjust filters or add your first income or expense transaction." />
      )}

      <Modal open={modal.type === "form"} title={modal.transaction ? "Edit transaction" : "Add transaction"} onClose={() => setModal({ type: null, transaction: null })}>
        <TransactionForm transaction={modal.transaction} onSubmit={save} onCancel={() => setModal({ type: null, transaction: null })} loading={saving} />
      </Modal>
      <Modal open={modal.type === "details"} title="Transaction details" onClose={() => setModal({ type: null, transaction: null })}>
        {modal.transaction && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Title", modal.transaction.title],
              ["Amount", currency(modal.transaction.amount)],
              ["Type", modal.transaction.type],
              ["Category", modal.transaction.category],
              ["Date", dateLabel(modal.transaction.date)],
              ["Notes", modal.transaction.notes || "No notes"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                <p className="label">{label}</p>
                <p className="mt-2 font-black">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <Modal open={modal.type === "delete"} title="Delete transaction" onClose={() => setModal({ type: null, transaction: null })}>
        {modal.transaction && (
          <div>
            <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              This will permanently delete <span className="font-black text-slate-950 dark:text-white">{modal.transaction.title}</span> from this account.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModal({ type: null, transaction: null })}>Cancel</Button>
              <Button variant="danger" onClick={() => remove(modal.transaction)}><FiTrash2 /> Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </MotionPage>
  );
};

export default Transactions;
