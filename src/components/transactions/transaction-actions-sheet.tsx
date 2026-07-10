"use client";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { ChevronRight, ClipboardCheck, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "@/interface";

interface TransactionActionsSheetProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canVerify: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onVerify: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isVerifying?: boolean;
}

export function TransactionActionsSheet({
  transaction,
  open,
  onOpenChange,
  canVerify,
  canEdit,
  canDelete,
  onVerify,
  onEdit,
  onDelete,
  isVerifying = false,
}: TransactionActionsSheetProps) {
  const showVerify = canVerify && transaction && !transaction.isVerified;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 pt-2">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />
        <div className="flex flex-col gap-3">
          {showVerify && (
            <button
              type="button"
              disabled={isVerifying}
              onClick={onVerify}
              className="flex w-full items-center justify-between rounded-xl bg-emerald-50 px-4 py-4 text-left transition-colors hover:bg-emerald-100 disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-emerald-700" />
                <span className="font-semibold text-emerald-800">
                  {isVerifying ? "Verifying…" : "Verify Transaction"}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-600" />
            </button>
          )}

          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex w-full items-center justify-between rounded-xl bg-blue-50 px-4 py-4 text-left transition-colors hover:bg-blue-100"
            >
              <div className="flex items-center gap-3">
                <Pencil className="h-5 w-5 text-blue-700" />
                <span className="font-semibold text-blue-800">Edit Transaction</span>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex w-full items-center justify-between rounded-xl bg-red-50 px-4 py-4 text-left transition-colors hover:bg-red-100"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-700" />
                <span className="font-semibold text-red-800">Delete Transaction</span>
              </div>
              <ChevronRight className="h-5 w-5 text-red-600" />
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
