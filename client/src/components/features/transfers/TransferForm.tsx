"use client";

import * as Sentry from "@sentry/nextjs";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRightLeft, AlertCircle } from "lucide-react";
import { useBankStore } from "@/stores/bank.store";
import { transferService } from "@/services/transfer.service";
import { Button, Input, Card, Alert } from "@/components/ui";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/stores/ui.store";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Schema
const transferSchema = z.object({
  sourceBankId: z.string().min(1, "Source bank is required"),
  destinationBankId: z.string().min(1, "Destination bank is required"),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be greater than $0.00" },
  ),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function TransferForm({
  onSuccess,
  className,
  isEmbedded = false,
}: TransferFormProps & { isEmbedded?: boolean }) {
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

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  // Memoized: only recompute when banks change
  const validBanks = useMemo(
    () => banks.filter((b) => b.isDwollaLinked && b.status === "ACTIVE"),
    [banks],
  );

  const sourceOptions = useMemo(
    () =>
      validBanks.map((bank) => ({
        value: bank.id,
        label: bank.institutionName,
        description: "Available for transfer",
      })),
    [validBanks],
  );

  const destinationOptions = useMemo(
    () =>
      validBanks
        .filter((b) => b.id !== sourceBankId)
        .map((bank) => ({
          value: bank.id,
          label: bank.institutionName,
        })),
    [validBanks, sourceBankId],
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

      toast.success("Transfer Initiated Successfully!");
      // Reset form
      setValue("sourceBankId", "");
      setValue("destinationBankId", "");
      setValue("amount", "");
      onSuccess?.();
    } catch (err: any) {
      Sentry.captureException(err);
      setError(err.message || "Failed to initiate transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBankLoading && banks.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (validBanks.length < 2) {
    const content = (
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-yellow-500" />
        <h3 className="text-lg font-semibold">Not Enough Accounts</h3>
        <p className="text-slate-500 max-w-sm">
          You need at least 2 connected banks to make a transfer. Please connect
          another bank first.
        </p>
        <Button onClick={() => router.push("/banks")}>Connect Bank</Button>
      </div>
    );

    return isEmbedded ? (
      <div className={`p-6 ${className || ""}`}>{content}</div>
    ) : (
      <Card className="p-6">{content}</Card>
    );
  }

  const Wrapper = isEmbedded ? "div" : Card;
  const wrapperProps = isEmbedded
    ? { className: className || "" }
    : { className: `max-w-xl mx-auto p-6 ${className || ""}` };

  return (
    <Wrapper {...wrapperProps}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Transfer Funds</h2>
        <p className="text-slate-500">
          Move money between your connected accounts
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Source Bank */}
          <Select
            label="From Account"
            options={sourceOptions}
            value={sourceBankId}
            onChange={(val) =>
              setValue("sourceBankId", val, { shouldValidate: true })
            }
            placeholder="Select source bank"
            error={errors.sourceBankId?.message}
          />

          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-slate-50 rounded-full p-2 border border-slate-200 text-slate-400">
              <ArrowRightLeft className="h-4 w-4 rotate-90" />
            </div>
          </div>

          {/* Destination Bank */}
          <Select
            label="To Account"
            options={destinationOptions}
            value={destinationBankId}
            onChange={(val) =>
              setValue("destinationBankId", val, { shouldValidate: true })
            }
            placeholder="Select destination bank"
            error={errors.destinationBankId?.message}
            disabled={!sourceBankId}
          />

          {/* Amount */}
          <div className="pt-2">
            <Input
              label="Amount"
              placeholder="0.00"
              startIcon={<span className="text-slate-500">$</span>}
              {...register("amount")}
              error={errors.amount?.message}
              numericOnly
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between text-sm mb-6">
            <span className="text-slate-500">Estimated Arrival</span>
            <span className="font-medium">1-3 Business Days</span>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            {isSubmitting ? "Processing…" : "Transfer Funds"}
          </Button>
        </div>
      </form>
    </Wrapper>
  );
}
