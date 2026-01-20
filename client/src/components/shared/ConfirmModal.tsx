"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/ui";
import { Loader2 } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "default" | "danger";
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "default",
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border shadow-xl">
        <DialogHeader>
          <DialogTitle
            className={
              variant === "danger" ? "text-error-main" : "text-foreground"
            }
          >
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-border hover:bg-muted/50"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={
              variant === "danger"
                ? "bg-error-main hover:bg-error-hover text-white"
                : ""
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
