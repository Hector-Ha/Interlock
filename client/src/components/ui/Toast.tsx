"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore, Toast as ToastType } from "@/stores/toast.store";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-600",
    title: "text-emerald-800",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: "text-red-600",
    title: "text-red-800",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    icon: "text-amber-600",
    title: "text-amber-800",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-800",
  },
};

interface ToastItemProps {
  toast: ToastType;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[toast.type];
  const style = styles[toast.type];

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 200); // Wait for animation
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-200",
        style.bg,
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", style.icon)} />

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", style.title)}>{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-gray-600">{toast.message}</p>
        )}
      </div>

      {toast.dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 sm:p-6"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
