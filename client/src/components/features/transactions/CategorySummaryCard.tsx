"use client";

import { Loader2, PieChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select, type SelectOption } from "@/components/ui/Select";
import { CategoryTransactionItem } from "@/components/features/sidebar/CategoryTransactionItem";
import {
  CreditCard,
  ShoppingBag,
  Utensils,
  Car,
  Tv,
  Briefcase,
  Heart,
  Gift,
  Home,
  PiggyBank,
} from "lucide-react";

interface CategoryData {
  category: string;
  income: number;
  expense: number;
}

interface BankCategoryData {
  bankId: string;
  bankName: string;
  categories: CategoryData[];
}

interface CategorySummaryCardProps {
  data: BankCategoryData[];
  isLoading: boolean;
  timePeriod: string;
  onTimePeriodChange: (value: string) => void;
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
  if (categoryIcons[category]) return categoryIcons[category];
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return <CreditCard className="h-4 w-4" />;
}

export function CategorySummaryCard({
  data,
  isLoading,
  timePeriod,
  onTimePeriodChange,
}: CategorySummaryCardProps) {
  const hasAnyData = data.some((bank) => bank.categories.length > 0);

  return (
    <Card
      padding="none"
      className="overflow-hidden border-[var(--color-gray-soft)] h-fit"
    >
      <CardHeader className="flex-row items-center justify-between p-5 lg:p-6 border-b border-[var(--color-gray-soft)]">
        <CardTitle className="text-lg">Spending by Category</CardTitle>
        <div className="w-30 shrink-0">
          <Select
            options={timePeriodOptions}
            value={timePeriod}
            onChange={onTimePeriodChange}
            placeholder="Period"
            triggerClassName="h-9 text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="p-5 lg:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              className="h-6 w-6 animate-spin text-[var(--color-brand-main)]"
              aria-label="Loading…"
            />
          </div>
        ) : !hasAnyData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-gray-surface)] mb-4">
              <PieChart
                className="h-7 w-7 text-[var(--color-gray-disabled)]"
                aria-hidden="true"
              />
            </div>
            <p className="font-medium text-[var(--color-gray-text)] mb-1">
              No spending data
            </p>
            <p className="text-sm text-[var(--color-gray-main)]">
              Try selecting a different time period
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {data.map((bankData, bankIndex) => {
              if (bankData.categories.length === 0) return null;

              return (
                <div key={bankData.bankId}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-[var(--color-gray-text)]">
                      {bankData.bankName}
                    </span>
                    <span className="text-xs text-[var(--color-gray-main)] tabular-nums">
                      {bankData.categories.length} categories
                    </span>
                  </div>
                  <div className="space-y-2">
                    {bankData.categories.slice(0, 6).map((category, index) => (
                      <CategoryTransactionItem
                        key={`${bankData.bankId}-${category.category}`}
                        index={bankIndex * 6 + index}
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
      </CardContent>
    </Card>
  );
}
