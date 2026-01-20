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
  description: string;
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
      description: "Connect a new account",
      onClick: () => setIsAddBankOpen(true),
      iconBgClass: "bg-brand-surface",
      iconColorClass: "text-brand-main",
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send Money",
      description: "Transfer to anyone",
      href: "/transfers?type=p2p",
      disabled: !hasBanks,
      iconBgClass: "bg-success-surface",
      iconColorClass: "text-success-main",
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5" />,
      label: "Transfer Funds",
      description: "Move between accounts",
      href: "/transfers",
      disabled: !hasBanks,
      iconBgClass: "bg-warning-surface",
      iconColorClass: "text-warning-main",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "My Banks",
      description: "View all accounts",
      href: "/banks",
      iconBgClass: "bg-gray-surface",
      iconColorClass: "text-gray-main",
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
        Quick Actions
      </h3>

      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:flex lg:flex-col">
        {actions.map((action) => {
          const content = (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border bg-card shadow-sm transition-all duration-200
                ${
                  action.disabled
                    ? "opacity-50 cursor-not-allowed border-border/50"
                    : "border-border/50 hover:border-border hover:bg-muted/50 hover:shadow-md cursor-pointer"
                }`}
            >
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${action.iconBgClass}`}
              >
                <span className={action.iconColorClass}>{action.icon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground">
                  {action.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </div>
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

          if (action.disabled) {
            return (
              <div key={action.label}>
                {content}
              </div>
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
    </div>
  );
}
