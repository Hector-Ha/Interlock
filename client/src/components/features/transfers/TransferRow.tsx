import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transfer } from "@/types/transfer";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, ArrowLeftRight } from "lucide-react";

interface TransferRowProps {
  transfer: Transfer;
  onClick?: () => void;
}

export function TransferRow({ transfer, onClick }: TransferRowProps) {
  return (
    <div
      className="group flex items-center justify-between p-4 hover:bg-brand-surface/30 transition-all duration-200 cursor-pointer border-b border-border/50 last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-main focus-visible:ring-inset"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-surface transition-transform group-hover:scale-105">
          <ArrowLeftRight
            className="h-5 w-5 text-brand-main"
            aria-hidden="true"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground group-hover:text-brand-main transition-colors">
              {transfer.sourceBankName}
            </span>
            <ArrowRight
              className="h-3 w-3 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">
              {transfer.destinationBankName}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(transfer.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge
          variant={
            transfer.status === "SUCCESS"
              ? "success"
              : transfer.status === "PENDING"
                ? "warning"
                : "destructive"
          }
        >
          {transfer.status}
        </Badge>
        <span className="font-semibold text-foreground tabular-nums">
          {formatCurrency(transfer.amount)}
        </span>
      </div>
    </div>
  );
}
