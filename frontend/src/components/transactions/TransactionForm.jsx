import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { categories } from "../../utils/formatters";

const initialForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  notes: "",
  date: new Date().toISOString().slice(0, 10)
};

const TransactionForm = ({ transaction, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        notes: transaction.notes || "",
        date: new Date(transaction.date).toISOString().slice(0, 10)
      });
    } else {
      setForm(initialForm);
    }
  }, [transaction]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Title</span>
          <input className="input" value={form.title} onChange={(event) => update("title", event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="label">Amount</span>
          <input className="input" type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => update("amount", event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="label">Type</span>
          <select className="input" value={form.type} onChange={(event) => update("type", event.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="label">Category</span>
          <select className="input" value={form.category} onChange={(event) => update("category", event.target.value)}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="label">Date</span>
          <input className="input" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} required />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="label">Notes</span>
        <textarea className="input min-h-28 resize-none" value={form.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{transaction ? "Update" : "Add"} transaction</Button>
      </div>
    </form>
  );
};

export default TransactionForm;
