"use client";

import { useState, useRef, useEffect } from "react";
import { Lightbulb, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function DemoCredentialsHint() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const copyToClipboard = (text: string, isEmail: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEmail) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant={isOpen ? "secondary" : "outline"}
        size="sm"
        onClick={toggleOpen}
        title="Demo Verification Credentials"
        className={cn("gap-2 transition-all duration-200 h-8 text-xs")}
      >
        <span>Demo Access</span>
        <Lightbulb
          className={cn(
            "h-3 w-3",
            isOpen
              ? "text-brand-main fill-brand-main"
              : "text-muted-foreground",
          )}
        />
      </Button>

      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 z-50 w-80 shadow-xl border-border animate-in fade-in zoom-in-95 duration-200 slide-in-from-top-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Demo Access</CardTitle>
            <CardDescription className="text-xs">
              Use these credentials to test the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-2">
            <div className="grid gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted p-2 text-xs font-mono">
                  test@interlock.com
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard("test@interlock.com", true)}
                >
                  {copiedEmail ? (
                    <Check className="h-3.5 w-3.5 text-success-main" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted p-2 text-xs font-mono">
                  password123
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard("password123", false)}
                >
                  {copiedPassword ? (
                    <Check className="h-3.5 w-3.5 text-success-main" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
