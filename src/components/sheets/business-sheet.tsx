"use client";
import { useSheetControls } from "@/hooks";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddBusinessForm } from "../form";
import { SheetLayoutComp } from "../modals";
import { ReactNode } from "react";

interface BusinessSheetProps {
  triggerComp?: ReactNode;
}

function BusinessSheet({ triggerComp }: BusinessSheetProps) {
  const defaultTrigger = (
    <IconButton
      text="New Business"
      icon={Plus}
      iconPosition="right"
      onClick={() => console.log("Clicked!")}
    />
  );

  return (
    <div className="relative">
      <SheetLayoutComp
        triggerContent={triggerComp || defaultTrigger}
        sheetTitle="Create Business"
        side="right"
      >
        <BusinessSheetContent />
      </SheetLayoutComp>
    </div>
  );
}

// Separate component to use the hook
function BusinessSheetContent() {
  const { setOpen } = useSheetControls();

  return <AddBusinessForm onClose={() => setOpen(false)} />;
}

export default BusinessSheet;
