import { SheetProps } from "@/interface";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddCategoryForm } from "../form";
import { SheetLayoutComp } from "../modals";
import { useSheetControls } from "@/hooks";

interface CategorySheetProps extends SheetProps {
  cashbookId?: string;
}

function CategorySheet({ businessId, cashbookId }: CategorySheetProps) {
  return (
    <div className="relative">
      <SheetLayoutComp
        triggerContent={
          <IconButton
            text="New Category"
            icon={Plus}
            iconPosition="right"
            onClick={() => console.log("Clicked!")}
          />
        }
        sheetTitle="Category List"
        side="right"
      >
        <CategorySheetContent businessId={businessId} cashbookId={cashbookId} />
      </SheetLayoutComp>
    </div>
  );
}

// Separate component to use the hook
function CategorySheetContent({ businessId, cashbookId }: { businessId: string; cashbookId?: string }) {
  const { setOpen } = useSheetControls();

  return (
    <AddCategoryForm businessId={businessId} cashbookId={cashbookId} onSuccess={() => setOpen(false)} />
  );
}
export default CategorySheet;
