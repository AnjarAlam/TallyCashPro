import { SheetProps } from "@/interface";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddPaymentModeForm } from "../form";
import { SheetLayoutComp } from "../modals";
import { useSheetControls } from "@/hooks";

interface PaymentModeSheetProps extends SheetProps {
  cashbookId?: string;
}

function PaymentModeSheet({ businessId, cashbookId }: PaymentModeSheetProps) {
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
        <PaymentModeSheetContent businessId={businessId} cashbookId={cashbookId} />
      </SheetLayoutComp>
    </div>
  );
}

// Separate component to use the hook
function PaymentModeSheetContent({ businessId, cashbookId }: { businessId: string; cashbookId?: string }) {
  const { setOpen } = useSheetControls();

  return (
    <AddPaymentModeForm
      businessId={businessId}
      cashbookId={cashbookId}
      onSuccess={() => setOpen(false)}
    />
  );
}

export default PaymentModeSheet;
