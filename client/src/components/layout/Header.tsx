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
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search (desktop) */}
        <div className="hidden md:block max-w-md w-80">
          <Input
            placeholder="Search…"
            startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            className="h-10 bg-muted/50 rounded-lg border-transparent focus:border-border"
          />
        </div>

        {/* Search (mobile) */}
        <Button
          variant="ghost"
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
          <div className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        )}
      </div>
    </header>
  );
}
