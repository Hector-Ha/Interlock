"use client";

import { useUIStore } from "@/stores/ui.store";
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  error: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

const iconStyles = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];

        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-5 fade-in duration-200",
              styles[toast.type]
            )}
            role="alert"
          >
            <Icon
              className={cn(
                "h-5 w-5 flex-shrink-0 mt-0.5",
                iconStyles[toast.type]
              )}
            />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="font-medium text-sm">{toast.title}</p>
              )}
              <p className={cn("text-sm", toast.title && "mt-1 opacity-90")}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
