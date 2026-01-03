import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  numericOnly?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      success,
      startIcon,
      endIcon,
      showPasswordToggle,
      disabled,
      readOnly,
      numericOnly,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";
    const currentType = isPasswordType && showPassword ? "text" : type;

    const handlePasswordToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (numericOnly) {
        const regex = /^[0-9]*$/;
        if (!regex.test(e.target.value)) {
          return; // Ignore the change
        }
      }

      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {startIcon}
          </div>
        )}

        <input
          type={currentType}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon && "pl-10",
            (endIcon || (isPasswordType && showPasswordToggle)) && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            success &&
              !error &&
              "border-success-main focus-visible:ring-success-main",
            readOnly && "bg-muted cursor-default focus-visible:ring-0",
            className
          )}
          disabled={disabled}
          readOnly={readOnly}
          ref={ref}
          onChange={handleChange}
          {...props}
        />

        {/* Render endIcon if provided and not in password toggle mode, or if we want external icons to co-exist (usually toggle replaces end icon for password fields) */}
        {!showPasswordToggle && endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {endIcon}
          </div>
        )}

        {/* Specific logic for password toggle, acts as an end icon */}
        {isPasswordType && showPasswordToggle && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Helper icons for error/success if no other end icon is occupying space? 
            For now, let's keep it simple. If users want an error icon, they pass it as endIcon or we handle it. 
            Often inputs with errors just change border color. 
        */}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
