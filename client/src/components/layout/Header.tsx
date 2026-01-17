"use client";

import { Menu, Search } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { Button, Input } from "@/components/ui";
import { NotificationBell } from "./NotificationBell";

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white shadow-sm px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="secondary"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search (desktop) */}
        <div className="hidden md:block w-80">
          <Input
            placeholder="Search transactions, banks..."
            startIcon={<Search className="h-4 w-4" />}
            className="h-10"
          />
        </div>

        {/* Search (mobile) */}
        <Button
          variant="secondary"
          size="icon"
          className="md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Notifications */}
        <NotificationBell />

        {/* User avatar */}
        {user && (
          <div className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-brand-main text-white text-sm font-medium shadow-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        )}
      </div>
    </header>
  );
}
