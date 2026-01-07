"use client";

import { useForm } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalDescription,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { TransferFilters } from "@/types/transfer";

interface TransferFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: TransferFilters;
  onApply: (filters: TransferFilters) => void;
}

export function TransferFiltersModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: TransferFiltersModalProps) {
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<TransferFilters>({
      defaultValues: filters,
    });

  const onSubmit = (data: TransferFilters) => {
    // Remove empty strings/undefined
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "" && v !== undefined)
    );
    onApply(cleanedData);
    onOpenChange(false);
  };

  const handleReset = () => {
    reset({});
    onApply({});
    onOpenChange(false);
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "SUCCESS", label: "Success" },
    { value: "FAILED", label: "Failed" },
    { value: "RETURNED", label: "Returned" },
  ];

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Filter Transfers</ModalTitle>
          <ModalDescription>
            Narrow down your transfer history by status and date.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Select
              label="Status"
              options={statusOptions}
              value={watch("status") || "all"}
              onChange={(value) => setValue("status", value)}
              placeholder="Select status"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" {...register("startDate")} />
            <Input label="End Date" type="date" {...register("endDate")} />
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Apply Filters</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
