"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Copy, Check, XCircle } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { TransferDetails } from "@/types/transfer";

interface TransferDetailModalProps {
  transfer: TransferDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: (transferId: string) => Promise<void>;
}

/**
 * Modal displaying detailed information about a single transfer.
 * Includes source/destination banks, amount, status, timestamps,
 * and a cancel button for PENDING transfers.
 */
export function TransferDetailModal({
  transfer,
  open,
  onOpenChange,
  onCancel,
}: TransferDetailModalProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!transfer) return null;

  const createdDate = formatDateTime(transfer.createdAt);
  const updatedDate = formatDateTime(transfer.updatedAt);
  const canCancel = transfer.status === "PENDING" && onCancel;

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(transfer.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    if (!onCancel) return;
    setIsCancelling(true);
    try {
      await onCancel(transfer.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to cancel transfer:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
      case "RETURNED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Transfer Details</ModalTitle>
          <ModalDescription>
            View detailed information about this transfer
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-6">
          {/* Transfer ID */}
          <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border border-border/50">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Transfer ID
              </p>
              <p className="text-sm font-mono text-foreground mt-0.5">
                {transfer.id.slice(0, 8)}...{transfer.id.slice(-4)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyId}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success-main" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Banks */}
          <div className="flex items-center gap-4 justify-center py-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                From
              </p>
              <p className="font-medium text-foreground">
                {transfer.sourceBank.institutionName}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                To
              </p>
              <p className="font-medium text-foreground">
                {transfer.destinationBank.institutionName}
              </p>
            </div>
          </div>

          {/* Amount & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Amount
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(transfer.amount)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </p>
              <div className="mt-2">
                <Badge variant={getStatusVariant(transfer.status)}>
                  {transfer.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="text-foreground">
                {createdDate.dateOnly} at {createdDate.timeOnly}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="text-foreground">
                {updatedDate.dateOnly} at {updatedDate.timeOnly}
              </span>
            </div>
            {transfer.dwollaTransferId && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dwolla ID</span>
                <span className="text-foreground font-mono text-xs">
                  {transfer.dwollaTransferId.slice(0, 12)}...
                </span>
              </div>
            )}
          </div>
        </div>

        <ModalFooter>
          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Cancel Transfer
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
