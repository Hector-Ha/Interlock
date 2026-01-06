"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  error,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm ring-offset-white transition-all",
            "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-200 focus:border-slate-400",
            isOpen && "border-slate-400 ring-2 ring-slate-400 ring-offset-2"
          )}
          disabled={disabled}
        >
          <span
            className={cn(
              "flex items-center gap-2 truncate",
              !selectedOption && "text-slate-500"
            )}
          >
            {selectedOption?.icon && (
              <span className="text-slate-500">{selectedOption.icon}</span>
            )}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
            {options.length === 0 ? (
              <div className="p-2 text-center text-sm text-slate-500">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-2 pr-8 text-sm outline-none transition-colors",
                    option.disabled
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-slate-100",
                    option.value === value && "bg-slate-50 font-medium"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <div className="flex bg-slate-100 h-8 w-8 items-center justify-center rounded-full text-slate-500">
                        {option.icon}
                      </div>
                    )}
                    <div className="flex flex-col items-start">
                      <span className="text-slate-900">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-slate-500">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {option.value === value && (
                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
