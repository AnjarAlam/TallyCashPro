"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useMemo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useSoftDeleteCashbook,
  useHardDeleteCashbook,
} from "@/services/cashbook.service";
import {
  useDeleteBusiness,
  useDeleteParty,
  useRemoveCompanyMember,
} from "@/services";
import {
  useDeleteTransaction,
  useHardDeleteTransaction,
} from "@/services/transaction.service";
import { useDeleteCategory } from "@/services/category.service";
import { useDeletePaymentMode } from "@/services/payment-mode.service";
import { useRemoveMemberFromBooks } from "@/services/team.service";

type DeleteType =
  | "business"
  | "cashbook"
  | "cashbook-permanent"
  | "transaction"
  | "transaction-permanent"
  | "category"
  | "party"
  | "payment-mode"
  | "business-member"
  | "cashbook-member";

interface DeleteConfirmationProps {
  onClose: () => void;
  onSuccess?: () => void;
  id: string;
  companyId?: string;
  itemName: string;
  type: DeleteType;
  bookId?: string;
  userId?: string;
}

interface MutationHandler {
  isLoading: boolean;
  execute: (
    id: string,
    companyId?: string,
    bookId?: string,
    userId?: string,
  ) => Promise<void> | void;
  successMessage: string;
  errorMessage: string;
  isSoftDelete?: boolean;
}

function useDeleteHandler(type: DeleteType, bookId?: string): MutationHandler {
  const softDeleteCashbookMutation = useSoftDeleteCashbook();
  const hardDeleteCashbookMutation = useHardDeleteCashbook();
  const businessMutation = useDeleteBusiness();
  const transactionMutation = useDeleteTransaction();
  const hardDeleteTransactionMutation = useHardDeleteTransaction();
  const categoryMutation = useDeleteCategory();
  const partyMutation = useDeleteParty();
  const paymentModeMutation = useDeletePaymentMode();
  const businessMemberMutation = useRemoveCompanyMember();
  const cashbookMemberMutation = useRemoveMemberFromBooks();

  return useMemo(() => {
    const commonCallbacks = (onSuccess: () => void, onError: () => void) => ({
      onSuccess,
      onError,
    });

    switch (type) {
      case "cashbook":
        return {
          isLoading: softDeleteCashbookMutation.isSoftDeleteCashbookPending,
          isSoftDelete: true,
          successMessage: "Book moved to deleted books",
          errorMessage: "Failed to move book to deleted books",
          execute: (id: string, companyId?: string) => {
            if (!companyId) {
              throw new Error("Company ID is required");
            }
            return softDeleteCashbookMutation.softDeleteCashbook(
              { companyId, bookId: id },
              commonCallbacks(() => { }, () => { }),
            );
          },
        };
      case "cashbook-permanent":
        return {
          isLoading: hardDeleteCashbookMutation.isHardDeleteCashbookPending,
          successMessage: "Book permanently deleted",
          errorMessage: "Failed to delete book permanently",
          execute: (id: string, companyId?: string) => {
            if (!companyId) {
              throw new Error("Company ID is required");
            }
            return hardDeleteCashbookMutation.hardDeleteCashbook(
              { companyId, bookId: id },
              commonCallbacks(() => { }, () => { }),
            );
          },
        };
      case "business":
        return {
          isLoading: businessMutation.isDeletingBusiness,
          successMessage: `${"Business"} deleted successfully`,
          errorMessage: "Failed to delete business",
          execute: (id: string) =>
            businessMutation.deleteBusiness(
              id,
              commonCallbacks(() => { }, () => { }),
            ),
        };
      case "transaction":
        return {
          isLoading: transactionMutation.isDeletingTransaction,
          isSoftDelete: true,
          successMessage: "Transaction moved to recycle bin",
          errorMessage: "Failed to move transaction to recycle bin",
          execute: (id: string) =>
            transactionMutation.deleteTransaction(
              id,
              commonCallbacks(() => { }, () => { }),
            ),
        };
      case "transaction-permanent":
        return {
          isLoading: hardDeleteTransactionMutation.isHardDeletingTransaction,
          successMessage: "Transaction permanently deleted",
          errorMessage: "Failed to permanently delete transaction",
          execute: (id: string) =>
            hardDeleteTransactionMutation.hardDeleteTransaction(
              { transactionId: id, bookId },
              commonCallbacks(() => { }, () => { }),
            ),
        };
      case "category":
        return {
          isLoading: categoryMutation.isDeletingCategory,
          successMessage: "Category deleted successfully",
          errorMessage: "Failed to delete category",
          execute: (id: string) =>
            categoryMutation.deleteCategory(
              { categoryId: id },
              commonCallbacks(() => { }, () => { }),
            ),
        };
      case "party":
        return {
          isLoading: partyMutation.isDeletingParty,
          successMessage: "Party deleted successfully",
          errorMessage: "Failed to delete party",
          execute: (id: string) => {
            if (!bookId) {
              throw new Error("Book ID is required");
            }
            return partyMutation.deleteParty(
              { id, bookId },
              commonCallbacks(() => { }, () => { }),
            );
          },
        };
      case "payment-mode":
        return {
          isLoading: paymentModeMutation.isDeletingPaymentMode,
          successMessage: "Payment mode deleted successfully",
          errorMessage: "Failed to delete payment mode",
          execute: (id: string) =>
            paymentModeMutation.deletePaymentMode(id, { onSuccess: () => { } }),
        };
      case "business-member":
        return {
          isLoading: businessMemberMutation.isRemovingMember,
          successMessage: "Member removed successfully",
          errorMessage: "Failed to remove member",
          execute: (id: string, companyId?: string) => {
            if (!companyId) {
              throw new Error("Company ID is required");
            }
            return businessMemberMutation.removeCompanyMember(
              { companyId, memberId: id },
              commonCallbacks(() => { }, () => { }),
            );
          },
        };
      case "cashbook-member":
        return {
          isLoading: cashbookMemberMutation.isRemovingFromBooks,
          successMessage: "Member removed from book",
          errorMessage: "Failed to remove member",
          execute: (
            id: string,
            companyId?: string,
            bookId?: string,
            userId?: string,
          ) => {
            if (!companyId || !bookId || !userId) {
              throw new Error("Company ID, Book ID, and User ID are required");
            }
            return cashbookMemberMutation.removeMemberFromBooks(
              { companyId, bookId, userId },
              commonCallbacks(() => { }, () => { }),
            );
          },
        };
      default:
        throw new Error(`Unsupported delete type: ${type}`);
    }
  }, [
    type,
    bookId,
    softDeleteCashbookMutation,
    hardDeleteCashbookMutation,
    businessMutation,
    transactionMutation,
    hardDeleteTransactionMutation,
    categoryMutation,
    partyMutation,
    paymentModeMutation,
    businessMemberMutation,
    cashbookMemberMutation,
  ]);
}

