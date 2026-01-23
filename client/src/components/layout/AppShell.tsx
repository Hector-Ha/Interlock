"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileSidebar } from "./MobileSidebar";
import { RightSideBar } from "./RightSideBar";
import { ToastContainer } from "./ToastContainer";
import { Spinner, ScrollArea } from "@/components/ui";
import { SkipLink } from "@/components/a11y";
import { Shield } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isLoading, isInitialized, initialize } = useAuthStore();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[var(--color-gray-surface)] to-[var(--color-brand-surface)]/30">
        <div className="flex flex-col items-center gap-6">
          {/* Loading Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--color-brand-main)] rounded-2xl blur-xl opacity-20 animate-pulse" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-brand-main)] to-[var(--color-brand-hover)] shadow-xl shadow-[var(--color-brand-main)]/25">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-[var(--color-gray-main)]">
              Securing your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-gray-surface)]">
      {/* Skip Link for Keyboard Users */}
      <SkipLink />

      {/* Desktop Sidebar (left) - UNCHANGED */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar */}
      <MobileSidebar open={sidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <main
            id="main-content"
            className="min-h-full"
          >
            {children}
          </main>
        </ScrollArea>
      </div>

      {/* Right Sidebar - dashboard only (xl+) */}
      {isDashboard && <RightSideBar className="hidden xl:flex" />}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
