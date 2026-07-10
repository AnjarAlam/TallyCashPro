"use client";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetCompanyList } from "@/services/business.service";
import { useCopyPaymentModes } from "@/services/payment-mode.service";
import { CheckCircle2, Copy, Loader2, Building2, BookOpen, Search } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { APIS } from "@/constants/api";

interface CopyPaymentModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  targetBookId: string;
}

interface BookWithCompany {
  _id: string;
  name: string;
  description: string;
  companyName: string;
  companyId: string;
}

export function CopyPaymentModeDialog({
  open,
  onOpenChange,
  businessId,
  targetBookId,
}: CopyPaymentModeDialogProps) {
  const [selectedSourceBookId, setSelectedSourceBookId] = useState<
    string | null
  >(null);
  const [allBooks, setAllBooks] = useState<BookWithCompany[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all companies the user belongs to
  const { companyList, isCompanyListPending } = useGetCompanyList();
  const { copyPaymentModes, isCopyingPaymentModes } = useCopyPaymentModes();

  // Fetch books from all companies when dialog opens or company list changes
  useEffect(() => {
    const fetchAllBooks = async () => {
      if (!companyList || companyList.length === 0) {
        setAllBooks([]);
        return;
      }

      setIsLoadingBooks(true);
      try {
        // Fetch books for all companies in parallel
        const bookPromises = companyList.map(async (companyMember) => {
          try {
            const response = await axiosInstance.get(
              APIS.Cashbook.listByBusiness.Url(companyMember.company._id)
            );
            const books = response.data?.data || [];
            return books.map((book: any) => ({
              _id: book._id,
              name: book.name,
              description: book.description,
              companyName: companyMember.company.name,
              companyId: companyMember.company._id,
            }));
          } catch (error) {
            console.error(`Error fetching books for ${companyMember.company.name}:`, error);
            return [];
          }
        });

        const booksArrays = await Promise.all(bookPromises);
        const flattenedBooks = booksArrays.flat();
        setAllBooks(flattenedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setAllBooks([]);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    if (open) {
      fetchAllBooks();
    }
  }, [companyList, open]);

  const handleCopyPaymentModes = () => {
    if (!selectedSourceBookId) return;

    copyPaymentModes(
      {
        sourceBookId: selectedSourceBookId,
        targetBookId: targetBookId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedSourceBookId(null);
        },
      }
    );
  };

  // Filter out the current book from the list
  const availableBooks = allBooks.filter(
    (book) => book._id !== targetBookId
  );

  // Filter books based on search query
  const filteredBooks = availableBooks.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[450px] flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
            <div className="p-2 rounded-md bg-gray-100">
              <Copy className="h-4 w-4 text-gray-700" />
            </div>
            Copy Payment Modes
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            Select a book to copy all payment modes from
          </SheetDescription>
        </SheetHeader>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search books or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
            />
          </div>
        </div>

        {/* Scrollable Book List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {isLoadingBooks ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="p-3 rounded-md bg-gray-100 w-fit mx-auto mb-3">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">
                  {searchQuery
                    ? "No books found matching your search."
                    : "No other books available across your companies."}
                </p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <button
                  key={book._id}
                  onClick={() => setSelectedSourceBookId(book._id)}
                  className={`w-full p-3 rounded-md border transition-all text-left ${
                    selectedSourceBookId === book._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-gray-100 flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {book.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Building2 className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {book.companyName}
                        </span>
                      </div>
                      {book.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {book.description}
                        </p>
                      )}
                    </div>
                    {selectedSourceBookId === book._id && (
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-4 py-4 border-t bg-white mt-auto gap-2">
          <Button
            onClick={handleCopyPaymentModes}
            disabled={!selectedSourceBookId || isCopyingPaymentModes}
            className="w-full"
          >
            {isCopyingPaymentModes ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Copying...
              </>
            ) : (
              "Copy Payment Modes"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
