"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Mail, CheckCircle2, Shield } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { apiCall } from "@/lib/api-handler";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.charAt(0).toUpperCase() || "";
  const l = lastName?.charAt(0).toUpperCase() || "";
  return f + l || "U";
}

export function ProfileSettings() {
  const { user, setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const { user: updatedUser } = await apiCall(
        authService.updateProfile(data),
        { successMessage: "Profile updated successfully" }
      );
      setUser(updatedUser);
    } catch {
      // Error handled by apiCall
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <Card
        padding="none"
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]"
      >
        {/* Security Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="profile-grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 16h32M16 0v32"
                  stroke="white"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#profile-grid)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-brand-main)] rounded-full blur-[100px] opacity-20" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[var(--color-success-main)] rounded-full blur-[120px] opacity-10" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarFallback className="bg-[var(--color-brand-main)] text-white text-2xl font-bold">
                {getInitials(user?.firstName, user?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-white/60" />
                <span className="text-white/60 text-sm truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--color-success-main)]/20">
                  <CheckCircle2 className="h-3 w-3 text-[var(--color-success-main)]" />
                  <span className="text-xs text-[var(--color-success-main)] font-medium">
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                  <Shield className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60 font-medium">Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form Card */}
      <Card padding="none" className="border-[var(--color-gray-soft)]">
        <div className="p-5 border-b border-[var(--color-gray-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-brand-surface)]">
              <User className="h-5 w-5 text-[var(--color-brand-main)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-gray-text)]">
                Personal Information
              </h3>
              <p className="text-sm text-[var(--color-gray-main)]">
                Update your account details
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First Name"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Last Name"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <Input
            label="Email Address"
            value={user?.email || ""}
            disabled
            hint="Email address cannot be changed for security reasons"
          />

          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-gray-soft)]">
            <p className="text-xs text-[var(--color-gray-main)]">
              {isDirty ? "You have unsaved changes" : "All changes saved"}
            </p>
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
