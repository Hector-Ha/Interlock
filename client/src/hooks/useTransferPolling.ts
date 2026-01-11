"use client";

import { useEffect, useRef, useCallback } from "react";
import { transferService } from "@/services/transfer.service";
import { toast } from "@/stores/toast.store";

interface UseTransferPollingOptions {
  enabled?: boolean;
  interval?: number;
  onStatusChange?: (transferId: string, newStatus: string) => void;
}

export function useTransferPolling<
  T extends { id: string; status: string; amount: number }
>(transfers: T[], options: UseTransferPollingOptions = {}) {
  const { enabled = true, interval = 10000, onStatusChange } = options;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<Map<string, string>>(new Map());

  const checkTransferStatus = useCallback(async () => {
    // Filter for pending or processing transfers
    const pendingTransfers = transfers.filter(
      (t) => t.status === "PENDING" || t.status === "PROCESSING"
    );

    if (pendingTransfers.length === 0) return;

    try {
      const statusPromises = pendingTransfers.map((transfer) =>
        transferService.getTransfer(transfer.id)
      );

      const results = await Promise.allSettled(statusPromises);

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const transfer = pendingTransfers[index];
          const newStatus = result.value.transfer.status;

          const previousStatus = previousStatusRef.current.get(transfer.id);

          if (previousStatus && previousStatus !== newStatus) {
            onStatusChange?.(transfer.id, newStatus);

            // Show toast notification
            const amount = Math.abs(transfer.amount).toFixed(2);

            if (newStatus === "SUCCESS") {
              toast.success(
                "Transfer Complete",
                `Your transfer of $${amount} has been completed.`
              );
            } else if (newStatus === "FAILED") {
              toast.error(
                "Transfer Failed",
                `Your transfer of $${amount} has failed.`
              );
            } else if (newStatus === "RETURNED") {
              toast.warning(
                "Transfer Returned",
                `Your transfer of $${amount} has been returned.`
              );
            }
          }

          previousStatusRef.current.set(transfer.id, newStatus);
        }
      });
    } catch (error) {
      console.error("Error polling transfer status:", error);
    }
  }, [transfers, onStatusChange]);

  useEffect(() => {
    if (!enabled) return;

    // Initialize status map
    transfers.forEach((t) => {
      if (!previousStatusRef.current.has(t.id)) {
        previousStatusRef.current.set(t.id, t.status);
      }
    });

    intervalRef.current = setInterval(checkTransferStatus, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, checkTransferStatus, transfers]);

  const refresh = useCallback(() => {
    checkTransferStatus();
  }, [checkTransferStatus]);

  return { refresh };
}
