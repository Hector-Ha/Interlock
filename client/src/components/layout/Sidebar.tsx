"use client";

import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "../../constants/sidebarLinks";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/auth.store";
import { useUIStore } from "../../stores/ui.store";
import { ChevronLeft, LogOut, Loader2 } from "lucide-react";

import InterlockLogo from "../../assets/logos/Interlock.svg";
import { SettingsMenu } from "./SettingsMenu";
import { SidebarProps } from "../../types";
import { Button } from "../ui/Button";

const Sidebar = ({
  user: propUser,
  className,
}: SidebarProps & { className?: string }) => {
  const pathname = usePathname();
  const { user: storeUser, signOut, isLoading } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  const user = propUser || storeUser;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <section
      className={cn(
        "sidebar sticky left-0 top-0 flex h-screen flex-col justify-between border-r border-gray-200 bg-white pt-8 max-md:hidden transition-all duration-300 relative",
        sidebarCollapsed ? "w-[90px]" : "w-[264px]",
        className
      )}
    >
      <Button
        onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
        variant="secondary"
        size="icon"
        className="absolute left-full top-9 z-50 h-8 w-8 rounded-full border border-gray-200 bg-white shadow-md transition-all hover:bg-gray-100 p-0"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 text-slate-600 transition-transform",
            sidebarCollapsed && "rotate-180"
          )}
        />
      </Button>

      <div className="flex w-full flex-col flex-1 overflow-y-auto custom-scrollbar">
        <div
          className={cn(
            "flex h-14 items-center px-6",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={InterlockLogo}
              alt="Interlock Logo"
              width={34}
              height={34}
              className="size-[24px]"
            />
            {!sidebarCollapsed && (
              <h1 className="sidebar-logo text-2xl font-bold text-[#7839EE] ml-2 font-sans">
                Interlock
              </h1>
            )}
          </Link>
        </div>

        <nav className="flex flex-col gap-4 px-4 mt-6">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.route || pathname.startsWith(`${link.route}/`);
            const Icon = link.imgURL;

            return (
              <Link
                href={link.route}
                key={link.name}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-slate-100",
                  {
                    "bg-bank-gradient text-white hover:bg-bank-gradient":
                      isActive,
                    "text-slate-600": !isActive,
                    "justify-center": sidebarCollapsed,
                  }
                )}
              >
                <div className="relative size-6">
                  <Icon
                    className={cn("size-6", {
                      "text-white": isActive,
                      "text-slate-600": !isActive,
                    })}
                  />
                </div>

                {!sidebarCollapsed && (
                  <p
                    className={cn("text-16 font-semibold", {
                      "!text-white": isActive,
                    })}
                  >
                    {link.name}
                  </p>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4 mt-auto">
        {user ? (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-2 w-full",
              !sidebarCollapsed ? "justify-between" : "justify-center"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3 min-w-0",
                sidebarCollapsed && "hidden"
              )}
            >
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold">
                {user.firstName[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.firstName}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            {sidebarCollapsed && (
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold">
                {user.firstName[0]}
              </div>
            )}

            <SettingsMenu onSignOut={handleSignOut} />
          </div>
        ) : isLoading ? (
          <div className="flex justify-center p-2">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : null}
        {/* Sign Out logic handled by SettingsMenu */}
      </div>
    </section>
  );
};

export { Sidebar };
