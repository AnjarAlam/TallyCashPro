"use client";
// import { useGetTransactionsByBook } from "@/services/cashbook.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrencyInfo, formatCurrencyAmount } from "@/constants/currency";
import { useGetTransactionsByBook } from "@/services";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: "default" | "positive" | "negative";
  currencySymbol?: string;
  showLeadingIcon?: boolean;
}

const MetricCard = ({
  title,
  value,
  icon,
  variant = "default",
  currencySymbol,
  showLeadingIcon = true,
}: MetricCardProps) => {
  const variantClasses = {
    default: "bg-muted",
    positive: "bg-green-50 border border-green-200 dark:bg-green-900/20",
    negative: "bg-red-50 border border-red-200 dark:bg-red-900/20",
  };

  const iconClasses = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
    positive:
      "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300",
    negative: "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300",
  };

  return (
    <Card className={cn("shadow-none h-full", variantClasses[variant])}>
      <CardContent className="flex items-center p-4 sm:p-6">
        {showLeadingIcon && (
          <div
            className={cn(
              "flex items-center justify-center p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0",
              iconClasses[variant]
            )}
          >
            <div className="h-5 w-5 sm:h-6 sm:w-6">{icon}</div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-base sm:text-lg md:text-xl font-semibold truncate">
              {value}
            </p>
            {currencySymbol && (
              <span className="text-base sm:text-lg md:text-xl font-semibold shrink-0">
                {currencySymbol}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MASKED_AMOUNT = "••••••";

interface BookTotalsCardProps {
  bookId: string;
  /** When false, summary amounts show masked dots (default true). */
  showAmounts?: boolean;
}

export function BookTotalsCard({ bookId, showAmounts = true }: BookTotalsCardProps) {
  // Use the updated transaction service
  const {
    globalAnalytics,
    currency,
    isTransactionsPending,
    isTransactionsError,
    transactionsError,
    refetchTransactions,
  } = useGetTransactionsByBook({
    bookId,
    pageSize: 1, // We only need metadata, not transactions
    pageNumber: 1,
  });

  const formatCurrencyValue = (value: number) => {
    return formatCurrencyAmount(value, currency, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getCurrencySymbol = () => {
    const currencyInfo = getCurrencyInfo(currency);
    return currencyInfo.symbol;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatSummaryValue = (num: number) =>
    showAmounts ? formatNumber(num) : MASKED_AMOUNT;

  if (isTransactionsPending) {
    return (
      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">
            Book Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-24 sm:h-28 w-full" />
            <Skeleton className="h-24 sm:h-28 w-full" />
            <Skeleton className="h-24 sm:h-28 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isTransactionsError) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTitle>Error loading totals</AlertTitle>
        <AlertDescription className="text-sm sm:text-base">
          {transactionsError?.message || "Unknown error"}
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-3 sm:mt-4 text-sm sm:text-base"
          onClick={() => refetchTransactions()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  const currencySymbol = getCurrencySymbol();

  return (
    <div className="w-full">
      <Card className="border-none shadow-none">
        <CardHeader className="px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Book Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <MetricCard
              title="Total In"
              value={formatSummaryValue(globalAnalytics.totalCashIn)}
              icon={<ArrowUp className="h-full w-full" />}
              variant="positive"
              currencySymbol={showAmounts ? currencySymbol : undefined}
            />

            <MetricCard
              title="Total Out"
              value={formatSummaryValue(globalAnalytics.totalCashOut)}
              icon={<ArrowDown className="h-full w-full" />}
              variant="negative"
              currencySymbol={showAmounts ? currencySymbol : undefined}
            />

            <MetricCard
              title="Current Balance"
              value={formatSummaryValue(globalAnalytics.currentBalance)}
              icon={<Wallet className="h-full w-full" />}
              variant={globalAnalytics.currentBalance >= 0 ? "positive" : "negative"}
              currencySymbol={showAmounts ? currencySymbol : undefined}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}