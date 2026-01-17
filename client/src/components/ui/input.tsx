import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  hint?: string;
  success?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  numericOnly?: boolean;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type,
      label,
      error,
      hint,
      success,
      startIcon,
      endIcon,
      showPasswordToggle,
      disabled,
      readOnly,
      numericOnly,
      onChange,
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";
    const currentType = isPasswordType && showPassword ? "text" : type;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;
    const errorMessage = typeof error === "string" ? error : undefined;

    const handlePasswordToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (numericOnly) {
        const regex = /^[0-9]*$/;
        if (!regex.test(e.target.value)) {
          return;
        }
      }

      onChange?.(e);
    };

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {startIcon}
            </div>
          )}

          <input
            id={inputId}
            type={currentType}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              startIcon && "pl-10",
              (endIcon || (isPasswordType && showPasswordToggle)) && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive",
              success &&
                !hasError &&
                "border-success-main focus-visible:ring-success-main",
              readOnly && "bg-muted cursor-default focus-visible:ring-0",
              className,
            )}
            disabled={disabled}
            readOnly={readOnly}
            ref={ref}
            onChange={handleChange}
            aria-invalid={hasError}
            aria-describedby={
              errorMessage
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />

          {!showPasswordToggle && endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {endIcon}
            </div>
          )}

          {isPasswordType && showPasswordToggle && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {errorMessage && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {hint && !hasError && (
          <p id={`${inputId}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
