"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/Button";
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
    <Link
      href={link.route}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size: "lg",
        }),
        "relative flex items-center justify-start gap-4 rounded-md px-4 py-3 transition-all duration-200 group w-full border border-transparent",
        !isActive &&
          "text-gray-600 hover:bg-brand-surface hover:text-brand-main hover:border-brand-main", // Hover = Secondary Style
        isActive && "border-transparent", // Active = Default Style
        sidebarCollapsed && "justify-center px-2",
      )}
      title={sidebarCollapsed ? link.name : undefined}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-6 flex-shrink-0 transition-colors",
          isActive ? "text-white" : "text-gray-500 group-hover:text-brand-main",
        )}
      />
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0, scale: 0.8 }}
            animate={{ opacity: 1, width: "auto", scale: 1 }}
            exit={{ opacity: 0, width: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="whitespace-nowrap font-medium overflow-hidden origin-left"
          >
            {link.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};
