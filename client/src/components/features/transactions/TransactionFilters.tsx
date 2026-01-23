"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
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
  const hasFilters = searchQuery || statusFilter !== "all" || sortBy !== "date-desc";

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-disabled)]" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-[var(--color-gray-soft)] focus:border-[var(--color-brand-disabled)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-main)] hover:text-[var(--color-gray-text)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-36">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusChange}
            placeholder="Status"
          />
        </div>

        {/* Sort */}
        <div className="w-full sm:w-44">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by"
          />
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("");
              onStatusChange("all");
              onSortChange("date-desc");
            }}
            className="text-[var(--color-gray-main)] hover:text-[var(--color-error-main)]"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
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
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                selectedBankTab === tab.value
                  ? "bg-[var(--color-brand-main)] text-white shadow-md shadow-[var(--color-brand-main)]/25"
                  : "bg-white border border-[var(--color-gray-soft)] text-[var(--color-gray-main)] hover:border-[var(--color-brand-disabled)] hover:text-[var(--color-brand-main)]"
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
