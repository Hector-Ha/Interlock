"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Send, ArrowLeftRight, Building2 } from "lucide-react";
import { AddBankModal } from "@/components/features/banks/AddBankModal";

interface QuickActionsProps {
  hasBanks: boolean;
}

interface QuickActionItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  iconBgClass: string;
  iconColorClass: string;
}

export function QuickActions({ hasBanks }: QuickActionsProps) {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);

  const actions: QuickActionItem[] = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Add Bank",
      onClick: () => setIsAddBankOpen(true),
      iconBgClass: "bg-brand-surface",
      iconColorClass: "text-brand-main",
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send Money",
      href: "/transfers?type=p2p",
      disabled: !hasBanks,
      iconBgClass: "bg-success-surface",
      iconColorClass: "text-success-main",
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5" />,
      label: "Transfer Funds",
      href: "/transfers",
      disabled: !hasBanks,
      iconBgClass: "bg-warning-surface",
      iconColorClass: "text-warning-main",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "My Banks",
      href: "/banks",
      iconBgClass: "bg-gray-surface",
      iconColorClass: "text-gray-main",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const content = (
            <div
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-soft bg-card 
                hover:bg-gray-surface hover:border-gray-disabled transition-colors cursor-pointer
                ${action.disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${action.iconBgClass}`}
              >
                <span className={action.iconColorClass}>{action.icon}</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground text-center">
                {action.label}
              </span>
            </div>
          );

          if (action.onClick) {
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="text-left"
                type="button"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={action.label} href={action.href || "#"}>
              {content}
            </Link>
          );
        })}
      </div>

      <AddBankModal open={isAddBankOpen} onOpenChange={setIsAddBankOpen} />
    </>
  );
}
