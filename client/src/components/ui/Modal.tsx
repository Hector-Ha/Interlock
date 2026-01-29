"use client";

import { type ReactNode, createContext, useContext } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ModalContext = createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface ModalContentProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <ModalContext.Provider value={{ open, onOpenChange }}>
        {children}
      </ModalContext.Provider>
    </Dialog.Root>
  );
}

function ModalTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Trigger asChild className={className}>
      {children}
    </Dialog.Trigger>
  );
}

function ModalContent({
  children,
  className,
  size = "md",
  showClose = true,
}: ModalContentProps) {
  const { open } = useContext(ModalContext);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[90vw]",
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
          </Dialog.Overlay>
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className={cn(
                  "pointer-events-auto w-full p-6 bg-background rounded-2xl shadow-xl overscroll-contain",
                  sizeClasses[size],
                  className,
                )}
              >
                {children}
                {showClose && (
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                )}
              </motion.div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      )}
    </AnimatePresence>
  );
}

function ModalHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

function ModalTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Title
      className={cn("text-lg font-semibold text-foreground", className)}
    >
      {children}
    </Dialog.Title>
  );
}

function ModalDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Description
      className={cn("text-sm text-muted-foreground mt-1", className)}
    >
      {children}
    </Dialog.Description>
  );
}

function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
};
