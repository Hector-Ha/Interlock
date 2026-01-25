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

  return "bg-muted text-muted-foreground";
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  return formatDate(d);
}

// Format date as "Wed 1:00pm" style
export function formatDayTime(date: Date | string): string {
  const d = new Date(date);
  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  const time = d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  return `${dayName} ${time}`;
}

// Format category: replace underscores with spaces and uppercase
export function formatCategory(category: string): string {
  return category.replace(/_/g, " ").toUpperCase();
}

// Get category badge variant based on category name
export function getCategoryBadgeVariant(
  category: string,
): "success-soft" | "info-soft" | "warning-soft" | "error-soft" | "gray-soft" {
  const cat = category.toLowerCase();
  if (
    cat.includes("deposit") ||
    cat.includes("income") ||
    cat.includes("salary")
  ) {
    return "success-soft";
  }
  if (cat.includes("subscription") || cat.includes("entertainment")) {
    return "info-soft";
  }
  if (
    cat.includes("food") ||
    cat.includes("groceries") ||
    cat.includes("dining")
  ) {
    return "warning-soft";
  }
  if (cat.includes("declined") || cat.includes("failed")) {
    return "error-soft";
  }
  return "gray-soft";
}
