"use client";

import { AddTransactionForm } from "@/components/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fieldConfigurations } from "@/config";
import { TransactionFormProvider } from "@/hooks/use-transaction-hook";
import { ArrowDownCircle, ArrowUpCircle, Plus } from "lucide-react";
import { useState } from "react";

const defaultVisibleFields = {
  category: {
    visible: true,
    config: fieldConfigurations.category,
  },
  partyName: {
    visible: true,
    config: fieldConfigurations.partyNAme,
  },
  otherDetail: {
    visible: true,
    config: fieldConfigurations.otherDetail,
  },
  paymentMode: {
    visible: true,
    config: fieldConfigurations.category,
  },
  date: {
    visible: true,
    config: fieldConfigurations.category,
  },
  remark: {
    visible: true,
    config: fieldConfigurations.category,
  },
  attachments: {
    visible: true,
    config: fieldConfigurations.category,
  },
};

interface AddTransactionCardProps {
  cashbookId: string;
  businessId: string;
  className?: string;
  variant?: 'default' | 'floating' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

export default function AddTransactionCard({
  businessId,
  cashbookId,
  className = '',
  variant = 'default',
  size = 'md'
}: AddTransactionCardProps) {
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<
    "cash_in" | "cash_out"
  >("cash_in");

  const handleButtonClick = (type: "cash_in" | "cash_out") => {
    setTransactionType(type);
    setOpen(true);
  };

  const sizeClasses = {
    sm: {
      button: 'h-9 px-3 text-sm',
      icon: 'h-3.5 w-3.5',
    },
    md: {
      button: 'h-10 sm:h-11 px-3 sm:px-4 text-sm sm:text-base',
      icon: 'h-4 w-4 sm:h-4.5 sm:w-4.5',
    },
    lg: {
      button: 'h-12 px-4 text-base',
      icon: 'h-5 w-5',
    },
  };

  const variantClasses = {
    default: 'flex-row gap-2 sm:gap-4',
    floating: 'fixed bottom-6 right-6 flex-col gap-3 p-4 rounded-full shadow-xl bg-primary',
    compact: 'flex-row gap-1 sm:gap-2'
  };

  // Floating variant shows a single "+" button that opens menu
  if (variant === 'floating') {
    return (
      <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`
            fixed bottom-6 right-6 sm:hidden
            flex items-center justify-center
            h-14 w-14
            rounded-full 
            bg-primary text-primary-foreground
            shadow-lg hover:shadow-xl
            transition-all duration-200
            active:scale-95 z-50
            ${className}
          `}
          aria-label="Add transaction"
        >
          <Plus className="h-6 w-6" />
        </button>
      </TransactionFormProvider>
    );
  }

  // Compact variant for tight spaces
  if (variant === 'compact') {
    return (
      <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
        <div className="relative">
          <div className={`flex ${variantClasses[variant]} ${className}`}>
            <button
              type="button"
              onClick={() => handleButtonClick("cash_in")}
              className={`
                ${sizeClasses[size].button}
                flex items-center justify-center gap-1 sm:gap-2
                rounded-full border transition-all
                bg-green-100 border-green-300 text-green-800 
                hover:shadow hover:shadow-green-10 hover:cursor-pointer
                active:scale-95
                min-w-[120px] sm:min-w-[140px]
              `}
            >
              <ArrowDownCircle className={sizeClasses[size].icon} />
              <span className="truncate">Cash In</span>
            </button>
            <button
              type="button"
              onClick={() => handleButtonClick("cash_out")}
              className={`
                ${sizeClasses[size].button}
                flex items-center justify-center gap-1 sm:gap-2
                rounded-full border transition-all
                bg-red-100 border-red-300 text-red-800 
                hover:shadow hover:shadow-red-10 hover:cursor-pointer
                active:scale-95
                min-w-[120px] sm:min-w-[140px]
              `}
            >
              <ArrowUpCircle className={sizeClasses[size].icon} />
              <span className="truncate">Cash Out</span>
            </button>
          </div>
          <TransactionSheet 
            open={open} 
            setOpen={setOpen}
            transactionType={transactionType}
            businessId={businessId}
            cashbookId={cashbookId}
          />
        </div>
      </TransactionFormProvider>
    );
  }

  // Default variant
  return (
    <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
      <div className={`relative ${className}`}>
        <div className={`flex ${variantClasses.default}`}>
          <button
            type="button"
            onClick={() => handleButtonClick("cash_in")}
            className={`
              ${sizeClasses[size].button}
              flex items-center justify-center gap-2
              rounded-full border transition-all
              bg-green-100 border-green-300 text-green-800 
              hover:shadow hover:shadow-green-10 hover:cursor-pointer
              hover:bg-green-200
              active:scale-95
              w-full sm:w-auto
              min-w-[140px] sm:min-w-[160px]
            `}
          >
            <ArrowDownCircle className={sizeClasses[size].icon} />
            <span className="truncate font-medium">Cash In</span>
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("cash_out")}
            className={`
              ${sizeClasses[size].button}
              flex items-center justify-center gap-2
              rounded-full border transition-all
              bg-red-100 border-red-300 text-red-800 
              hover:shadow hover:shadow-red-10 hover:cursor-pointer
              hover:bg-red-200
              active:scale-95
              w-full sm:w-auto
              min-w-[140px] sm:min-w-[160px]
            `}
          >
            <ArrowUpCircle className={sizeClasses[size].icon} />
            <span className="truncate font-medium">Cash Out</span>
          </button>
        </div>
        <TransactionSheet 
          open={open} 
          setOpen={setOpen}
          transactionType={transactionType}
          businessId={businessId}
          cashbookId={cashbookId}
        />
      </div>
    </TransactionFormProvider>
  );
}

interface TransactionSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionType: "cash_in" | "cash_out";
  businessId: string;
  cashbookId: string;
}

function TransactionSheet({
  open,
  setOpen,
  transactionType,
  businessId,
  cashbookId
}: TransactionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full p-0 sm:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
            <SheetTitle className="text-lg sm:text-xl font-semibold">
              Add {transactionType === "cash_in" ? "Cash In" : "Cash Out"} Transaction
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <AddTransactionForm
              businessId={businessId}
              bookId={cashbookId}
              type={transactionType}
              onSubmitSuccess={() => setOpen(false)}
              
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}