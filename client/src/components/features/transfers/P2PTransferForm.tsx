"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Sentry from "@sentry/nextjs";
import {
  User,
  Info,
  AlertCircle,
  Loader2,
  X,
  Clock,
  Shield,
  Building2,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Alert } from "@/components/ui";
import { Select } from "@/components/ui/Select";
import { RecipientSearch } from "@/components/features/p2p/RecipientSearch";
import { useBankStore } from "@/stores/bank.store";
import { p2pService } from "@/services/p2p.service";
import { useToast } from "@/stores/ui.store";
import { formatCurrency, cn } from "@/lib/utils";
import type { Recipient } from "@/types/p2p";

const P2P_LIMITS = {
  PER_TRANSACTION: 2000,
  DAILY: 5000,
  WEEKLY: 10000,
} as const;

const p2pSchema = z.object({
  amount: z
    .string()
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be greater than $0.00")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num <= P2P_LIMITS.PER_TRANSACTION;
      },
      `Maximum transfer is ${formatCurrency(P2P_LIMITS.PER_TRANSACTION)}`
    ),
  note: z.string().max(200, "Note cannot exceed 200 characters").optional(),
});

type P2PFormData = z.infer<typeof p2pSchema>;

interface P2PTransferFormProps {
  onSuccess?: () => void;
  className?: string;
  isEmbedded?: boolean;
}

