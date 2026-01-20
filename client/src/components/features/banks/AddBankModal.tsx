"use client";

import { usePlaidLink } from "@/hooks/usePlaidLink";
import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Plus, Loader2 } from "lucide-react";

interface AddBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBankModal({ open, onOpenChange }: AddBankModalProps) {
  const {
    open: openPlaid,
    ready,
    isLoading,
  } = usePlaidLink({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Bank Account</DialogTitle>
          <DialogDescription>
            Securely link your bank account to start managing your finances.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={() => openPlaid()}
            disabled={!ready || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Connect Bank
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secured by Plaid. We don't store your bank credentials.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
