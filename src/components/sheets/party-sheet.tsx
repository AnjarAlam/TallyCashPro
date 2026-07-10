import { useSheetControls } from "@/hooks";
import { Plus } from "lucide-react";
import { IconButton } from "../buttons";
import { AddPartyForm } from "../form";
import { SheetLayoutComp } from "../modals";

function PartySheet({ bookId }: { bookId: string }) {
  return (
    <SheetLayoutComp
      triggerContent={
        <IconButton
          text="New Party"
          icon={Plus}
          iconPosition="right"
          onClick={() => console.log("Clicked!")}
        />
      }
      sheetTitle={"Party List"}
      side="right"
    >
      <PartySheetContent bookId={bookId} />
    </SheetLayoutComp>
  );
}

function PartySheetContent({ bookId }: { bookId: string }) {
  const { setOpen } = useSheetControls();

  return <AddPartyForm bookId={bookId} onSuccess={() => setOpen(false)} />;
}

export default PartySheet;
