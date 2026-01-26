"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  bankTabs: SelectOption[];
  selectedBankTab: string;
  onBankTabChange: (value: string) => void;
}

const sortOptions: SelectOption[] = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "SUCCESS", label: "Success" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
];

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  bankTabs,
  selectedBankTab,
  onBankTabChange,
}: TransactionFiltersProps) {
  const hasFilters =
    searchQuery || statusFilter !== "all" || sortBy !== "date-desc";

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Search */}
        <div className="flex-1 sm:max-w-xs">
          <Input
            type="text"
            placeholder="Search transactions…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            startIcon={<Search className="w-4 h-4" aria-hidden="true" />}
            className="h-9 text-sm"
            containerClassName="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-32 shrink-0">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusChange}
            placeholder="Status"
            triggerClassName="h-9 text-sm"
          />
        </div>

        {/* Sort */}
        <div className="w-full sm:w-40 shrink-0">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by"
            triggerClassName="h-9 text-sm"
          />
        </div>
      </div>

      {/* Bank Tabs */}
      {bankTabs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {bankTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onBankTabChange(tab.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                selectedBankTab === tab.value
                  ? "bg-[var(--color-brand-main)] text-white shadow-md shadow-[var(--color-brand-main)]/25"
                  : "bg-white border border-[var(--color-gray-soft)] text-[var(--color-gray-main)] hover:border-[var(--color-brand-disabled)] hover:text-[var(--color-brand-main)]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
