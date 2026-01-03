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
import { SidebarProps } from "../../types";

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
        "sidebar sticky left-0 top-0 flex h-screen flex-col justify-between border-r border-gray-200 bg-white pt-8 max-md:hidden transition-all duration-300",
        sidebarCollapsed ? "w-[90px]" : "w-[264px]",
        className
      )}
    >
      <div className="flex w-full flex-col">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={InterlockLogo}
              alt="Interlock Logo"
              width={34}
              height={34}
              className="size-[24px] max-xl:size-14"
            />
            {!sidebarCollapsed && (
              <h1 className="sidebar-logo text-2xl font-bold text-[#7839EE] ml-2 font-sans">
                Interlock
              </h1>
            )}
          </Link>
        </div>

        <div className="flex justify-end pr-4 mt-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                sidebarCollapsed && "rotate-180"
              )}
            />
          </button>
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

      <div className="border-t border-slate-200 p-4">
        {user ? (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-2",
              !sidebarCollapsed && "mb-2"
            )}
          >
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold">
              {user.firstName[0]}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center p-2">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : null}

        <button
          onClick={handleSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
            "text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors",
            sidebarCollapsed && "justify-center"
          )}
          title={sidebarCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="size-5" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </section>
  );
};

export { Sidebar };
