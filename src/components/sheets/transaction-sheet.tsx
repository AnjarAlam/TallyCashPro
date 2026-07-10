import { SheetProps } from "@/interface";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddPaymentModeForm } from "../form";
import { SheetLayoutComp } from "../modals";
import { useSheetControls } from "@/hooks";

function TransactionSheet({ businessId }: SheetProps) {
  return (
    <div className="relative">
      {/* Added relative container */}
      <SheetLayoutComp
        triggerContent={
          <IconButton
            text="New Payment Mode"
            icon={Plus}
            iconPosition="right"
            onClick={() => console.log("Clicked!")}
          />
        }
        sheetTitle={"Payment Mode"}
        side="right"
      >
        <TransactionSheetContent businessId={businessId} />
      </SheetLayoutComp>
    </div>
  );
}

// Separate component to use the hook
function TransactionSheetContent({ businessId }: { businessId: string }) {
  const { setOpen } = useSheetControls();

  return (
    <AddPaymentModeForm
      businessId={businessId}
      onSuccess={() => setOpen(false)}
    />
  );
}

export default TransactionSheet;
