"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { signUpSchema, type SignUpSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";

import { AuthFooterLinks } from "@/components/auth";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PasswordChecklist } from "@/components/forms/PasswordChecklist";

const STEPS = [
  {
    id: 1,
    name: "Account",
    title: "Create your secure credentials",
    fields: ["email", "password", "confirmPassword"],
  },
  {
    id: 2,
    name: "Personal",
    title: "Tell us about yourself",
    fields: ["firstName", "lastName", "dateOfBirth"],
  },
  {
    id: 3,
    name: "Address",
    title: "Where are you currently located?",
    fields: ["address", "city", "state", "postalCode"],
  },
  {
    id: 4,
    name: "Identity",
    title: "Final verification",
    fields: ["ssn"],
  },
];

export function SignUpForm() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setError: setFormError,
    control,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleNext = async () => {
    const currentStepFields = STEPS[step - 1].fields as (keyof SignUpSchema)[];
    const isStepValid = await trigger(currentStepFields);

    if (step === 1) {
      const { password, confirmPassword } = getValues();
      if (password !== confirmPassword) {
        setFormError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return;
      }
    }

    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SignUpSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await authService.signUp({
        ...data,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      setUser(user);
      router.push("/");
    } catch (err) {
      console.error("Sign up failed", err);
      const message =
        (err as any)?.message ||
        (err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStep = STEPS[step - 1];

  return (
    <div className="grid gap-4">
      {/* Progress Indicator */}
      <div className="flex flex-col gap-2 border-y border-border/40 py-4 my-2">
        <div>
          <p className="text-xs text-muted-foreground text-center">
            Step {step} of {STEPS.length} - {currentStep.name}
          </p>

          {/* Step Header */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              {currentStep.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between px-2">
          {STEPS.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 ${
                    step > s.id
                      ? "bg-success-main text-white"
                      : step === s.id
                        ? "bg-brand-main text-white ring-4 ring-brand-main/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.id ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    s.id
                  )}
                </div>
                <span className="text-xs font-medium text-muted-foreground hidden sm:block">
                  {s.name}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block w-8 h-0.5 mx-1.5 transition-colors duration-300 ${
                    step > s.id ? "bg-success-main" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {step === 4 && (
        <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center mb-2">
          <Shield className="w-3.5 h-3.5" aria-hidden="true" />
          Used for identity verification only. Never shared.
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4"
              >
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  label="Email"
                  disabled={isLoading}
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  id="password"
                  placeholder="Create a password"
                  type="password"
                  autoComplete="new-password"
                  label="Password"
                  showPasswordToggle
                  disabled={isLoading}
                  error={errors.password?.message}
                  {...register("password")}
                />
                <Input
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                  autoComplete="new-password"
                  label="Confirm Password"
                  showPasswordToggle
                  disabled={isLoading}
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
                <PasswordChecklist password={watch("password")} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    label="First Name"
                    autoComplete="given-name"
                    disabled={isLoading}
                    error={errors.firstName?.message}
                    {...register("firstName")}
                  />
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    label="Last Name"
                    autoComplete="family-name"
                    disabled={isLoading}
                    error={errors.lastName?.message}
                    {...register("lastName")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-foreground"
                  >
                    Date of Birth
                  </label>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <DatePicker
                        id="dateOfBirth"
                        date={field.value ? new Date(field.value) : undefined}
                        setDate={(date) => field.onChange(date?.toISOString())}
                        disabled={isLoading}
                        error={!!errors.dateOfBirth}
                      />
                    )}
                  />
                  {errors.dateOfBirth?.message && (
                    <p className="text-sm text-destructive">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4"
              >
                <Input
                  id="address"
                  placeholder="123 Main St"
                  label="Address"
                  autoComplete="street-address"
                  disabled={isLoading}
                  error={errors.address?.message}
                  {...register("address")}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="city"
                    placeholder="New York"
                    label="City"
                    autoComplete="address-level2"
                    disabled={isLoading}
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <Input
                    id="state"
                    placeholder="NY"
                    label="State"
                    autoComplete="address-level1"
                    maxLength={2}
                    disabled={isLoading}
                    error={errors.state?.message}
                    {...register("state")}
                  />
                </div>
                <Input
                  id="postalCode"
                  placeholder="10001"
                  label="Postal Code"
                  autoComplete="postal-code"
                  disabled={isLoading}
                  error={errors.postalCode?.message}
                  {...register("postalCode")}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4"
              >
                <Input
                  id="ssn"
                  placeholder="Last 4 digits"
                  label="SSN (Last 4 digits)"
                  autoComplete="off"
                  maxLength={4}
                  numericOnly
                  disabled={isLoading}
                  error={errors.ssn?.message}
                  {...register("ssn")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mb-4 rounded-lg bg-[var(--color-error-surface)] p-4 border border-[var(--color-error-border)] flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[var(--color-error-main)] mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-[var(--color-error-text)] leading-5">
                {error}
              </p>
            </div>
          )}

          <div className="flex justify-between gap-4 mt-2">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back
              </Button>
            ) : (
              <div className="flex-1" />
            )}

            {step < STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 bg-brand-main hover:bg-brand-hover text-white shadow-brand-main/20 shadow-lg hover:shadow-xl transition-all duration-200 justify-center"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                type="submit"
                className="flex-1 bg-brand-main hover:bg-brand-hover text-white shadow-brand-main/20 shadow-lg hover:shadow-xl transition-all duration-200 justify-center"
              >
                {isLoading && (
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Create Account
              </Button>
            )}
          </div>
        </div>
      </form>

      <div className="border-t border-border/40 my-2" />

      <AuthFooterLinks mode="sign-up" />

      <div className="flex justify-center text-center">
        <p className="hidden sm:block text-xs text-muted-foreground/80 leading-relaxed px-4">
          By signing in, you agree to our <br />
          <Link
            href="/terms"
            className="text-foreground hover:text-brand-main underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-foreground hover:text-brand-main underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
