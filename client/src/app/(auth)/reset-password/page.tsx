import { Suspense } from "react";
import { Shield, Lock } from "lucide-react";
import { ResetPasswordForm } from "@/components/forms";
import { AuthHeader } from "@/components/auth";
import { Skeleton } from "@/components/ui/Skeleton";

function ResetPasswordFormFallback() {
  return (
    <div className="grid gap-6">
      <div className="border-t border-border/40" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Reset Password"
        subtitle="Create a new secure password"
        trustItems={[
          { icon: Shield, label: "Bank-level security" },
          { icon: Lock, label: "256-bit encryption" },
        ]}
      />
      <div className="mt-6">
        <Suspense fallback={<ResetPasswordFormFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </>
  );
}
