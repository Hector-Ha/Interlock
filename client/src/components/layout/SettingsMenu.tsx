"use client";

import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import { Button } from "@/components/ui/Button";
import { Settings, LogOut, User } from "lucide-react";
import { cn } from "../../lib/utils";

interface SettingsMenuProps {
  onSignOut: () => void;
  className?: string;
}

export function SettingsMenu({ onSignOut, className }: SettingsMenuProps) {
  return (
    <MenuTrigger>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Settings"
        className={cn("text-muted-foreground hover:text-foreground", className)}
      >
        <Settings className="h-5 w-5" />
      </Button>
      <Popover
        placement="top start"
        offset={8}
        className="w-56 overflow-hidden rounded-xl bg-card p-1.5 shadow-xl border border-border animate-in fade-in zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:zoom-out-95"
      >
        <Menu className="outline-none">
          <MenuItem
            className="group flex w-full items-center gap-2.5 rounded-lg py-2 px-3 outline-none data-[focused]:bg-muted/50 cursor-default transition-colors"
            onAction={() => alert("Profile settings placeholder")}
          >
            <User className="h-4 w-4 text-muted-foreground group-data-[focused]:text-foreground transition-colors" />
            <span className="text-sm font-medium text-foreground">
              Profile
            </span>
          </MenuItem>
          <div className="my-1.5 h-px bg-border" />
          <MenuItem
            className="group flex w-full items-center gap-2.5 rounded-lg py-2 px-3 outline-none data-[focused]:bg-error-surface cursor-pointer transition-colors"
            onAction={onSignOut}
          >
            <LogOut className="h-4 w-4 text-muted-foreground group-data-[focused]:text-error-main transition-colors" />
            <span className="text-sm font-medium text-foreground group-data-[focused]:text-error-main transition-colors">
              Sign out
            </span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
