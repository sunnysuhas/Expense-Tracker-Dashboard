import { currency, dateLabel } from "./formatters";

export const exportTransactionsCsv = (transactions, filename = "finora-transactions.csv") => {
  const headers = ["Title", "Amount", "Type", "Category", "Notes", "Date"];
  const rows = transactions.map((item) => [
    item.title,
    item.amount,
    item.type,
    item.category,
    item.notes || "",
    dateLabel(item.date)
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportTransactionsPdf = async (transactions, filename = "finora-report.pdf") => {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable")
  ]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Finora Expense Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 26);
  autoTable(doc, {
    startY: 34,
    head: [["Title", "Amount", "Type", "Category", "Date"]],
    body: transactions.map((item) => [
      item.title,
      currency(item.amount),
      item.type,
      item.category,
      dateLabel(item.date)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [56, 189, 248] }
  });
  doc.save(filename);
};
