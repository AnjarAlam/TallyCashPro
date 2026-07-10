import { useSheetControls } from "@/hooks";
import { SheetProps } from "@/interface";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddBusinessMemberForm } from "../form";
import { SheetLayoutComp } from "../modals";

function BusinessMemberSheet({ businessId }: SheetProps) {
  return (
    <div className="relative">
      <SheetLayoutComp
        triggerContent={
          <IconButton
            text="New Member"
            icon={Plus}
            iconPosition="right"
            onClick={() => console.log("Clicked!")}
          />
        }
        sheetTitle="Create Member"
        side="right"
      >
        <BusinessMemberContent businessId={businessId} />
      </SheetLayoutComp>
    </div>
  );
}

// Separate component to use the hook
function BusinessMemberContent({ businessId }: { businessId: string }) {
  const { setOpen } = useSheetControls();

  return (
    <AddBusinessMemberForm
      businessId={businessId}
      onClose={() => setOpen(false)}
    />
  );
}
export default BusinessMemberSheet;
