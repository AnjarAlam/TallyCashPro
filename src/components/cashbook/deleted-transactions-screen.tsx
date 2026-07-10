"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { ArchiveRestore, RefreshCw, Trash2 } from "lucide-react";
import { formatDate, hasPermission } from "@/lib";
import {
  useGetDeletedTransactionsByBook,
  useRestoreTransaction,
} from "@/services/transaction.service";
import { useCashbookMemberRole, useCompanyMemberRole } from "@/services";
import { useGetCashbookById } from "@/services/cashbook.service";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrencyAmount, type CurrencyCode } from "@/constants/currency";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardFooter } from "@/components/ui/card";
import { DeleteConfirmationForm } from "@/components/form/delete-form";
import type { Transaction } from "@/interface";

interface DeletedTransactionsScreenProps {
  businessId: string;
  cashbookId: string;
}

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

function resolveDisplayName(
  ...candidates: (string | undefined | null)[]
): string | null {
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed && !OBJECT_ID_REGEX.test(trimmed)) {
      return trimmed;
    }
  }
  return null;
}

function getCategoryDisplay(tx: Transaction) {
  return resolveDisplayName(
    tx.categoryDetails?.name,
    tx.categoryName,
    tx.category,
  );
}

function getPaymentModeDisplay(tx: Transaction) {
  return resolveDisplayName(
    tx.paymentModeDetails?.name,
    tx.paymentModeName,
    tx.paymentMode,
  );
}

function getTransactionLabel(tx: Transaction) {
  return (
    resolveDisplayName(
      tx.partyDetails?.name,
      tx.partyName,
      tx.party,
      tx.description,
    ) || "Transaction"
  );
}

export function DeletedTransactionsScreen({
  businessId,
  cashbookId,
}: DeletedTransactionsScreenProps) {
  const { user } = useAuth();
  const [permanentDeleteTx, setPermanentDeleteTx] = useState<Transaction | null>(
    null,
  );
  const { data: userRole } = useCompanyMemberRole(businessId);
  const { data: userCashbookRole } = useCashbookMemberRole(
    cashbookId,
    user?._id || "",
  );
  const { cashbook } = useGetCashbookById(businessId, cashbookId);
  const {
    deletedTransactions,
    isDeletedTransactionsPending,
    isDeletedTransactionsError,
    deletedTransactionsError,
    refetchDeletedTransactions,
  } = useGetDeletedTransactionsByBook(cashbookId);
  const { restoreTransaction, isRestoringTransaction } = useRestoreTransaction();

  const currency = (cashbook?.currency || "USD") as CurrencyCode;

  const canDelete = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "crud_transaction",
    "D",
  );

  const formatAmount = (amount: number, type: string) => {
    const formatted = formatCurrencyAmount(amount, currency);
    return type === "cash_in" ? `+${formatted}` : `-${formatted}`;
  };

  if (isDeletedTransactionsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load recycle bin</AlertTitle>
        <AlertDescription>
          {deletedTransactionsError?.message || "Unknown error"}
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => refetchDeletedTransactions()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Deleted transactions stay here until restored or permanently removed.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => refetchDeletedTransactions()}
          disabled={isDeletedTransactionsPending}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isDeletedTransactionsPending ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isDeletedTransactionsPending ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : deletedTransactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <Trash2 className="h-10 w-10 mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">Recycle bin is empty</p>
          <p className="text-sm text-slate-500 mt-1">
            When you delete a transaction, it will appear here.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={`/dashboard/business/${businessId}/${cashbookId}`}>
              Back to transactions
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {deletedTransactions.map((tx) => {
            const categoryLabel = getCategoryDisplay(tx);
            const paymentModeLabel = getPaymentModeDisplay(tx);

            return (
            <div
              key={tx._id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900 truncate">
                    {getTransactionLabel(tx)}
                  </p>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                      tx.type === "cash_in"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700",
                    )}
                  >
                    {tx.type.replace("_", " ")}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-lg font-bold mt-1",
                    tx.type === "cash_in" ? "text-green-600" : "text-red-600",
                  )}
                >
                  {formatAmount(tx.amount, tx.type)}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                  <span>{format(new Date(tx.date), "dd MMM yyyy")}</span>
                  {categoryLabel ? <span>{categoryLabel}</span> : null}
                  {paymentModeLabel ? <span>{paymentModeLabel}</span> : null}
                </div>
                {tx.deletedAt ? (
                  <p className="text-xs text-slate-400 mt-1">
                    Deleted {formatDate(tx.deletedAt, "Do-MMM-YYYY, h:mm A")}
                  </p>
                ) : null}
              </div>
              {canDelete ? (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={isRestoringTransaction}
                    onClick={() =>
                      restoreTransaction({
                        transactionId: tx._id,
                        bookId: cashbookId,
                      })
                    }
                  >
                    <ArchiveRestore className="h-3.5 w-3.5" />
                    Restore
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setPermanentDeleteTx(tx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete forever
                  </Button>
                </div>
              ) : null}
            </div>
            );
          })}
        </div>
      )}

      {permanentDeleteTx ? (
        <Dialog
          open={!!permanentDeleteTx}
          onOpenChange={(open) => !open && setPermanentDeleteTx(null)}
        >
          <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>Permanently delete transaction</DialogTitle>
            </DialogHeader>
            <Card className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <CardFooter className="w-full p-0">
                <DeleteConfirmationForm
                  onClose={() => setPermanentDeleteTx(null)}
                  id={permanentDeleteTx._id}
                  bookId={cashbookId}
                  type="transaction-permanent"
                  itemName={getTransactionLabel(permanentDeleteTx)}
                />
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
