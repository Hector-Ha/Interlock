"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      className={cn(
        "p-3 bg-white rounded-[var(--radius)] border border-[var(--color-gray-disabled)] shadow-lg",
        className,
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3 flex flex-col",
        month_caption: "flex items-center gap-1 w-[252px]",
        caption_label: cn(
          "text-sm font-semibold text-[var(--color-gray-text)] tracking-tight",
          props.captionLayout?.includes("dropdown") && "hidden",
        ),
        nav: "contents",
        button_previous: cn(
          "inline-flex items-center justify-center shrink-0",
          "h-7 w-7 rounded-[var(--radius)]",
          "bg-[var(--color-gray-surface)] border border-[var(--color-gray-disabled)]",
          "text-[var(--color-gray-main)] hover:text-[var(--color-brand-main)]",
          "hover:bg-[var(--color-brand-surface)] hover:border-[var(--color-brand-soft)]",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-offset-2",
          "order-first",
        ),
        button_next: cn(
          "inline-flex items-center justify-center shrink-0",
          "h-7 w-7 rounded-[var(--radius)]",
          "bg-[var(--color-gray-surface)] border border-[var(--color-gray-disabled)]",
          "text-[var(--color-gray-main)] hover:text-[var(--color-brand-main)]",
          "hover:bg-[var(--color-brand-surface)] hover:border-[var(--color-brand-soft)]",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-offset-2",
          "order-last",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: cn(
          "h-9 w-9 text-center",
          "text-xs font-semibold uppercase tracking-wider",
          "text-[var(--color-gray-main)]",
          "flex items-center justify-center",
        ),
        week: "flex",
        day: cn("relative p-0", "h-9 w-9", "flex items-center justify-center"),
        day_button: cn(
          "inline-flex items-center justify-center",
          "h-8 w-8 rounded-full",
          "text-sm font-medium text-[var(--color-gray-text)]",
          "transition-all duration-150 ease-out",
          "hover:bg-[var(--color-brand-surface)] hover:text-[var(--color-brand-main)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-offset-1",
          "aria-selected:bg-[var(--color-brand-main)] aria-selected:!text-white aria-selected:shadow-sm",
          "aria-selected:hover:bg-[var(--color-brand-main)] aria-selected:hover:!text-white",
        ),
        range_end: "day-range-end",
        selected:
          "bg-[var(--color-brand-main)] !text-white shadow-sm hover:bg-[var(--color-brand-main)] hover:!text-white",
        today: cn(
          "bg-[var(--color-brand-surface)] text-[var(--color-brand-main)]",
          "font-semibold",
          "ring-1 ring-inset ring-[var(--color-brand-soft)]",
        ),
        outside: cn(
          "day-outside",
          "text-[var(--color-gray-disabled)] opacity-50",
        ),
        disabled: cn(
          "text-[var(--color-gray-disabled)]",
          "cursor-not-allowed opacity-40",
        ),
        range_middle: cn(
          "aria-selected:bg-[var(--color-brand-surface)]",
          "aria-selected:text-[var(--color-brand-text)]",
        ),
        hidden: "invisible",
        dropdowns: "flex flex-1 justify-center gap-1",
        dropdown: cn(
          "flex items-center justify-between",
          "px-2 py-1 rounded-md",
          "bg-[var(--color-gray-surface)] border border-[var(--color-gray-disabled)]",
          "text-xs font-medium text-[var(--color-gray-text)]",
          "transition-all duration-200 ease-out",
          "hover:border-[var(--color-brand-soft)] hover:bg-white",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)] focus:ring-offset-1",
          "cursor-pointer",
          "[&>span]:line-clamp-1",
        ),
        dropdown_icon: "hidden",
        dropdown_year: "",
        dropdown_month: "",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" strokeWidth={2.5} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
