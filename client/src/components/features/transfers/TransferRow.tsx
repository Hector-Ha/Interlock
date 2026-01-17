import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transfer } from "@/types/transfer";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

interface TransferRowProps {
  transfer: Transfer;
  onClick?: () => void;
}

export function TransferRow({ transfer, onClick }: TransferRowProps) {
  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <ArrowRight className="h-5 w-5 text-slate-600" aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">
              {transfer.sourceBankName}
            </span>
            <ArrowRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
            <span className="font-medium text-slate-900">
              {transfer.destinationBankName}
            </span>
          </div>
          <p className="text-sm text-slate-500">
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
        <span className="font-semibold text-slate-900 tabular-nums">
          {formatCurrency(transfer.amount)}
        </span>
      </div>
    </div>
  );
}
