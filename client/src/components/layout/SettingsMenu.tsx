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
        className="w-56 overflow-auto rounded-xl bg-background p-1 shadow-lg ring-1 ring-border dark:ring-white/10 animate-in fade-in zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:zoom-out-95"
      >
        <Menu className="outline-none">
          <MenuItem
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 outline-none data-[focused]:bg-muted cursor-default"
            onAction={() => alert("Profile settings placeholder")}
          >
            <User className="h-4 w-4 text-muted-foreground group-data-[focused]:text-foreground" />
            <span className="text-sm font-medium text-foreground">
              Profile
            </span>
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <MenuItem
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 outline-none data-[focused]:bg-error-surface cursor-pointer"
            onAction={onSignOut}
          >
            <LogOut className="h-4 w-4 text-muted-foreground group-data-[focused]:text-error-main" />
            <span className="text-sm font-medium text-foreground group-data-[focused]:text-error-main">
              Sign out
            </span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
