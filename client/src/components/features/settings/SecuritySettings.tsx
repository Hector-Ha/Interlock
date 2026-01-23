"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Shield,
  LogOut,
  Key,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/stores/toast.store";
import { apiCall } from "@/lib/api-handler";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecuritySettings() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await apiCall(
        authService.changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        {
          successMessage: "Password changed successfully. Please sign in again.",
        }
      );
      reset();
      await signOut();
      router.push("/sign-in");
    } catch {
      // Error handled by apiCall
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      const result = await apiCall(authService.logoutAll());
      toast.success(`Logged out of ${result.sessionsInvalidated} devices`);
    } catch {
      // Error handled by apiCall
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview Card */}
      <Card
        padding="none"
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-success-text)] via-[#0d3d30] to-[var(--color-gray-text)]"
      >
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="security-shield"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#security-shield)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-success-main)] rounded-full blur-[100px] opacity-30" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm">
              <Shield className="h-7 w-7 text-[var(--color-success-main)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Account Security</h2>
              <p className="text-white/60 text-sm mt-0.5">
                Your account is protected with bank-grade security
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-success-main)]/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success-main)]" />
                  <span className="text-xs text-[var(--color-success-main)] font-medium">
                    Password Protected
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10">
                  <Lock className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs text-white/70 font-medium">
                    256-bit Encryption
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card padding="none" className="border-[var(--color-gray-soft)]">
        <div className="p-5 border-b border-[var(--color-gray-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-brand-surface)]">
              <Key className="h-5 w-5 text-[var(--color-brand-main)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-gray-text)]">
                Change Password
              </h3>
              <p className="text-sm text-[var(--color-gray-main)]">
                Update your password regularly for enhanced security
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitPassword)} className="p-5 space-y-4">
          <Input
            label="Current Password"
            type="password"
            showPasswordToggle
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="New Password"
              type="password"
              showPasswordToggle
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <Input
              label="Confirm New Password"
              type="password"
              showPasswordToggle
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <div className="p-3 rounded-lg bg-[var(--color-gray-surface)] border border-[var(--color-gray-soft)]">
            <p className="text-xs text-[var(--color-gray-main)] font-medium mb-2">
              Password requirements:
            </p>
            <ul className="grid grid-cols-2 gap-1 text-xs text-[var(--color-gray-main)]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[var(--color-success-main)]" />
                At least 8 characters
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[var(--color-success-main)]" />
                One uppercase letter
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[var(--color-success-main)]" />
                One lowercase letter
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[var(--color-success-main)]" />
                One number
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white"
            >
              {isChangingPassword && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Active Sessions Card */}
      <Card padding="none" className="border-[var(--color-gray-soft)]">
        <div className="p-5 border-b border-[var(--color-gray-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-warning-surface)]">
              <Smartphone className="h-5 w-5 text-[var(--color-warning-main)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-gray-text)]">
                Active Sessions
              </h3>
              <p className="text-sm text-[var(--color-gray-main)]">
                Manage your active sessions across devices
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <Alert variant="warning" className="border-[var(--color-warning-soft)]">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Clicking the button below will sign you out of all devices and
              browsers where you&apos;re currently logged in. You&apos;ll need to
              sign in again on each device.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-gray-surface)] border border-[var(--color-gray-soft)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-error-surface)]">
                <LogOut className="h-5 w-5 text-[var(--color-error-main)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--color-gray-text)]">
                  Sign Out Everywhere
                </p>
                <p className="text-xs text-[var(--color-gray-main)]">
                  Ends all active sessions on other devices
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogoutAll}
              disabled={isLoggingOutAll}
              className="border-[var(--color-error-soft)] text-[var(--color-error-main)] hover:bg-[var(--color-error-surface)]"
            >
              {isLoggingOutAll && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Sign Out All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
