"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { GuestGuard, DemoCredentialsHint } from "@/components/auth";
import InterlockLogo from "@/assets/logos/Interlock.svg";
import { Shield, Lock, Eye, CheckCircle2 } from "lucide-react";

const trustFeatures = [
  { icon: Lock, text: "Bank-level encryption" },
  { icon: Eye, text: "Read-only access by default" },
  { icon: Shield, text: "Real-time fraud monitoring" },
  { icon: CheckCircle2, text: "SOC 2 compliant" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  return (
    <GuestGuard>
      <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#7839EE] to-[#5B21B6] p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            <Link
              href="/"
              className="flex items-center gap-3 w-fit hover:opacity-90 transition-opacity"
            >
              <Image
                src={InterlockLogo}
                alt="Interlock"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <span className="text-2xl font-bold text-white font-google-sans">
                Interlock
              </span>
            </Link>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white font-google-sans leading-tight">
                The Future of
                <br />
                Secure Open Banking
              </h1>
              <p className="text-lg text-white/80 leading-relaxed max-w-md">
                Connect your accounts, transfer money seamlessly, and take
                control of your finances with enterprise-grade security.
              </p>
            </div>

            {/* Trust features */}
            <div className="space-y-3 pt-4">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-white/90" />
                  <span className="text-sm font-medium text-white/90">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/60 relative z-10">
            © {new Date().getFullYear()} Interlock. All rights reserved.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 relative flex flex-col bg-muted/20 overflow-hidden">
          {/* Top Bar for Demo Button - Fixed position */}
          {isSignIn && (
            <div className="absolute top-4 right-4 z-50">
              <DemoCredentialsHint />
            </div>
          )}

          <ScrollArea className="flex-1 h-full w-full">
            <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
              <div
                className={`w-full ${isSignIn ? "max-w-[448px]" : "max-w-md"}`}
              >
                {/* Mobile Logo */}
                <div className="lg:hidden flex flex-col items-center mb-6">
                  <Link href="/" className="flex items-center gap-2 mb-2">
                    <Image
                      src={InterlockLogo}
                      alt="Interlock"
                      width={32}
                      height={32}
                    />
                    <span className="text-xl font-bold text-[#7839EE] font-google-sans">
                      Interlock
                    </span>
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Bank-level security</span>
                  </div>
                </div>

                {/* Card container */}
                <div className="bg-card border border-border/40 shadow-xl shadow-brand-main/5 rounded-2xl p-6 sm:p-8 relative">
                  {children}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </GuestGuard>
  );
}
