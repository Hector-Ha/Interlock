"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { sidebarLinks } from "@/constants/sidebarLinks";
import { SidebarProps } from "@/types";
import InterlockLogo from "@/assets/logos/Interlock.svg";

import { Button, buttonVariants } from "@/components/ui/Button";
import { SettingsMenu } from "./SettingsMenu";
import { SidebarItem } from "./SidebarItem";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ className }: SidebarProps & { className?: string }) => {
  const { user } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        "group/sidebar sticky left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out shadow-sm", // Reduced shadow to match Header
        sidebarCollapsed ? "w-[88px]" : "w-[280px]",
        className
      )}
    >
      {/* Floating Toggle Button*/}
      <div className={cn("absolute -right-8 top-[92px] z-50")}>
        <Button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8 rounded-md p-0 shadow-lg"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 text-white transition-transform duration-300",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Header */}
      <div
        className={cn(
          "flex h-[64px] items-center border-b border-gray-200 transition-all duration-300",
          sidebarCollapsed ? "justify-center px-0" : "px-6"
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={InterlockLogo}
            alt="Interlock"
            width={28}
            height={28}
            className="size-7"
          />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.h1
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: "auto", scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="font-google-sans text-lg font-bold text-gray-900 whitespace-nowrap overflow-hidden origin-left"
              >
                Interlock
              </motion.h1>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => (
            <SidebarItem
              key={link.name}
              link={link}
              sidebarCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="border-t border-gray-100 p-4">
        {user ? (
          <div
            className={cn(
              "flex items-center rounded-xl p-2 transition-all duration-300",
              !sidebarCollapsed
                ? "justify-between gap-3 bg-gray-50/50 hover:bg-gray-50"
                : "justify-center"
            )}
          >
            {/* Avatar & Text Container */}
            <div
              className={cn(
                "flex items-center gap-3 overflow-hidden",
                sidebarCollapsed ? "w-auto" : "flex-1"
              )}
            >
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold shadow-sm border border-brand-200">
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
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.firstName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Trigger */}
            <div className={cn("flex-shrink-0", sidebarCollapsed && "hidden")}>
              <SettingsMenu
                onSignOut={() => {}}
                className="hover:bg-gray-200/50"
              />
            </div>
          </div>
        ) : (
          // Loading skeleton or fallback
          <div className="flex h-14 w-full items-center justify-center rounded-xl bg-gray-50">
            <div className="size-6 animate-pulse rounded-full bg-gray-200" />
          </div>
        )}
      </div>
    </aside>
  );
};

export { Sidebar };
