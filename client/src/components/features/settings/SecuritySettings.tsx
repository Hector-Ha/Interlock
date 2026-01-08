"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/stores/ui.store";
import { Button, Input, Card, Alert } from "@/components/ui";

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
  const toast = useToast();
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
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully. Please sign in again.");
      reset();
      // Sign out and redirect to sign-in
      await signOut();
      router.push("/sign-in");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      const result = await authService.logoutAll();
      toast.success(`Logged out of ${result.sessionsInvalidated} devices`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to logout all devices";
      toast.error(message);
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-surface">
            <Shield className="h-5 w-5 text-brand-text" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Change Password
            </h2>
            <p className="text-sm text-content-secondary">
              Update your password regularly for better security
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            showPasswordToggle
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <Input
            label="New Password"
            type="password"
            showPasswordToggle
            hint="At least 8 characters with uppercase, lowercase, and number"
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

          <div className="flex justify-end">
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Active Sessions */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-warning-surface">
            <LogOut className="h-5 w-5 text-warning-text" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Active Sessions
            </h2>
            <p className="text-sm text-content-secondary">
              Manage your active sessions across devices
            </p>
          </div>
        </div>

        <Alert variant="info" className="mb-4">
          Clicking the button below will sign you out of all devices and
          browsers where you&apos;re currently logged in.
        </Alert>

        <Button
          variant="outline"
          onClick={handleLogoutAll}
          disabled={isLoggingOutAll}
        >
          {isLoggingOutAll && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Sign Out of All Devices
        </Button>
      </Card>
    </div>
  );
}