export function DeleteConfirmationForm({
  onClose,
  onSuccess,
  id,
  companyId,
  itemName,
  type,
  bookId,
  userId,
}: DeleteConfirmationProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const { isLoading, execute, successMessage, errorMessage, isSoftDelete } =
    useDeleteHandler(type, bookId);

  const handleSuccess = useCallback(() => {
    toast.success(successMessage);
    onSuccess?.();
    onClose();
  }, [successMessage, onSuccess, onClose]);

  const handleError = useCallback(() => {
    toast.error(errorMessage);
  }, [errorMessage]);

  const handleDelete = useCallback(async () => {
    try {
      if (type === "cashbook-member") {
        if (!bookId || !userId) {
          throw new Error("Book ID and User ID are required");
        }
        await (
          execute as (
            id: string,
            companyId?: string,
            bookId?: string,
            userId?: string,
          ) => Promise<void>
        )(id, companyId, bookId, userId);
      } else {
        await execute(id, companyId);
      }
      handleSuccess();
    } catch {
      handleError();
    }
  }, [execute, id, companyId, handleSuccess, handleError, type, bookId, userId]);

  if (isSoftDelete) {
    const isTransaction = type === "transaction";

    return (
      <div className="space-y-6 w-full">
        <div className="p-4 bg-amber-50 rounded-md border border-amber-200 space-y-3">
          <h3 className="font-bold text-lg text-slate-900">
            {isTransaction ? "Move to recycle bin?" : "Move to deleted books?"}
          </h3>
          <p className="text-sm text-slate-600">
            {isTransaction ? (
              <>
                <span className="font-semibold">{itemName}</span> will be moved
                to the recycle bin. You can restore it from Settings → Recycle
                bin.
              </>
            ) : (
              <>
                <span className="font-semibold">{itemName}</span> will be moved to
                Deleted books. You can restore it within 15 days from Business
                Settings → Deleted books.
              </>
            )}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading
              ? "Moving…"
              : isTransaction
                ? "Move to recycle bin"
                : "Move to deleted books"}
          </Button>
        </div>
      </div>
    );
  }

  const isConfirmationTextValid = confirmationText === "DELETE PERMANENTLY";
  const isDeleteDisabled = isLoading || !isConfirmationTextValid;

  return (
    <div className="space-y-6 w-full">
      <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
        <h3 className="font-bold text-2xl mb-2">Warning</h3>
        <p className="text-red-500 font-medium">
          This action cannot be reversed. All data will be permanently deleted.
        </p>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            To confirm deletion of <span className="font-bold">&quot;{itemName}&quot;</span>,
            please type <span className="font-bold">&quot;DELETE PERMANENTLY&quot;</span> below:
          </p>

          <div className="space-y-2">
            <Label htmlFor="confirmation-text" className="text-sm font-medium">
              Type exactly: <span className="font-mono font-bold">DELETE PERMANENTLY</span>
            </Label>
            <Input
              id="confirmation-text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE PERMANENTLY here"
              className="font-mono border-red-200 focus:border-red-500 focus:ring-red-500"
              disabled={isLoading}
              autoFocus
            />
            {confirmationText && !isConfirmationTextValid && (
              <p className="text-red-500 text-sm">
                Text does not match. Please type exactly &quot;DELETE PERMANENTLY&quot;
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleteDisabled}
          className="min-w-[140px]"
        >
          {isLoading ? "Deleting..." : "Delete permanently"}
        </Button>
      </div>
    </div>
  );
}

// Keep backward-compatible export name used elsewhere
export { DeleteConfirmationForm as DeleteConfirmation };
