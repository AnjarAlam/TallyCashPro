"use client";

import { AddBusinessForm } from "@/components/form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
export default function AddBusinessCard() {
  const [open, setOpen] = useState(false);
  return (
    // <Link href={paths.dashboard.business.new} passHref>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="group relative flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/20 border  p-4 transition-all duration-75 border-dashed border-blue-500 hover:shadow-md hover:bg-primary/5 dark:hover:bg-white/5 h-full  hover:cursor-pointer ">
          <div className="flex items-center sm:w-3/4 w-full">
            {/* Left Tag Icon */}
            <div className="sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full  bg-primary/10 dark:bg-white/10 h-min">
              <Plus className="w-6 h-6 font-bold text-primary dark:text-white" />
            </div>

            {/* Main content - takes up available space */}
            <div className="flex-1 flex flex-col space-y-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate">
                Add New Business
              </h3>
              <p className="text-sm font-medium text-gray-500 line-clamp-2">
                Fill in the Details to Register Your Business
              </p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      {/* // </Link> */}
      <SheetContent
        side="right"
        // showCloseButton={false}
        className="overflow-y-scroll pb-4 w-full sm:min-w-1/2  lg:min-w-1/3 duration-75 transition-all"
      >
        <DialogTitle />
        <AddBusinessForm onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
