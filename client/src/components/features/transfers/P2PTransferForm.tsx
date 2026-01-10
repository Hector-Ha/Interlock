"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Sentry from "@sentry/nextjs";
import { ArrowRight, User, Info, AlertCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Alert } from "@/components/ui";
import { Select } from "@/components/ui/Select";
import { RecipientSearch } from "@/components/features/p2p/RecipientSearch";
import { useBankStore } from "@/stores/bank.store";
import { p2pService } from "@/services/p2p.service";
import { useToast } from "@/stores/ui.store";
import { formatCurrency } from "@/lib/utils";
import type { Recipient } from "@/types/p2p";

// P2P Transfer limits
const P2P_LIMITS = {
  PER_TRANSACTION: 2000,
  DAILY: 5000,
  WEEKLY: 10000,
} as const;

// Validation schema
const p2pSchema = z.object({
  amount: z
    .string()
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be greater than $0.00")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= P2P_LIMITS.PER_TRANSACTION;
    }, `Maximum transfer is ${formatCurrency(P2P_LIMITS.PER_TRANSACTION)}`),
  note: z.string().max(200, "Note cannot exceed 200 characters").optional(),
});

type P2PFormData = z.infer<typeof p2pSchema>;

interface P2PTransferFormProps {
  onSuccess?: () => void;
  className?: string;
}

// Form component for sending money to another Interlock user.
export function P2PTransferForm({
  onSuccess,
  className,
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

  // Fetch banks on mount
  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  // Filter banks that are Dwolla-linked and active
  const linkedBanks = banks.filter(
    (b) => b.isDwollaLinked && b.status === "ACTIVE"
  );

  const bankOptions = linkedBanks.map((bank) => ({
    value: bank.id,
    label: bank.institutionName,
  }));

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

  const onSubmit = (data: P2PFormData) => {
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
        `Successfully sent ${formatCurrency(parsedAmount)} to ${
          selectedRecipient.firstName
        }!`
      );

      // Reset form
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

  // Show loading state
  if (isBankLoading && banks.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-main" />
      </div>
    );
  }

  // No linked banks warning
  if (linkedBanks.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-warning-main" />
          <h3 className="text-lg font-semibold text-content-primary">
            No Linked Banks
          </h3>
          <p className="text-content-secondary max-w-sm">
            You need at least one bank account linked with Dwolla to send money.
            Please link a bank first.
          </p>
          <Button onClick={() => router.push("/my-banks")}>Link a Bank</Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-content-primary mb-1">
            Send Money
          </h2>
          <p className="text-content-secondary text-sm mb-6">
            Transfer funds to another Interlock user
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">{error}</span>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Recipient Search */}
            <div>
              <label className="block text-sm font-medium text-content-primary mb-2">
                Recipient
              </label>
              {selectedRecipient ? (
                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-surface-alt">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-surface flex items-center justify-center">
                      <User className="h-5 w-5 text-brand-text" />
                    </div>
                    <div>
                      <p className="font-medium text-content-primary">
                        {selectedRecipient.firstName}{" "}
                        {selectedRecipient.lastName}
                      </p>
                      <p className="text-sm text-content-secondary">
                        {selectedRecipient.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearRecipient}
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
              placeholder="Select your bank account"
            />

            {/* Amount */}
            <div>
              <Input
                label="Amount"
                placeholder="0.00"
                startIcon={<span className="text-content-tertiary">$</span>}
                {...register("amount")}
                error={errors.amount?.message}
                numericOnly
              />
              <p className="text-xs text-content-tertiary mt-1.5 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Max: {formatCurrency(P2P_LIMITS.PER_TRANSACTION)}/tx |{" "}
                {formatCurrency(P2P_LIMITS.DAILY)}/day |{" "}
                {formatCurrency(P2P_LIMITS.WEEKLY)}/week
              </p>
            </div>

            {/* Note */}
            <Input
              label="Note (optional)"
              placeholder="What's this for?"
              {...register("note")}
              error={errors.note?.message}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  !selectedRecipient || !selectedBankId || parsedAmount <= 0
                }
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirm && selectedRecipient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-content-primary">
                  Confirm Transfer
                </h3>
                <button
                  onClick={handleCancelConfirm}
                  className="p-1 hover:bg-surface-alt rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="h-5 w-5 text-content-secondary" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-content-secondary">To</span>
                  <span className="font-medium text-content-primary">
                    {selectedRecipient.firstName} {selectedRecipient.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Amount</span>
                  <span className="font-semibold text-lg text-content-primary">
                    {formatCurrency(parsedAmount)}
                  </span>
                </div>
                {note && (
                  <div className="flex justify-between">
                    <span className="text-content-secondary">Note</span>
                    <span className="text-content-primary text-right max-w-[200px] truncate">
                      {note}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-content-secondary mb-6">
                Funds will be transferred within 1-3 business days.
              </p>

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
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
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
