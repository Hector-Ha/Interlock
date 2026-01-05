"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signUpSchema, type SignUpSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: 1, name: "Account", fields: ["email", "password", "confirmPassword"] },
  { id: 2, name: "Personal", fields: ["firstName", "lastName", "dateOfBirth"] },
  {
    id: 3,
    name: "Address",
    fields: ["address", "city", "state", "postalCode"],
  },
  { id: 4, name: "Identity", fields: ["ssn"] },
];

export function SignUpForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setError: setFormError,
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-4">
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                step >= s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.id ? <Check className="w-4 h-4" /> : s.id}
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid gap-4"
              >
                <div className="space-y-4">
                  <Input
                    id="email"
                    placeholder="name@example.com"
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
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    placeholder="John"
                    label="First Name"
                    disabled={isLoading}
                    error={errors.firstName?.message}
                    {...register("firstName")}
                  />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    label="Last Name"
                    disabled={isLoading}
                    error={errors.lastName?.message}
                    {...register("lastName")}
                  />
                </div>
                <Input
                  id="dateOfBirth"
                  type="date"
                  label="Date of Birth"
                  disabled={isLoading}
                  error={errors.dateOfBirth?.message}
                  {...register("dateOfBirth")}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid gap-4"
              >
                <Input
                  id="address"
                  placeholder="123 Main St"
                  label="Address"
                  disabled={isLoading}
                  error={errors.address?.message}
                  {...register("address")}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="city"
                    placeholder="New York"
                    label="City"
                    disabled={isLoading}
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <Input
                    id="state"
                    placeholder="NY"
                    label="State"
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
                  disabled={isLoading}
                  error={errors.postalCode?.message}
                  {...register("postalCode")}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid gap-4"
              >
                <Input
                  id="ssn"
                  placeholder="Last 4 digits"
                  label="SSN (Last 4 digits)"
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
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between gap-4 mt-4">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div className="w-full" /> /* Spacer */
            )}

            {step < STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="w-full"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
