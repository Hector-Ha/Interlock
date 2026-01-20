"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  error?: string | boolean;
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = "Select your date of birth",
  disabled = false,
  id,
  error,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-label="Select date"
          aria-expanded={isOpen}
          className={cn(
            "group relative flex w-full items-center justify-between",
            "h-11 px-4 rounded-lg",
            "bg-white border border-[var(--color-gray-disabled)]",
            "text-sm font-medium text-left",
            "transition-all duration-200 ease-out",
            "hover:border-[var(--color-brand-soft)] hover:bg-[var(--color-gray-surface)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)] focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-gray-surface)]",
            !date && "text-[var(--color-gray-main)]",
            date && "text-[var(--color-gray-text)]",
            error && [
              "border-[var(--color-error-main)]",
              "text-[var(--color-error-main)]",
              "hover:border-[var(--color-error-hover)]",
              "focus:ring-[var(--color-error-main)]",
            ],
            className
          )}
        >
          <span className={cn("flex-1 truncate", !date && "opacity-70")}>
            {date ? format(date, "MMMM d, yyyy") : placeholder}
          </span>

          <div
            className={cn(
              "flex items-center justify-center",
              "h-8 w-8 -mr-1 rounded-md",
              "transition-all duration-200 ease-out",
              "group-hover:bg-[var(--color-brand-surface)]",
              error
                ? "text-[var(--color-error-main)]"
                : "text-[var(--color-gray-main)] group-hover:text-[var(--color-brand-main)]"
            )}
          >
            <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-auto p-0",
          "bg-transparent border-none shadow-none",
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
        align="start"
        sideOffset={8}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(checkDate) =>
            checkDate > new Date() || checkDate < new Date("1900-01-01")
          }
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          defaultMonth={date ?? new Date(2000, 0)}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
