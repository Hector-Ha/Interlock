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

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Skip Link for Keyboard Users */}
      <SkipLink />

      {/* Desktop Sidebar (left) */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar */}
      <MobileSidebar open={sidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        <ScrollArea className="flex-1">
          <main id="main-content" className="h-full p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
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
