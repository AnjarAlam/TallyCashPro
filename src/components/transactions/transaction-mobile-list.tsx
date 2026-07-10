"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Banknote,
  CreditCard,
  Wallet,
} from "lucide-react";
import type { Transaction } from "@/interface";
import { formatCurrencyAmount } from "@/constants/currency";
import { getTransactionUserName } from "@/lib/transaction-verify";
import { TransactionVerifyBadge } from "./transaction-verify-badge";
import { TransactionActionsSheet } from "./transaction-actions-sheet";
import { useVerifyTransaction } from "@/services/transaction.service";
import { TransactionFormProvider } from "@/hooks/use-transaction-hook";
import { EditTransactionForm } from "@/components/form";
import { DeleteConfirmation } from "@/components/form/delete-form";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { fieldConfigurations } from "@/config";
import { useBusiness } from "@/providers/business-cashbook-provider";
import { TransferStatusBadge } from "@/components/badges/transfer-status-badge";
import { TransferConversionBadge } from "@/components/transactions/transfer-conversion-badge";
import { cn } from "@/lib/utils";

const defaultVisibleFields = {
  category: { visible: true, config: fieldConfigurations.category },
  partyName: { visible: true, config: fieldConfigurations.partyNAme },
  otherDetail: { visible: true, config: fieldConfigurations.otherDetail },
  paymentMode: { visible: true, config: fieldConfigurations.category },
  date: { visible: true, config: fieldConfigurations.category },
  remark: { visible: true, config: fieldConfigurations.category },
  attachments: { visible: true, config: fieldConfigurations.category },
};

interface TransactionMobileListProps {
  transactions: Transaction[];
  currency?: string;
  canVerify?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

function groupByDate(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const key = format(new Date(tx.date), "dd MMM yyyy");
    const list = groups.get(key) ?? [];
    list.push(tx);
    groups.set(key, list);
  }
  return Array.from(groups.entries());
}

function PaymentModeIcon({ mode }: { mode?: string }) {
  const name = (mode ?? "").toLowerCase();
  if (name.includes("cash") || name.includes("hand")) {
    return <Banknote className="h-3.5 w-3.5 text-gray-500" />;
  }
  if (name.includes("card") || name.includes("upi") || name.includes("mobile")) {
    return <CreditCard className="h-3.5 w-3.5 text-gray-500" />;
  }
  return <Wallet className="h-3.5 w-3.5 text-gray-500" />;
}

export function TransactionMobileList({
  transactions,
  currency = "USD",
  canVerify = false,
  canEdit = false,
  canDelete = false,
}: TransactionMobileListProps) {
  const { companyInfo } = useBusiness();
  const businessId = companyInfo?._id || "";
  const { verifyTransaction, isVerifyingTransaction } = useVerifyTransaction();

  const [selected, setSelected] = useState<Transaction | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const grouped = useMemo(() => groupByDate(transactions), [transactions]);

  const formatAmount = (amount: number, type: string) => {
    const formatted = formatCurrencyAmount(amount, currency);
    return type === "cash_in" ? `+${formatted}` : `-${formatted}`;
  };

  const openActions = (tx: Transaction) => {
    setSelected(tx);
    setActionsOpen(true);
  };

  const handleVerify = () => {
    if (!selected) return;
    verifyTransaction(selected._id, {
      onSuccess: () => {
        setActionsOpen(false);
        setSelected(null);
      },
    });
  };

  if (!transactions.length) return null;

  return (
    <>
      <div className="md:hidden space-y-4 min-w-0 max-w-full overflow-x-hidden">
        <p className="text-sm font-semibold text-gray-900 px-1">
          {transactions.length} Record{transactions.length === 1 ? "" : "s"} Found
        </p>

        {grouped.map(([dateLabel, dayTransactions]) => {
          const dayIn = dayTransactions
            .filter((t) => t.type === "cash_in")
            .reduce((s, t) => s + t.amount, 0);
          const dayOut = dayTransactions
            .filter((t) => t.type === "cash_out")
            .reduce((s, t) => s + t.amount, 0);

          return (
            <div key={dateLabel}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg bg-gray-100 px-3 py-2 mb-2 min-w-0">
                <span className="text-sm font-bold text-gray-900 shrink-0">{dateLabel}</span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 min-w-0">
                  <span className="shrink-0">{dayTransactions.length} entries</span>
                  <span className="text-green-600 shrink-0">+{formatCurrencyAmount(dayIn, currency)}</span>
                  <span className="text-red-600 shrink-0">-{formatCurrencyAmount(dayOut, currency)}</span>
                </div>
              </div>

              <div className="space-y-2">
                {dayTransactions.map((tx) => {
                  const category =
                    tx.categoryDetails?.name || tx.category || "No Category";
                  const paymentMode =
                    tx.paymentModeDetails?.name || tx.paymentMode || "—";
                  const title =
                    tx.description || tx.party || tx.remark || category;
                  const creator = getTransactionUserName(tx.createdBy);
                  const txDate = new Date(tx.date);
                  const timeLabel = tx.time || format(txDate, "hh:mm a");

                  return (
                    <button
                      key={tx._id}
                      type="button"
                      onClick={() => openActions(tx)}
                      className="w-full text-left rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                    >
                      <TransactionVerifyBadge transaction={tx} />
                      <div className="px-3 py-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                              <PaymentModeIcon mode={paymentMode} />
                              <span className="truncate">{paymentMode}</span>
                            </div>
                            <TransferConversionBadge
                              transaction={tx}
                              className="mt-1"
                            />
                            {tx.subType === "transfer" && (
                              <div className="mt-1">
                                <TransferStatusBadge
                                  status={tx.status as "pending" | "approved" | "rejected"}
                                  size="sm"
                                />
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p
                              className={cn(
                                "text-sm font-bold",
                                tx.type === "cash_in"
                                  ? "text-green-600"
                                  : "text-red-600"
                              )}
                            >
                              {formatAmount(tx.amount, tx.type)}
                            </p>
                            {typeof tx.runningBalance === "number" && (
                              <p className="text-xs font-medium text-green-600 mt-0.5">
                                Balance{" "}
                                {formatCurrencyAmount(tx.runningBalance, currency)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                          <span>
                            {format(txDate, "dd MMM yy")} • {timeLabel}
                          </span>
                          {creator && <span>by {creator}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <TransactionActionsSheet
        transaction={selected}
        open={actionsOpen}
        onOpenChange={setActionsOpen}
        canVerify={canVerify}
        canEdit={canEdit && selected?.subType !== "transfer"}
        canDelete={canDelete}
        onVerify={handleVerify}
        onEdit={() => {
          setActionsOpen(false);
          setEditOpen(true);
        }}
        onDelete={() => {
          setActionsOpen(false);
          setDeleteOpen(true);
        }}
        isVerifying={isVerifyingTransaction}
      />

      {selected && (
        <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Transaction</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <EditTransactionForm
                  transaction={selected}
                  businessId={businessId}
                  bookId={selected.book}
                  onSubmitSuccess={() => {
                    setEditOpen(false);
                    setSelected(null);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </TransactionFormProvider>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Delete transaction</DialogTitle>
          {selected && (
            <Card className="border-0 shadow-none">
              <CardFooter className="w-full p-0">
                <DeleteConfirmation
                  onClose={() => {
                    setDeleteOpen(false);
                    setSelected(null);
                  }}
                  id={selected._id}
                  type="transaction"
                  itemName={
                    selected.party || selected.description || "Transaction"
                  }
                  companyId={selected.book}
                />
              </CardFooter>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
