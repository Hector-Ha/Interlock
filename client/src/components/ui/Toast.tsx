"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const Icon = icons[toast.type];
  const style = styles[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
        style.bg,
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", style.icon)} />

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", style.title)}>{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-muted-foreground">{toast.message}</p>
        )}
      </div>

      {toast.dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 sm:p-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
