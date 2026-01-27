"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui";
import { NotificationBell } from "./NotificationBell";
import { GlobalSearch } from "./GlobalSearch";

const pageInfo: Record<string, { title: string; description: string }> = {
  "/": { title: "Dashboard", description: "Overview of your finances" },
  "/banks": { title: "My Banks", description: "Manage connected accounts" },
  "/transactions": {
    title: "Transactions",
    description: "View transaction history",
  },
  "/transfers": { title: "Transfers", description: "Send and receive money" },
  "/settings": { title: "Settings", description: "Manage your preferences" },
};

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentPage = pageInfo[pathname] || {
    title: "Interlock",
    description: "",
  };

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
        <GlobalSearch className="w-full" />
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
        <div className="absolute inset-x-0 top-full bg-white border-b border-[var(--color-gray-soft)] p-4 md:hidden shadow-lg z-40">
          <GlobalSearch placeholder="Search..." isMobile />
        </div>
      )}
    </header>
  );
}
