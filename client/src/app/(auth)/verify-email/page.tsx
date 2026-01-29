"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { AuthHeader } from "@/components/auth";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";

type VerificationState = "loading" | "success" | "error" | "expired";

interface VerificationResult {
  state: VerificationState;
  message?: string;
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [result, setResult] = useState<VerificationResult>({
    state: "loading",
  });
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const verifyToken = useCallback(async () => {
    if (!token) {
      setResult({
        state: "error",
        message:
          "No verification token provided. Please check your email link.",
      });
      return;
    }

    try {
      await authService.verifyEmail(token);
      setResult({ state: "success" });

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification failed";

      // Check if token is expired
      if (message.toLowerCase().includes("expired")) {
        setResult({ state: "expired", message });
      } else {
        setResult({ state: "error", message });
      }
    }
  }, [token, router]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);

    try {
      await authService.sendVerification();
      setResendSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend verification email";
      setResult({ state: "error", message });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <AuthHeader
        title={
          result.state === "loading"
            ? "Verifying Email"
            : result.state === "success"
              ? "Email Verified!"
              : "Verification Failed"
        }
        subtitle={
          result.state === "loading"
            ? "Please wait while we verify your email address"
            : result.state === "success"
              ? "Your email has been successfully verified"
              : "We couldn't verify your email address"
        }
        trustItems={[
          { icon: Shield, label: "Secure verification" },
          { icon: Mail, label: "One-time link" },
        ]}
      />

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {result.state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6 py-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-main/20 rounded-full blur-xl animate-pulse" />
                <div className="relative flex items-center justify-center w-20 h-20 bg-brand-surface border-2 border-brand-soft rounded-full">
                  <Loader2 className="w-10 h-10 text-brand-main animate-spin" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                This should only take a moment...
              </p>
            </motion.div>
          )}

          {/* Success State */}
          {result.state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 py-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-success-main/20 rounded-full blur-xl" />
                <div className="relative flex items-center justify-center w-20 h-20 bg-success-surface border-2 border-success-soft rounded-full">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-success-main" />
                  </motion.div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-2 text-success-main"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Verification Complete
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground"
                >
                  Redirecting you to your dashboard...
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full pt-2"
              >
                <Button asChild className="w-full group">
                  <Link href="/">
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Error/Expired State */}
          {(result.state === "error" || result.state === "expired") && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6 py-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-error-main/20 rounded-full blur-xl" />
                <div className="relative flex items-center justify-center w-20 h-20 bg-error-surface border-2 border-error-soft rounded-full">
                  <XCircle className="w-10 h-10 text-error-main" />
                </div>
              </div>

              <div className="text-center space-y-3 max-w-sm">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.message ||
                    "This verification link is invalid or has expired. Please request a new one."}
                </p>

                {resendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 p-3 bg-success-surface border border-success-soft rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success-main" />
                    <span className="text-sm font-medium text-success-text">
                      Verification email sent! Check your inbox.
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="w-full space-y-3 pt-2">
                <Button
                  onClick={handleResend}
                  disabled={isResending || resendSuccess}
                  className="w-full"
                  variant={resendSuccess ? "outline" : "default"}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Email Sent
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request New Link
                    </>
                  )}
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/sign-in">Back to Sign In</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function VerifyEmailFallback() {
  return (
    <>
      <AuthHeader
        title="Verifying Email"
        subtitle="Please wait while we verify your email address"
        trustItems={[
          { icon: Shield, label: "Secure verification" },
          { icon: Mail, label: "One-time link" },
        ]}
      />
      <div className="mt-8 flex flex-col items-center gap-6 py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-main/20 rounded-full blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center w-20 h-20 bg-brand-surface border-2 border-brand-soft rounded-full">
            <Loader2 className="w-10 h-10 text-brand-main animate-spin" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          This should only take a moment...
        </p>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
