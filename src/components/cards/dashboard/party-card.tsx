"use client";

import { EditPartyForm } from "@/components/form";
import { DeleteConfirmation } from "@/components/form/delete-form";
import { SheetLayoutComp } from "@/components/modals";
import ModalLayout from "@/components/modals/modal-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardFooter } from "@/components/ui/card";
import { useSheetControls } from "@/hooks";
import { Party } from "@/interface";
import { cn } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";

interface PartyCardProps {
  party: Party;
  bookId: string;
  onDelete: () => void;
  onEdit?: () => void;
  onClick?: (e: any) => void;
  showActions?: boolean;
}

export default function PartyCard({
  party,
  bookId,
  onDelete,
  onClick,
  showActions = true,
}: PartyCardProps) {
  return (
    <div
      onClick={() => onClick?.(party.name)}
      className="p-4 rounded-lg border flex items-center justify-between gap-6 bg-white hover:cursor-pointer hover:shadow-md"
    >
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="w-10 h-10">
          <AvatarFallback
            className={cn(
              "font-bold",
              party.type === "Customer"
                ? "bg-blue-100 text-blue-600"
                : "bg-amber-100 text-amber-600"
            )}
          >
            {party.type === "Customer" ? "C" : "S"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{party.name}</h2>
          <p className="text-xs text-gray-500">
            {party.type} • {party.status}
          </p>
        </div>
      </div>
      {showActions && (
        <SheetLayoutComp
          sheetTitle="Edit Party"
          triggerContent={
            <div className="text-red-500 hover:text-red-700">
              <Edit2 className="h-4 w-4" />
            </div>
          }
        >
          <EditPartySheetContent party={party} bookId={bookId} />
        </SheetLayoutComp>
      )}
      {showActions && party.status === "active" && (
        <ModalLayout
          trigger={
            <div className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </div>
          }
        >
          <Card>
            <CardFooter>
              <DeleteConfirmation
                type="party"
                id={party._id}
                bookId={bookId}
                onClose={() => {}}
                itemName={party.name}
              />
            </CardFooter>
          </Card>
        </ModalLayout>
      )}
    </div>
  );
}

function EditPartySheetContent({
  party,
  bookId,
}: {
  party: Party;
  bookId: string;
}) {
  const { setOpen } = useSheetControls();

  return (
    <EditPartyForm
      party={party}
      bookId={bookId}
      onSuccess={() => setOpen(false)}
    />
  );
}
