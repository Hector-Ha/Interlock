"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  triggerClassName?: string;
  itemClassName?: string;
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
  triggerClassName,
  itemClassName,
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
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-colors",
            "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input",
            isOpen && "ring-2 ring-ring ring-offset-2",
            triggerClassName,
          )}
          disabled={disabled}
        >
          <span
            className={cn(
              "flex items-center gap-2 truncate",
              !selectedOption && "text-muted-foreground",
            )}
          >
            {selectedOption?.icon && (
              <span className="text-muted-foreground">
                {selectedOption.icon}
              </span>
            )}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-popover p-1 shadow-md"
            >
              {options.length === 0 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={option.value === value}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-2 pr-8 text-sm outline-none transition-colors text-left",
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent",
                      option.value === value && "bg-accent/50 font-medium",
                      itemClassName,
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon && (
                        <div className="flex bg-muted h-8 w-8 items-center justify-center rounded-full text-muted-foreground">
                          {option.icon}
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-foreground">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {option.value === value && (
                      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check
                          className="h-4 w-4 text-emerald-600"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
