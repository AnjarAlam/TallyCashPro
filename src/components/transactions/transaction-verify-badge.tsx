"use client";

import { BadgeCheck } from "lucide-react";
import { getTransactionUserName } from "@/lib/transaction-verify";
import type { Transaction } from "@/interface";

interface TransactionVerifyBadgeProps {
  transaction: Transaction;
  className?: string;
}

export function TransactionVerifyBadge({
  transaction,
  className = "",
}: TransactionVerifyBadgeProps) {
  if (!transaction.isVerified) return null;

  const verifierName =
    getTransactionUserName(transaction.verifiedBy) || "Verified";

  return (
    <div
      className={`flex items-center gap-2 rounded-t-lg bg-emerald-50 px-3 py-1.5 border-b border-emerald-100 ${className}`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
      </span>
      <span className="text-xs font-semibold text-emerald-700 truncate">
        {verifierName}
      </span>
    </div>
  );
}
