import { format } from "date-fns";

export const currency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

export const number = (value = 0) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value) || 0);

export const dateLabel = (value) => (value ? format(new Date(value), "dd MMM yyyy") : "Not set");

export const monthName = (month) =>
  new Date(2026, Number(month) - 1, 1).toLocaleString("en-US", { month: "long" });

export const initials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Investment",
  "Travel",
  "Salary",
  "Freelance",
  "Other"
];
