"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Spinner } from "@/components/ui";

interface GuestGuardProps {
  children: ReactNode;
}

// Redirects to dashboard if already authenticated.
export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized, initialize } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  // Show loading state while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
