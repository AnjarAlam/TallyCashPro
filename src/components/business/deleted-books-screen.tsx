"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate, hasPermission } from "@/lib";
import { getBusinessSettingsPermissions } from "@/lib/business-settings-permissions";
import {
  useGetRecycleBinBooks,
  useRestoreCashbook,
} from "@/services/cashbook.service";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardFooter } from "@/components/ui/card";
import { DeleteConfirmationForm } from "@/components/form/delete-form";
import { ArchiveRestore, Trash2, RefreshCw, BookOpen } from "lucide-react";

interface DeletedBooksScreenProps {
  businessId: string;
  refreshTrigger?: number;
}

export function DeletedBooksScreen({ businessId, refreshTrigger }: DeletedBooksScreenProps) {
  const [permanentDeleteBook, setPermanentDeleteBook] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: userRole, isLoading: isLoadingRole } =
    useCompanyMemberRole(businessId);
  const {
    deletedBooks,
    isDeletedBooksPending,
    isDeletedBooksError,
    deletedBooksError,
    refetchDeletedBooks,
  } = useGetRecycleBinBooks(businessId);
  const { restoreCashbook, isRestoringCashbook } = useRestoreCashbook();

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      refetchDeletedBooks();
    }
  }, [refreshTrigger, refetchDeletedBooks]);

  const companyRole = userRole?.data?.companyRole || "staff";
  const { hasSettingsAccess } = getBusinessSettingsPermissions(companyRole);
  const canManageBooks = hasPermission(
    { businessRole: companyRole },
    "crud_cashbook",
    "D",
  );

  if (isLoadingRole) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!hasSettingsAccess) {
    return (
      <Alert>
        <AlertTitle>Access denied</AlertTitle>
        <AlertDescription>
          You do not have permission to view deleted books.
        </AlertDescription>
        <Button variant="outline" className="mt-3" asChild>
          <Link href={`/dashboard/business/${businessId}/settings`}>
            Back to settings
          </Link>
        </Button>
      </Alert>
    );
  }

  if (isDeletedBooksError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load deleted books</AlertTitle>
        <AlertDescription>
          {deletedBooksError?.message || "Unknown error"}
        </AlertDescription>
        <Button variant="outline" className="mt-3" onClick={() => refetchDeletedBooks()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-4 p-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Books stay here for 15 days, then are permanently removed automatically.
        </p>
      </div>

      {isDeletedBooksPending ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : deletedBooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">No deleted books</p>
          <p className="text-sm text-slate-500 mt-1">
            When you delete a book from the business, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {deletedBooks.map((book) => (
            <div
              key={book._id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{book.name}</p>
                {book.description ? (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {book.description}
                  </p>
                ) : null}
                {book.deletedAt ? (
                  <p className="text-xs text-slate-400 mt-2">
                    Deleted {formatDate(book.deletedAt, "Do-MMM-YYYY, h:mm A")}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {canManageBooks ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 flex-1"
                      disabled={isRestoringCashbook}
                      onClick={() =>
                        restoreCashbook({
                          companyId: businessId,
                          bookId: book._id,
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
                      onClick={() =>
                        setPermanentDeleteBook({ id: book._id, name: book.name })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete forever
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {permanentDeleteBook ? (
        <Dialog
          open={!!permanentDeleteBook}
          onOpenChange={(open) => !open && setPermanentDeleteBook(null)}
        >
          <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>Permanently delete book</DialogTitle>
            </DialogHeader>
            <Card className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <CardFooter className="w-full p-0">
                <DeleteConfirmationForm
                  onClose={() => setPermanentDeleteBook(null)}
                  id={permanentDeleteBook.id}
                  companyId={businessId}
                  type="cashbook-permanent"
                  itemName={permanentDeleteBook.name}
                />
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
