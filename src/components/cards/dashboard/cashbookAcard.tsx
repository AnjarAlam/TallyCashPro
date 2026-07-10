import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, ArrowRight, Plus } from "lucide-react";

export interface CashbookACardProps {
  title: string;
  totalCashbooks: number;
  avgTransactionsPerDay: number;
  totalCashIn: number;
  totalCashOut: number;
}

export default function CashbookACard(cashbookData: CashbookACardProps) {
  const {
    title,
    totalCashbooks,
    avgTransactionsPerDay,
    totalCashIn,
    totalCashOut,
  } = cashbookData;

  return (
    <Card className="group bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-full  border border-primary shadow-none">
      {/* Header with Icon and Title */}
      <CardHeader>
        <CardTitle className="flex justify-start items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
            <Wallet className="w-6 h-6 text-primary dark:text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">{title || "Your Cashbook"}</h2>
        </CardTitle>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex sm:flex-row flex-col gap-6">
        <div className="sm:w-1/2 w-full space-y-4">
          {/* Total Cashbooks */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Cashbooks
            </p>
            <p className="text-3xl font-bold">{totalCashbooks}</p>
          </div>
          {/* Average Transactions per Day */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg. Transactions per Day
            </p>
            <p className="text-3xl font-bold">
              {avgTransactionsPerDay.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full space-y-4">
          {/* Total Cash In */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Cash In
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${totalCashIn.toFixed(2)}
            </p>
          </div>
          {/* Total Cash Out */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Cash Out
            </p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              ${totalCashOut.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer with View All Button */}
      <CardFooter className="w-full flex justify-between items-center">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-primary dark:text-white dark:hover:text-white/80 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
        <Button
          variant={"outline"}
          size={"default"}
          className="rounded-full text-accent-foreground font-bold capitalize px-4 "
        >
          View All <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
