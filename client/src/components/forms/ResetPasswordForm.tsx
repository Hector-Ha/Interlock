"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { PasswordChecklist } from "@/components/forms/PasswordChecklist";
import { motion } from "framer-motion";

type FormState = "idle" | "loading" | "success" | "error" | "invalid-token";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setFormState("invalid-token");
    }
  }, [token]);

  useEffect(() => {
    if (formState === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (formState === "success" && countdown === 0) {
      router.push("/sign-in");
    }
  }, [formState, countdown, router]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (!token) {
      setFormState("invalid-token");
      return;
    }

    setFormState("loading");
    setError(null);

    try {
      await authService.resetPassword({
        token,
        newPassword: data.password,
      });
      setFormState("success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setFormState("error");
    }
  };

  if (formState === "invalid-token") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-warning-main/20 rounded-full blur-xl" />
            <div className="relative flex items-center justify-center w-16 h-16 bg-warning-surface border-2 border-warning-main/30 rounded-full">
              <AlertTriangle className="w-7 h-7 text-warning-main" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Invalid or Expired Link
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>

          <div className="w-full pt-2">
            <Link href="/forgot-password">
              <Button className="w-full font-medium bg-brand-main hover:bg-brand-hover text-white shadow-brand-main/20 shadow-lg hover:shadow-xl transition-all duration-200">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-border/40 pt-4">
          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    );
  }

  if (formState === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-success-main/20 rounded-full blur-xl" />
            <div className="relative flex items-center justify-center w-16 h-16 bg-success-surface border-2 border-success-main/30 rounded-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <ShieldCheck className="w-7 h-7 text-success-main" />
              </motion.div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Password Reset Complete
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 bg-success-surface/50 border border-success-soft rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-success-main mt-0.5 shrink-0" />
              <p className="text-xs text-success-text leading-relaxed">
                For your security, all other sessions have been signed out.
              </p>
            </div>

            <Link href="/sign-in">
              <Button className="w-full font-medium bg-brand-main hover:bg-brand-hover text-white shadow-brand-main/20 shadow-lg hover:shadow-xl transition-all duration-200">
                Sign In Now
              </Button>
            </Link>

            <p className="text-xs text-center text-muted-foreground">
              Redirecting in {countdown} seconds...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="border-t border-border/40" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Create a new secure password for your account.
            </p>
          </div>

          <Input
            id="password"
            placeholder="Enter new password"
            type="password"
            autoComplete="new-password"
            autoFocus
            disabled={formState === "loading"}
            label="New Password"
            showPasswordToggle
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            id="confirmPassword"
            placeholder="Confirm new password"
            type="password"
            autoComplete="new-password"
            disabled={formState === "loading"}
            label="Confirm Password"
            showPasswordToggle
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <PasswordChecklist password={watch("password")} />

          {formState === "error" && error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-[var(--color-error-surface)] p-4 border border-[var(--color-error-border)] flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-[var(--color-error-main)] mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-[var(--color-error-text)] leading-5">
                {error}
              </p>
            </motion.div>
          )}

          <Button
            disabled={formState === "loading"}
            type="submit"
            className="w-full mt-2 font-medium bg-brand-main hover:bg-brand-hover text-white shadow-brand-main/20 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {formState === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reset Password
          </Button>
        </div>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
