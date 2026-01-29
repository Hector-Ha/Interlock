"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";

const DISMISS_KEY = "email_verification_banner_dismissed";
const COOLDOWN_KEY = "email_verification_cooldown";
const COOLDOWN_DURATION = 60; // seconds

interface EmailVerificationBannerProps {
  userEmail: string;
  onVerified?: () => void;
}

export function EmailVerificationBanner({
  userEmail,
  onVerified,
}: EmailVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden, check storage
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Check dismiss state and cooldown on mount
  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    setIsDismissed(dismissed === "true");

    // Check existing cooldown
    const cooldownEnd = localStorage.getItem(COOLDOWN_KEY);
    if (cooldownEnd) {
      const remaining = Math.ceil((parseInt(cooldownEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldownRemaining(remaining);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "true");
  }, []);

  const handleResend = useCallback(async () => {
    if (cooldownRemaining > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await authService.sendVerification();
      setResendSuccess(true);

      // Start cooldown
      const cooldownEnd = Date.now() + COOLDOWN_DURATION * 1000;
      localStorage.setItem(COOLDOWN_KEY, cooldownEnd.toString());
      setCooldownRemaining(COOLDOWN_DURATION);

      // Reset success state after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send verification email";
      setError(message);
    } finally {
      setIsResending(false);
    }
  }, [cooldownRemaining, isResending]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="bg-warning-surface border-b border-warning-soft px-4 py-3">
          <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
            {/* Content */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-warning-soft rounded-full">
                <Mail className="w-4 h-4 text-warning-main" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-warning-text truncate">
                  Verify your email address
                </p>
                <p className="text-xs text-warning-text/70 truncate">
                  We sent a verification link to{" "}
                  <span className="font-medium">{userEmail}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {error && (
                <span className="text-xs text-error-main hidden sm:inline">
                  {error}
                </span>
              )}

              {resendSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 text-success-main"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">
                    Sent!
                  </span>
                </motion.div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isResending || cooldownRemaining > 0}
                  className="text-warning-text hover:bg-warning-soft hover:text-warning-hover h-8 px-3"
                >
                  {isResending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : cooldownRemaining > 0 ? (
                    <span className="text-xs">
                      Resend in {cooldownRemaining}s
                    </span>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      <span className="hidden sm:inline">Resend</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="text-warning-text hover:bg-warning-soft hover:text-warning-hover h-8 w-8"
                aria-label="Dismiss verification banner"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
