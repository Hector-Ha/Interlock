"use client";

import * as Sentry from "@sentry/nextjs";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  ArrowDownUp,
  AlertCircle,
  Building2,
  Clock,
  Shield,
} from "lucide-react";
import { useBankStore } from "@/stores/bank.store";
import { transferService } from "@/services/transfer.service";
import { Button, Input, Card, Alert } from "@/components/ui";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/stores/ui.store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const transferSchema = z.object({
  sourceBankId: z.string().min(1, "Source bank is required"),
  destinationBankId: z.string().min(1, "Destination bank is required"),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be greater than $0.00" }
  ),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onSuccess?: () => void;
  className?: string;
  isEmbedded?: boolean;
}

export function TransferForm({
  onSuccess,
  className,
  isEmbedded = false,
}: TransferFormProps) {
  const router = useRouter();
  const toast = useToast();

  const { banks, fetchBanks, isLoading: isBankLoading } = useBankStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: "",
    },
  });

  const sourceBankId = watch("sourceBankId");
  const destinationBankId = watch("destinationBankId");
  const amount = watch("amount");
  const parsedAmount = parseFloat(amount) || 0;

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const validBanks = useMemo(
    () => banks.filter((b) => b.isDwollaLinked && b.status === "ACTIVE"),
    [banks]
  );

  const sourceOptions = useMemo(
    () =>
      validBanks.map((bank) => ({
        value: bank.id,
        label: bank.institutionName,
      })),
    [validBanks]
  );

  const destinationOptions = useMemo(
    () =>
      validBanks
        .filter((b) => b.id !== sourceBankId)
        .map((bank) => ({
          value: bank.id,
          label: bank.institutionName,
        })),
    [validBanks, sourceBankId]
  );

  const onSubmit = async (data: TransferFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await transferService.initiateTransfer({
        sourceBankId: data.sourceBankId,
        destinationBankId: data.destinationBankId,
        amount: parseFloat(data.amount),
      });

      toast.success("Transfer initiated successfully");
      setValue("sourceBankId", "");
      setValue("destinationBankId", "");
      setValue("amount", "");
      onSuccess?.();
    } catch (err: unknown) {
      Sentry.captureException(err);
      const message =
        err instanceof Error ? err.message : "Failed to initiate transfer";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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

  if (validBanks.length < 2) {
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
              Not Enough Accounts
            </h3>
            <p className="text-sm text-[var(--color-gray-main)] mt-1">
              You need at least 2 connected banks to make internal transfers.
            </p>
          </div>
          <Button
            onClick={() => router.push("/banks")}
            className="bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white"
          >
            Connect Bank
          </Button>
        </div>
      </div>
    );
  }

  const isFormValid = sourceBankId && destinationBankId && parsedAmount > 0;

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mx-6 mt-6 mb-0">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Account Selection */}
        <div className="space-y-4">
          <Select
            label="From Account"
            options={sourceOptions}
            value={sourceBankId}
            onChange={(val) =>
              setValue("sourceBankId", val, { shouldValidate: true })
            }
            placeholder="Select source account…"
            error={errors.sourceBankId?.message}
          />

          {/* Transfer Direction Indicator */}
          <div className="flex justify-center -my-1">
            <div className="w-9 h-9 rounded-full bg-[var(--color-gray-surface)] border border-[var(--color-gray-soft)] flex items-center justify-center">
              <ArrowDownUp
                className="h-4 w-4 text-[var(--color-gray-main)]"
                aria-hidden="true"
              />
            </div>
          </div>

          <Select
            label="To Account"
            options={destinationOptions}
            value={destinationBankId}
            onChange={(val) =>
              setValue("destinationBankId", val, { shouldValidate: true })
            }
            placeholder="Select destination account…"
            error={errors.destinationBankId?.message}
            disabled={!sourceBankId}
          />
        </div>

        {/* Amount Input */}
        <div className="pt-2">
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
        </div>

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
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="h-4 w-4 mr-2 animate-spin"
                aria-hidden="true"
              />
              Processing…
            </>
          ) : (
            <>
              Transfer Funds
              <ArrowDownUp className="ml-2 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
