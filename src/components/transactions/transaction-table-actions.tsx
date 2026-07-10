"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/interface";
import { fieldConfigurations } from "@/config";
import { TransactionFormProvider } from "@/hooks/use-transaction-hook";
import { EditTransactionForm } from "@/components/form";
import { DeleteConfirmation } from "@/components/form/delete-form";
import { Card, CardFooter } from "@/components/ui/card";
import { useBusiness } from "@/providers/business-cashbook-provider";

const defaultVisibleFields = {
  category: { visible: true, config: fieldConfigurations.category },
  partyName: { visible: true, config: fieldConfigurations.partyNAme },
  otherDetail: { visible: true, config: fieldConfigurations.otherDetail },
  paymentMode: { visible: true, config: fieldConfigurations.category },
  date: { visible: true, config: fieldConfigurations.category },
  remark: { visible: true, config: fieldConfigurations.category },
  attachments: { visible: true, config: fieldConfigurations.category },
};

interface TransactionTableActionsProps {
  transaction: Transaction;
  canEdit?: boolean;
  canDelete?: boolean;
  showEditDelete?: boolean;
}

export function TransactionTableActions({
  transaction,
  canEdit = false,
  canDelete = false,
  showEditDelete = true,
}: TransactionTableActionsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { companyInfo } = useBusiness();
  const businessId = companyInfo?._id || "";

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canShowEdit =
    canEdit && showEditDelete && transaction.subType !== "transfer";
  const canShowDelete = canDelete && showEditDelete;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            onClick={() => router.push(`${pathname}/${transaction._id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          {canShowEdit && (
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {canShowDelete && (
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canShowEdit && (
        <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <SheetContent
              side="right"
              className="overflow-y-auto pb-4 w-full sm:min-w-1/2 lg:min-w-1/3"
            >
              <SheetHeader>
                <SheetTitle>Edit Transaction</SheetTitle>
              </SheetHeader>
              <EditTransactionForm
                transaction={transaction}
                businessId={businessId}
                bookId={transaction.book}
              />
            </SheetContent>
          </Sheet>
        </TransactionFormProvider>
      )}

      {canShowDelete && (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent
            showCloseButton={false}
            className="bg-transparent p-0 border-none shadow-none"
          >
            <DialogTitle />
            <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <CardFooter className="w-full p-0">
                <DeleteConfirmation
                  onClose={() => setDeleteOpen(false)}
                  id={transaction._id}
                  type="transaction"
                  itemName={transaction.party || "Transaction"}
                  companyId={transaction.book}
                />
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
