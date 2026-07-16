import { SheetProps } from "@/interface";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddCategoryForm } from "../form";
import { SheetLayoutComp } from "../modals";
import { useSheetControls } from "@/hooks";
import AddCashbookForm from "../form/cashbook/add-cashbook";

function CashbookSheet({ businessId }: SheetProps) {
  return (
    <div className="relative">
      <SheetLayoutComp
        triggerContent={
          <IconButton
            text="New Book"
            icon={Plus}
            iconPosition="right"
            onClick={() => console.log("Clicked!")}
          />
        }
        sheetTitle="Create Cashbook"
        side="right"
      >
        <CashbookSheetContent businessId={businessId} />
      </SheetLayoutComp>
    </div>
  );
}

// Separate component to use the hook
function CashbookSheetContent({ businessId }: { businessId: string }) {
  const { setOpen } = useSheetControls();

  return (
    <AddCashbookForm businessId={businessId} showHeader={false} onClose={() => setOpen(false)} />
  );
}
export default CashbookSheet;
