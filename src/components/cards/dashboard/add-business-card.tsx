"use client";

import { CreateBusinessForm } from "@/components/form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddBusinessCard() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="w-[92%] sm:min-w-[536px] max-h-[90vh] overflow-y-auto p-5 bg-white rounded-2xl border border-slate-200/50 shadow-2xl scrollbar-none">
        <DialogTitle className="sr-only">Add New Business</DialogTitle>
        <CreateBusinessForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
