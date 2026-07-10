"use client";

import { ArrowLeftRight } from "lucide-react";
import { Transaction } from "@/interface";
import { getTransferConversionLabel } from "@/lib/transfer-conversion";

interface TransferConversionBadgeProps {
  transaction: Transaction;
  className?: string;
}

export function TransferConversionBadge({
  transaction,
  className,
}: TransferConversionBadgeProps) {
  const label = getTransferConversionLabel(transaction);
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 ${className || ""}`}
    >
      <ArrowLeftRight className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}
