import { useSheetControls } from "@/hooks";
import { SheetProps } from "@/interface";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddBusinessMemberForm, AddMemberToBookForm } from "../form";
import { SheetLayoutComp } from "../modals";

function BookMemberSheet({ businessId, cashbookId }: SheetProps) {
  return (
    <div className="relative">
      <SheetLayoutComp
        triggerContent={
          <IconButton
            text="Assign Member"
            icon={Plus}
            iconPosition="right"
            onClick={() => console.log("Clicked!")}
          />
        }
        sheetTitle="Assign Book Member"
        side="right"
      >
        <BusinessMemberContent
          businessId={businessId}
          cashbookId={cashbookId || ""}
        />
      </SheetLayoutComp>
    </div>
  );
}

// Separate component to use the hook
function BusinessMemberContent({
  businessId,
  cashbookId,
}: {
  businessId: string;
  cashbookId: string;
}) {
  const { setOpen } = useSheetControls();

  return (
    <AddMemberToBookForm
      companyId={businessId}
      bookId={cashbookId || ""}
      onClose={() => setOpen(false)}
    />
  );
}
export default BookMemberSheet;
