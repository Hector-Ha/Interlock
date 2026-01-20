"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  link: {
    name: string;
    route: string;
    imgURL: LucideIcon;
  };
  sidebarCollapsed: boolean;
}

export const SidebarItem = ({ link, sidebarCollapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === link.route || pathname.startsWith(`${link.route}/`);
  const Icon = link.imgURL;

  return (
    <div className="relative group/item">
      <Link
        href={link.route}
        className={cn(
          buttonVariants({
            variant: isActive ? "default" : "ghost",
            size: "lg",
          }),
          "relative flex items-center justify-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 w-full border border-transparent",
          !isActive &&
            "text-muted-foreground hover:bg-brand-surface hover:text-brand-main hover:border-brand-main/20",
          isActive && "border-transparent shadow-sm",
          sidebarCollapsed && "justify-center px-2",
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            "size-5 flex-shrink-0 transition-colors",
            isActive
              ? "text-white"
              : "text-muted-foreground group-hover/item:text-brand-main",
          )}
        />
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0, scale: 0.8 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="whitespace-nowrap font-medium overflow-hidden origin-left text-sm"
            >
              {link.name}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Tooltip for collapsed state */}
      {sidebarCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-md opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-150 whitespace-nowrap z-50 shadow-lg pointer-events-none">
          {link.name}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
        </div>
      )}
    </div>
  );
};
