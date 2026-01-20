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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useBankStore } from "@/stores/bank.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Select, type SelectOption } from "@/components/ui/Select";
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
        "flex w-80 flex-col border-l border-border/50 bg-background",
        className
      )}
    >
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={undefined} alt={fullName} />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-brand-main to-brand-hover text-white">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-foreground truncate">
                  {fullName}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Link
              href="/settings"
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-main hover:text-brand-hover transition-colors"
            >
              <User className="h-3 w-3" />
              View Profile
            </Link>
          </div>

          {/* My Banks Section */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                My Banks
              </h3>
              <Link
                href="/banks"
                className="flex items-center gap-1 text-xs font-medium text-brand-main hover:text-brand-hover transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Link>
            </div>

            {banks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-surface mb-3">
                  <Building2 className="h-6 w-6 text-brand-main" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  No banks linked
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Connect your bank to get started
                </p>
                <Link
                  href="/banks"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-main hover:bg-brand-hover rounded-lg transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Link Bank Account
                </Link>
              </div>
            ) : (
              <div className="min-h-[140px]">
                <BankCardStack banks={banks} />
              </div>
            )}
          </div>

          {/* Transactions Section */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Transactions
              </h3>
              <div className="w-28">
                <Select
                  options={timePeriodOptions}
                  value={timePeriod}
                  onChange={(value) => setTimePeriod(value as TimePeriod)}
                  placeholder="Period"
                />
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-brand-main" />
              </div>
            )}

            {!isLoading && banks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-surface mb-3">
                  <CreditCard className="h-6 w-6 text-brand-main" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  No transaction data
                </p>
                <p className="text-xs text-muted-foreground">
                  Link a bank to see your spending
                </p>
              </div>
            )}

            {!isLoading && banks.length > 0 && !hasAnyTransactions && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-surface mb-3">
                  <ShoppingBag className="h-6 w-6 text-warning-main" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  No transactions found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try selecting a different time period
                </p>
              </div>
            )}

            {!isLoading && hasAnyTransactions && (
              <div className="space-y-5">
                {data.map((bankData, bankIndex) => {
                  if (bankData.categories.length === 0) return null;

                  return (
                    <div key={bankData.bankId}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {bankData.bankName}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
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
        </div>
      </ScrollArea>
    </aside>
  );
}

export default RightSideBar;
