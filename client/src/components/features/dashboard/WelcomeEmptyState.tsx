// Imports
import Image from "next/image"; // Add this
import { Building2, Shield, Zap, Lock } from "lucide-react";
import InterlockLogo from "@/assets/logos/Interlock.svg"; // Add this
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface WelcomeEmptyStateProps {
  userName: string;
  onAddBank: () => void;
}

const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "256-bit encryption protects your data",
  },
  {
    icon: Zap,
    title: "Instant Sync",
    description: "Real-time balance and transaction updates",
  },
  {
    icon: Lock,
    title: "Read-Only Access",
    description: "We never move money without permission",
  },
];

export function WelcomeEmptyState({
  userName,
  onAddBank,
}: WelcomeEmptyStateProps) {
  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <Card
        padding="none"
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="welcome-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#welcome-grid)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-brand-main)] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-success-main)] rounded-full blur-[100px] opacity-15" />

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white mb-8 shadow-2xl shadow-black/20">
            <Image
              src={InterlockLogo}
              alt="Interlock"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>

          {/* Text */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Welcome to Interlock, {userName}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Connect your bank account to unlock powerful financial insights,
            seamless transfers, and complete control over your money.
          </p>

          {/* CTA */}
          <Button
            size="lg"
            className="bg-brand-main hover:bg-brand-hover text-white shadow-xl shadow-brand-main/20 px-8 h-12 text-base font-semibold"
            onClick={onAddBank}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Connect Your First Bank
          </Button>
        </div>
      </Card>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="text-center py-6 px-4 border-[var(--color-gray-soft)]"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-brand-surface)] mb-4">
              <feature.icon className="w-6 h-6 text-[var(--color-brand-main)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-gray-text)] mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-[var(--color-gray-main)]">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
