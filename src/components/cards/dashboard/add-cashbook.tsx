"use client";

import AddCashbookForm from "@/components/form/cashbook/add-cashbook";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddCashbookCard({
  businessId,
   
}: {
  businessId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div className="group relative flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/20 border p-4 transition-all duration-75 border-dashed border-blue-500 hover:shadow-md hover:bg-primary/5 dark:hover:bg-white/5 h-full">
          <div className="flex items-center sm:w-3/4 w-full">
            {/* Left Tag Icon */}
            <div className="sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full bg-primary/10 dark:bg-white/10 h-min">
              <Plus className="w-6 h-6 font-bold text-primary dark:text-white" />
            </div>

            {/* Main content - takes up available space */}
            <div className="flex-1 flex flex-col space-y-1 min-w-0 text-start">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate">
                Add New Book
              </h3>
              <p className="text-sm font-medium text-gray-500 line-clamp-2">
                Create a new Book to track your financial transactions
              </p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:min-w-1/2  lg:min-w-1/3 duration-75 transition-all"
      >
        <SheetHeader>
          <SheetTitle>Add Book</SheetTitle>
        </SheetHeader>
        {/* <SheetDescription> */}
        <AddCashbookForm
          businessId={businessId}
          showHeader={false}
          onClose={() => setOpen(false)}
        />
        {/* </SheetDescription> */}
      </SheetContent>
    </Sheet>
  );
}