export function P2PTransferForm({
  onSuccess,
  className,
  isEmbedded = false,
}: P2PTransferFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { banks, fetchBanks, isLoading: isBankLoading } = useBankStore();

  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const linkedBanks = useMemo(
    () => banks.filter((b) => b.isDwollaLinked && b.status === "ACTIVE"),
    [banks]
  );

  const bankOptions = useMemo(
    () =>
      linkedBanks.map((bank) => ({
        value: bank.id,
        label: bank.institutionName,
      })),
    [linkedBanks]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<P2PFormData>({
    resolver: zodResolver(p2pSchema),
    defaultValues: {
      amount: "",
      note: "",
    },
  });

  const amount = watch("amount");
  const note = watch("note");
  const parsedAmount = parseFloat(amount) || 0;

  const onSubmit = () => {
    if (!selectedRecipient) {
      setError("Please select a recipient");
      return;
    }

    if (!selectedBankId) {
      setError("Please select a source bank account");
      return;
    }

    setError(null);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedRecipient || !selectedBankId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await p2pService.createTransfer({
        recipientId: selectedRecipient.id,
        senderBankId: selectedBankId,
        amount: parsedAmount,
        note: note || undefined,
      });

      toast.success(
        `Successfully sent ${formatCurrency(parsedAmount)} to ${selectedRecipient.firstName}`
      );

      reset();
      setSelectedRecipient(null);
      setSelectedBankId("");
      setShowConfirm(false);

      onSuccess?.();
    } catch (err: unknown) {
      Sentry.captureException(err);
      const message =
        err instanceof Error
          ? err.message
          : "Transfer failed. Please try again.";
      setError(message);
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const handleClearRecipient = () => {
    setSelectedRecipient(null);
  };

  if (isBankLoading && banks.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-16", className)}>
        <Loader2
          className="h-8 w-8 animate-spin text-[var(--color-brand-main)]"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (linkedBanks.length === 0) {
    return (
      <div className={cn("py-12 px-6", className)}>
        <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-full bg-[var(--color-warning-surface)] flex items-center justify-center">
            <Building2
              className="h-7 w-7 text-[var(--color-warning-main)]"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-gray-text)]">
              No Linked Banks
            </h3>
            <p className="text-sm text-[var(--color-gray-main)] mt-1">
              You need at least one bank account linked to send money.
            </p>
          </div>
          <Button
            onClick={() => router.push("/banks")}
            className="bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white"
          >
            Link a Bank
          </Button>
        </div>
      </div>
    );
  }

  const isFormValid = selectedRecipient && selectedBankId && parsedAmount > 0;

  return (
    <>
      <div className={className}>
        {error && (
          <Alert variant="destructive" className="mx-6 mt-6 mb-0">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span className="ml-2">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-text)] mb-2">
              Recipient
            </label>
            {selectedRecipient ? (
              <div className="flex items-center justify-between p-3 border border-[var(--color-gray-soft)] rounded-lg bg-[var(--color-gray-surface)]/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-brand-surface)] flex items-center justify-center">
                    <User
                      className="h-5 w-5 text-[var(--color-brand-main)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-gray-text)] truncate">
                      {selectedRecipient.firstName} {selectedRecipient.lastName}
                    </p>
                    <p className="text-sm text-[var(--color-gray-main)] truncate">
                      {selectedRecipient.email}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearRecipient}
                  className="text-[var(--color-gray-main)] hover:text-[var(--color-gray-text)]"
                >
                  Change
                </Button>
              </div>
            ) : (
              <RecipientSearch onSelect={setSelectedRecipient} />
            )}
          </div>

          {/* Source Bank */}
          <Select
            label="From Account"
            options={bankOptions}
            value={selectedBankId}
            onChange={setSelectedBankId}
            placeholder="Select your bank account…"
          />

          {/* Amount Input */}
          <div>
            <Input
              label="Amount"
              placeholder="0.00"
              startIcon={
                <span className="text-[var(--color-gray-main)] font-medium">
                  $
                </span>
              }
              {...register("amount")}
              error={errors.amount?.message}
              numericOnly
            />
            <p className="text-xs text-[var(--color-gray-main)] mt-1.5 flex items-center gap-1">
              <Info className="h-3 w-3" aria-hidden="true" />
              Limits: {formatCurrency(P2P_LIMITS.PER_TRANSACTION)}/tx ·{" "}
              {formatCurrency(P2P_LIMITS.DAILY)}/day ·{" "}
              {formatCurrency(P2P_LIMITS.WEEKLY)}/week
            </p>
          </div>

          {/* Note Input */}
          <Input
            label="Note (optional)"
            placeholder="What's this for?…"
            {...register("note")}
            error={errors.note?.message}
          />

          {/* Info Footer */}
          <div className="flex items-center justify-center pt-4 border-t border-[var(--color-gray-soft)]">
            <div className="flex items-center gap-4 text-xs text-[var(--color-gray-main)]">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                1-3 business days
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Bank-level security
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white font-medium transition-all"
            disabled={!isFormValid}
          >
            Continue
            <Send className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedRecipient && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <Card className="w-full max-w-md" padding="none">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  id="confirm-title"
                  className="text-lg font-semibold text-[var(--color-gray-text)]"
                >
                  Confirm Transfer
                </h3>
                <button
                  onClick={handleCancelConfirm}
                  className="p-1.5 hover:bg-[var(--color-gray-surface)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)]"
                  disabled={isSubmitting}
                  aria-label="Close confirmation dialog"
                >
                  <X
                    className="h-5 w-5 text-[var(--color-gray-main)]"
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Recipient Card */}
              <div className="flex items-center gap-3 p-4 bg-[var(--color-gray-surface)] rounded-lg mb-4">
                <div className="h-12 w-12 rounded-full bg-[var(--color-brand-surface)] flex items-center justify-center">
                  <User
                    className="h-6 w-6 text-[var(--color-brand-main)]"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wide">
                    Sending to
                  </p>
                  <p className="font-semibold text-[var(--color-gray-text)]">
                    {selectedRecipient.firstName} {selectedRecipient.lastName}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-center py-4 border-y border-[var(--color-gray-soft)]">
                <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wide mb-1">
                  Amount
                </p>
                <p className="text-3xl font-bold text-[var(--color-gray-text)] tabular-nums">
                  {formatCurrency(parsedAmount)}
                </p>
              </div>

              {/* Note */}
              {note && (
                <div className="py-4 border-b border-[var(--color-gray-soft)]">
                  <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wide mb-1">
                    Note
                  </p>
                  <p className="text-sm text-[var(--color-gray-text)]">{note}</p>
                </div>
              )}

              {/* Timing Info */}
              <p className="text-sm text-[var(--color-gray-main)] py-4 flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Funds will arrive within 1-3 business days
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelConfirm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Sending…
                    </>
                  ) : (
                    "Confirm & Send"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
