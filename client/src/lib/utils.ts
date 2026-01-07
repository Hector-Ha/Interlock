import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Easing function
export const easeOutQuart = (t: number, b: number, c: number, d: number) => {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Format date
export function formatDateTime(date: Date | string) {
  const d = new Date(date);
  return {
    dateOnly: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timeOnly: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    full: d.toLocaleString("en-US"),
  };
}

export function formatDate(date: Date | string) {
  return formatDateTime(date).dateOnly;
}

export function getTransactionCategoryStyles(category: string | string[]) {
  const cat = Array.isArray(category) ? category[0] : category;

  return "bg-slate-100 text-slate-700";
}
