"use client";

import { Building2, Shield, Zap, Lock, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmptyBanksProps {
  onAddBank: () => void;
}

const securityFeatures = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "256-bit encryption protects all your data",
  },
  {
    icon: Zap,
    title: "Instant Sync",
    description: "Real-time balance updates",
  },
  {
    icon: Lock,
    title: "Read-Only Access",
    description: "We can never move your money",
  },
];

export function EmptyBanks({ onAddBank }: EmptyBanksProps) {
  return (
    <div className="space-y-6">
      {/* Main CTA Card */}
      <Card
        padding="none"
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="empty-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#empty-grid)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-main)] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-success-main)] rounded-full blur-[100px] opacity-15" />

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-brand-main)] to-[var(--color-brand-hover)] mb-8 shadow-2xl shadow-[var(--color-brand-main)]/30">
            <Building2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Connect Your First Bank
          </h2>
          <p className="text-white/60 text-lg max-w-md mx-auto mb-8 leading-relaxed">
            Link your bank account to start tracking expenses, managing
            transfers, and taking control of your finances.
          </p>

          <Button
            size="lg"
            onClick={onAddBank}
            className="bg-white text-[var(--color-brand-main)] hover:bg-white/90 shadow-xl shadow-black/20 px-8 h-12 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Connect Bank Account
          </Button>
        </div>
      </Card>

      {/* Security Features */}
      <div className="grid sm:grid-cols-3 gap-4">
        {securityFeatures.map((feature) => (
          <Card
            key={feature.title}
            className="text-center py-6 px-4 border-[var(--color-gray-soft)] transition-all duration-300"
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
