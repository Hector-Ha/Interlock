"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, X, Shield } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { Button, Input } from "@/components/ui";
import { NotificationBell } from "./NotificationBell";
import { cn } from "@/lib/utils";

const pageInfo: Record<string, { title: string; description: string }> = {
  "/": { title: "Dashboard", description: "Overview of your finances" },
  "/banks": { title: "My Banks", description: "Manage connected accounts" },
  "/transactions": { title: "Transactions", description: "View transaction history" },
  "/transfers": { title: "Transfers", description: "Send and receive money" },
  "/settings": { title: "Settings", description: "Manage your preferences" },
};

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentPage = pageInfo[pathname] || { title: "Interlock", description: "" };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-gray-soft)] bg-white/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-[var(--color-gray-surface)]"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-[var(--color-gray-main)]" />
        </Button>

        {/* Page Title - Desktop */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-[var(--color-gray-text)]">
            {currentPage.title}
          </h1>
        </div>
      </div>

      {/* Center - Search (Desktop) */}
      <div className="hidden md:flex flex-1 justify-center max-w-xl mx-8">
        <div className="relative w-full">
          <Input
            placeholder="Search transactions, banks..."
            startIcon={<Search className="h-4 w-4 text-[var(--color-gray-disabled)]" />}
            className="h-10 w-full bg-[var(--color-gray-surface)] rounded-xl border-transparent 
              focus:border-[var(--color-brand-disabled)] focus:bg-white focus:shadow-sm
              placeholder:text-[var(--color-gray-disabled)]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-[var(--color-gray-disabled)] bg-white px-1.5 font-mono text-[10px] font-medium text-[var(--color-gray-main)]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-[var(--color-gray-surface)]"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Search"
        >
          {isSearchOpen ? (
            <X className="h-5 w-5 text-[var(--color-gray-main)]" />
          ) : (
            <Search className="h-5 w-5 text-[var(--color-gray-main)]" />
          )}
        </Button>

        {/* Security Indicator - Desktop only */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-success-surface)] border border-[var(--color-success-soft)]">
          <Shield className="w-3.5 h-3.5 text-[var(--color-success-main)]" />
          <span className="text-xs font-medium text-[var(--color-success-main)]">Secured</span>
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User avatar - Mobile */}
        {user && (
          <div className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-main)] to-[var(--color-brand-hover)] text-white text-sm font-semibold shadow-sm">
            {user.firstName[0]}
          </div>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full bg-white border-b border-[var(--color-gray-soft)] p-4 md:hidden shadow-lg">
          <Input
            placeholder="Search..."
            startIcon={<Search className="h-4 w-4 text-[var(--color-gray-disabled)]" />}
            className="h-10 w-full bg-[var(--color-gray-surface)] rounded-xl border-transparent"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
