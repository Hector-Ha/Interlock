import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transfer } from "@/types/transfer";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransferRowProps {
  transfer: Transfer;
}

export function TransferRow({ transfer }: TransferRowProps) {
  const isIncoming = false;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <ArrowRight className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">
              {transfer.sourceBankName}
            </span>
            <ArrowRight className="h-3 w-3 text-slate-400" />
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
        <span className="font-semibold text-slate-900">
          {formatCurrency(transfer.amount)}
        </span>
      </div>
    </div>
  );
}
