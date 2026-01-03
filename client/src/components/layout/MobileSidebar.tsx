"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import InterlockLogo from "@/assets/logos/Interlock.svg";
import { sidebarLinks } from "@/constants/sidebarLinks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

interface MobileSidebarProps {
  open: boolean;
}

export function MobileSidebar({ open }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const handleSignOut = async () => {
    await signOut();
    setSidebarOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setSidebarOpen}>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] p-0 bg-white border-r border-gray-200"
      >
        <SheetHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0 text-left">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <Image src={InterlockLogo} alt="Interlock" width={32} height={32} />
            <span className="font-google-sans text-xl font-bold text-gray-900">
              Interlock
            </span>
          </Link>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => {
                const isActive =
                  pathname === link.route ||
                  (link.route !== "/" && pathname.startsWith(link.route));
                const Icon = link.imgURL;

                return (
                  <li key={link.name}>
                    <Link
                      href={link.route}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-brand-600" : "text-gray-500"
                        )}
                      />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4 pb-8 space-y-4">
            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold border border-brand-200">
                  {user.firstName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
