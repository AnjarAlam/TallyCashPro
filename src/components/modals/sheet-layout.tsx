// components/SheetLayoutComp.tsx
"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ReactNode, useState, createContext, useContext } from "react";

interface SheetLayoutCompProps {
  triggerContent: ReactNode;
  sheetTitle: string;
  sheetDescription?: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

// Create context for sheet controls
const SheetContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

// Custom hook for children components to control the sheet
export const useSheetControls = () => {
  return useContext(SheetContext);
};

export default function SheetLayoutComp({
  triggerContent,
  sheetTitle,
  sheetDescription,
  children,
  side = "right",
}: SheetLayoutCompProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <SheetContext.Provider value={{ open, setOpen }}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="w-full">
            <button className="w-full ">{triggerContent}</button>
          </SheetTrigger>
          <SheetContent
            side={side}
            className="overflow-y-scroll pb-4 w-full sm:min-w-1/2  lg:min-w-1/3 duration-75 transition-all"
          >
            <SheetHeader>
              <SheetTitle>{sheetTitle}</SheetTitle>
              {sheetDescription && (
                <SheetDescription>{sheetDescription}</SheetDescription>
              )}
            </SheetHeader>
            <div>{children}</div>
          </SheetContent>
        </Sheet>
      </SheetContext.Provider>
    </div>
  );
}
