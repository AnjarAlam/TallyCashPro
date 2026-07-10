import { SheetLayoutComp } from "../modals";
import { QuickPartiesPage } from "../dashboard";

function PartySheetQuick({ bookId }: { bookId: string }) {
  return (
    <SheetLayoutComp
      triggerContent={
        <div className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full">
          Select Party
        </div>
      }
      sheetTitle={"Parties"}
      side="right"
    >
      <PartySheetContent bookId={bookId} />
    </SheetLayoutComp>
  );
}

// Separate component to use the hook
function PartySheetContent({ bookId }: { bookId: string }) {
  return (
    <div className="px-2">
      <QuickPartiesPage bookId={bookId} onValueChange={() => {}} />
    </div>
  );
}

export default PartySheetQuick;
