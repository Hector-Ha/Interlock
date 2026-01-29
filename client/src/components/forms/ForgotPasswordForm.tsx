"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

type FormState = "idle" | "loading" | "success" | "error";

export function ForgotPasswordForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setFormState("loading");
    setError(null);

    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
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

  const handleResend = async () => {
    if (!submittedEmail) return;
    setFormState("loading");
    try {
      await authService.forgotPassword(submittedEmail);
      setFormState("success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to resend. Please try again.";
      setError(message);
      setFormState("error");
    }
  };

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
                <Mail className="w-7 h-7 text-success-main" />
              </motion.div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Check Your Email
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-foreground">{submittedEmail}</span>
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 bg-brand-surface/50 border border-brand-soft rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-brand-main mt-0.5 shrink-0" />
              <p className="text-xs text-brand-text leading-relaxed">
                The link will expire in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResend}
              className="w-full text-sm text-muted-foreground hover:text-brand-main transition-colors py-2"
            >
              Didn&apos;t receive the email?{" "}
              <span className="font-medium text-brand-main hover:text-brand-hover">
                Resend
              </span>
            </button>
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

  return (
    <div className="grid gap-6">
      <div className="border-t border-border/40" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            autoFocus
            disabled={formState === "loading"}
            label="Email Address"
            error={errors.email?.message}
            {...register("email")}
          />

          {(formState === "error" && error) && (
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
            Send Reset Link
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
