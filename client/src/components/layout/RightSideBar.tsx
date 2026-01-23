"use client";

import {
  Plus,
  Tv,
  ShoppingBag,
  PiggyBank,
  Utensils,
  Car,
  Home,
  Briefcase,
  Heart,
  Gift,
  CreditCard,
  Loader2,
  User,
  Building2,
  Shield,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useBankStore } from "@/stores/bank.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { BankCardStack } from "@/components/features/sidebar/BankCardStack";
import { CategoryTransactionItem } from "@/components/features/sidebar/CategoryTransactionItem";
import {
  useTransactionsByCategory,
  type TimePeriod,
} from "@/hooks/useTransactionsByCategory";

interface RightSideBarProps {
  className?: string;
}

const timePeriodOptions: SelectOption[] = [
  { value: "1week", label: "Last 7 Days" },
  { value: "1month", label: "Last Month" },
  { value: "1year", label: "Last Year" },
  { value: "alltime", label: "All Time" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Food and Drink": <Utensils className="h-4 w-4" />,
  Travel: <Car className="h-4 w-4" />,
  Shops: <ShoppingBag className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Transfer: <CreditCard className="h-4 w-4" />,
  Payment: <CreditCard className="h-4 w-4" />,
  Recreation: <Tv className="h-4 w-4" />,
  Entertainment: <Tv className="h-4 w-4" />,
  Service: <Briefcase className="h-4 w-4" />,
  Healthcare: <Heart className="h-4 w-4" />,
  Community: <Gift className="h-4 w-4" />,
  "Bank Fees": <Home className="h-4 w-4" />,
  Interest: <PiggyBank className="h-4 w-4" />,
  Tax: <Briefcase className="h-4 w-4" />,
};

function getCategoryIcon(category: string): React.ReactNode {
  if (categoryIcons[category]) {
    return categoryIcons[category];
  }
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return <CreditCard className="h-4 w-4" />;
}

export function RightSideBar({ className }: RightSideBarProps) {
  const { user } = useAuthStore();
  const { banks } = useBankStore();
  const { data, isLoading, timePeriod, setTimePeriod } =
    useTransactionsByCategory(banks);

  if (!user) return null;

  const userInitial = user.firstName?.[0]?.toUpperCase() || "U";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const hasAnyTransactions = data.some((bank) => bank.categories.length > 0);

  return (
    <aside
      className={cn(
        "flex w-80 flex-col border-l border-[var(--color-gray-soft)] bg-white",
        className
      )}
    >
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Profile Section */}
          <Card
            padding="none"
            className="relative overflow-hidden border-[var(--color-gray-soft)]"
          >
            {/* Gradient Header */}
            <div className="h-16 bg-gradient-to-br from-[var(--color-brand-main)] to-[var(--color-brand-hover)]" />
            
            <div className="px-4 pb-4">
              {/* Avatar - overlapping header */}
              <div className="-mt-8 mb-3">
                <Avatar className="h-14 w-14 border-4 border-white shadow-lg">
                  <AvatarImage src={undefined} alt={fullName} />
                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-[var(--color-brand-main)] to-[var(--color-brand-hover)] text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-[var(--color-gray-text)] truncate">
                  {fullName}
                </h2>
                <p className="text-sm text-[var(--color-gray-main)] truncate">
                  {user.email}
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-gray-soft)]">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--color-success-surface)]">
                  <Shield className="h-3 w-3 text-[var(--color-success-main)]" />
                  <span className="text-[10px] font-semibold text-[var(--color-success-main)] uppercase tracking-wider">
                    Verified
                  </span>
                </div>
                <Link
                  href="/settings"
                  className="ml-auto flex items-center gap-1 text-xs font-medium text-[var(--color-brand-main)] hover:text-[var(--color-brand-hover)] transition-colors"
                >
                  <User className="h-3 w-3" />
                  Profile
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </Card>

          {/* My Banks Section */}
          <Card padding="none" className="border-[var(--color-gray-soft)]">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-gray-soft)]">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[var(--color-brand-main)]" />
                <h3 className="text-sm font-semibold text-[var(--color-gray-text)]">
                  My Banks
                </h3>
              </div>
              <Link
                href="/banks"
                className="flex items-center gap-1 text-xs font-medium text-[var(--color-brand-main)] hover:text-[var(--color-brand-hover)] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Link>
            </div>

            <div className="p-4">
              {banks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-brand-surface)] to-[var(--color-brand-soft)] mb-3">
                    <Building2 className="h-7 w-7 text-[var(--color-brand-main)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-gray-text)] mb-1">
                    No banks linked
                  </p>
                  <p className="text-xs text-[var(--color-gray-main)] mb-4">
                    Connect your bank to get started
                  </p>
                  <Link
                    href="/banks"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[var(--color-brand-main)] to-[var(--color-brand-hover)] hover:shadow-lg hover:shadow-[var(--color-brand-main)]/25 rounded-lg transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Link Bank
                  </Link>
                </div>
              ) : (
                <div className="min-h-[140px]">
                  <BankCardStack banks={banks} />
                </div>
              )}
            </div>
          </Card>

          {/* Spending by Category Section */}
          <Card padding="none" className="border-[var(--color-gray-soft)]">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-gray-soft)]">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--color-success-main)]" />
                <h3 className="text-sm font-semibold text-[var(--color-gray-text)]">
                  Spending
                </h3>
              </div>
              <div className="w-28">
                <Select
                  options={timePeriodOptions}
                  value={timePeriod}
                  onChange={(value) => setTimePeriod(value as TimePeriod)}
                  placeholder="Period"
                />
              </div>
            </div>

            <div className="p-4">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--color-brand-main)]" />
                </div>
              )}

              {!isLoading && banks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-gray-surface)] mb-3">
                    <CreditCard className="h-6 w-6 text-[var(--color-gray-disabled)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-gray-text)] mb-1">
                    No spending data
                  </p>
                  <p className="text-xs text-[var(--color-gray-main)]">
                    Link a bank to see your spending
                  </p>
                </div>
              )}

              {!isLoading && banks.length > 0 && !hasAnyTransactions && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-warning-surface)] mb-3">
                    <ShoppingBag className="h-6 w-6 text-[var(--color-warning-main)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-gray-text)] mb-1">
                    No transactions found
                  </p>
                  <p className="text-xs text-[var(--color-gray-main)]">
                    Try selecting a different time period
                  </p>
                </div>
              )}

              {!isLoading && hasAnyTransactions && (
                <div className="space-y-4">
                  {data.map((bankData, bankIndex) => {
                    if (bankData.categories.length === 0) return null;

                    return (
                      <div key={bankData.bankId}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-[var(--color-gray-main)]">
                            {bankData.bankName}
                          </span>
                          <span className="text-[10px] text-[var(--color-gray-disabled)]">
                            {bankData.categories.length} categories
                          </span>
                        </div>

                        <div className="space-y-1">
                          {bankData.categories.slice(0, 5).map((category, index) => (
                            <CategoryTransactionItem
                              key={`${bankData.bankId}-${category.category}`}
                              index={bankIndex * 5 + index}
                              icon={getCategoryIcon(category.category)}
                              label={category.category}
                              positiveAmount={
                                category.income > 0 ? category.income : undefined
                              }
                              negativeAmount={
                                category.expense > 0 ? category.expense : undefined
                              }
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
}

export default RightSideBar;
