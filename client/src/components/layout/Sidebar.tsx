// Imports
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ArrowLeftToLine,
  ArrowRightFromLine,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { useBankStore } from "@/stores/bank.store";
import { sidebarLinks } from "@/constants/sidebarLinks";
import { SidebarProps } from "@/types";
import InterlockLogo from "@/assets/logos/Interlock.svg";

import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SettingsMenu } from "./SettingsMenu";
import { SidebarItem } from "./SidebarItem";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ className }: SidebarProps & { className?: string }) => {
  const { user, signOut } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { banks } = useBankStore();

  return (
    <aside
      className={cn(
        "group/sidebar sticky left-0 top-0 z-40 flex h-screen shrink-0 flex-col border-r border-border/50 bg-card transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-[88px]" : "w-[280px]",
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-[64px] items-center border-b border-border/50 transition-all duration-300",
          sidebarCollapsed ? "justify-center px-0" : "px-6",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-muted/50"
        >
          <Image
            src={InterlockLogo}
            alt="Interlock"
            width={32}
            height={32}
            className="size-8"
          />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.h1
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: "auto", scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="font-google-sans text-xl font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden origin-left"
              >
                Interlock
              </motion.h1>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          {/* Section Label & Toggle */}
          <div
            className={cn(
              "flex items-center mb-2 px-3",
              sidebarCollapsed ? "justify-center" : "justify-between",
            )}
          >
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Menu
                </motion.p>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "h-8 w-8 p-1 text-[var(--color-brand-main)] hover:text-[var(--color-brand-main)] hover:bg-[var(--color-brand-surface)] transition-colors",
                sidebarCollapsed ? "mx-auto" : "ml-auto",
              )}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <ArrowRightFromLine className="h-4 w-4" />
              ) : (
                <ArrowLeftToLine className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => (
              <SidebarItem
                key={link.name}
                link={link}
                sidebarCollapsed={sidebarCollapsed}
              />
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* Footer / User Profile */}
      <div className="border-t border-border/50 p-3">
        {user ? (
          <div
            className={cn(
              "flex items-center rounded-xl p-2 transition-all duration-200",
              !sidebarCollapsed
                ? "justify-between gap-3 bg-muted/50 hover:bg-muted"
                : "justify-center",
            )}
          >
            {/* Avatar & Text Container */}
            <div
              className={cn(
                "flex items-center gap-3 overflow-hidden",
                sidebarCollapsed ? "w-auto" : "flex-1",
              )}
            >
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-main to-brand-hover text-white font-semibold shadow-sm">
                {user.firstName?.[0] || "U"}
              </div>

              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex flex-col overflow-hidden origin-left"
                  >
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.firstName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout Button */}
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="h-8 w-8 text-muted-foreground hover:text-[var(--color-error-main)] hover:bg-[var(--color-error-surface)]"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          // Loading skeleton or fallback
          <div className="flex h-14 w-full items-center justify-center rounded-xl bg-muted/50">
            <div className="size-6 animate-pulse rounded-full bg-muted" />
          </div>
        )}
      </div>
    </aside>
  );
};

export { Sidebar };
