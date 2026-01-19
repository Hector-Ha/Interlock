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

// Time period options for dropdown
const timePeriodOptions: SelectOption[] = [
  { value: "1week", label: "Last 7 Days" },
  { value: "1month", label: "Last Month" },
  { value: "1year", label: "Last Year" },
  { value: "alltime", label: "All Time" },
];

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Food and Drink": <Utensils className="h-5 w-5" />,
  Travel: <Car className="h-5 w-5" />,
  Shops: <ShoppingBag className="h-5 w-5" />,
  Shopping: <ShoppingBag className="h-5 w-5" />,
  Transfer: <CreditCard className="h-5 w-5" />,
  Payment: <CreditCard className="h-5 w-5" />,
  Recreation: <Tv className="h-5 w-5" />,
  Entertainment: <Tv className="h-5 w-5" />,
  Service: <Briefcase className="h-5 w-5" />,
  Healthcare: <Heart className="h-5 w-5" />,
  Community: <Gift className="h-5 w-5" />,
  "Bank Fees": <Home className="h-5 w-5" />,
  Interest: <PiggyBank className="h-5 w-5" />,
  Tax: <Briefcase className="h-5 w-5" />,
};

function getCategoryIcon(category: string): React.ReactNode {
  // Try exact match first
  if (categoryIcons[category]) {
    return categoryIcons[category];
  }
  // Try partial match
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  // Default icon
  return <CreditCard className="h-5 w-5" />;
}

/**
 * Right sidebar for the dashboard.
 * Displays user profile, bank cards stack, and transaction history by category.
 * Hidden on mobile/tablet, visible on desktop (xl+).
 */
export function RightSideBar({ className }: RightSideBarProps) {
  const { user } = useAuthStore();
  const { banks } = useBankStore();
  const { data, isLoading, timePeriod, setTimePeriod } =
    useTransactionsByCategory(banks);

  if (!user) return null;

  const userInitial = user.firstName?.[0]?.toUpperCase() || "U";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  // Check if there's any transaction data
  const hasAnyTransactions = data.some((bank) => bank.categories.length > 0);

  return (
    <aside
      className={cn(
        "flex w-80 flex-col border-l border-border bg-card",
        className,
      )}
    >
      <ScrollArea className="flex-1">
        {/* Gradient Banner */}
        <div className="relative h-24 w-full overflow-hidden bg-gradient-to-r from-pink-300 via-purple-200 to-cyan-300 shrink-0">
          {/* Curved bottom effect */}
          <div className="absolute -bottom-4 left-0 right-0 h-8 rounded-t-[2rem] bg-card" />
        </div>

        {/* Profile Section - overlaps banner */}
        <div className="relative -mt-10 flex flex-col items-start px-6 pb-6 shrink-0">
          {/* Avatar */}
          <Avatar className="h-16 w-16 border-4 border-card shadow-lg">
            <AvatarImage src={undefined} alt={fullName} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              {userInitial}
            </AvatarFallback>
          </Avatar>

          {/* Name and Email */}
          <div className="mt-4 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              {fullName}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* My Banks Section */}
        <div className="px-6 pb-6 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">
              My Banks
            </h3>
            <Link
              href="/banks"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add bank
            </Link>
          </div>

          {/* Stacked Bank Cards */}
          <div className="min-h-[140px]">
            <BankCardStack banks={banks} />
          </div>
        </div>

        {/* Transactions History Section */}
        <div className="flex-1 px-6 pb-6 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">
              Transactions
            </h3>
            <div className="w-32">
              <Select
                options={timePeriodOptions}
                value={timePeriod}
                onChange={(value) => setTimePeriod(value as TimePeriod)}
                placeholder="Period"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty State - No Banks */}
          {!isLoading && banks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No banks linked yet
              </p>
              <Link
                href="/banks"
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                Add your first bank
              </Link>
            </div>
          )}

          {/* Empty State - No Transactions */}
          {!isLoading && banks.length > 0 && !hasAnyTransactions && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No transactions found
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try selecting a different time period
              </p>
            </div>
          )}

          {/* Transaction Data by Bank */}
          {!isLoading && hasAnyTransactions && (
            <div className="space-y-6">
              {data.map((bankData, bankIndex) => {
                if (bankData.categories.length === 0) return null;

                return (
                  <div key={bankData.bankId}>
                    {/* Bank Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {bankData.bankName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {bankData.categories.length} categories
                      </span>
                    </div>

                    {/* Category Items */}
                    <div className="divide-y divide-border">
                      {bankData.categories
                        .slice(0, 5)
                        .map((category, index) => (
                          <CategoryTransactionItem
                            key={`${bankData.bankId}-${category.category}`}
                            index={bankIndex * 5 + index}
                            icon={getCategoryIcon(category.category)}
                            label={category.category}
                            positiveAmount={
                              category.income > 0 ? category.income : undefined
                            }
                            negativeAmount={
                              category.expense > 0
                                ? category.expense
                                : undefined
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
      </ScrollArea>
    </aside>
  );
}

export default RightSideBar;
