"use client";

import { Trash2, Edit, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaymentMode } from "@/interface";
import { SheetLayoutComp } from "@/components/modals";
import { useSheetControls } from "@/hooks";
import { EditPaymentModeForm } from "@/components/form";
import ModalLayout from "@/components/modals/modal-layout";
import { Card } from "@/components/ui/card";
import { DeleteConfirmation } from "@/components/form/delete-form";

interface PaymentModeCardProps {
  paymentMode: PaymentMode;
  onDelete: () => void;
  onEdit?: () => void;
}

export default function PaymentModeCard({
  paymentMode,
  onDelete,
  onEdit,
}: PaymentModeCardProps) {
  return (
    <div className="p-4 rounded-lg border flex items-center justify-between bg-white hover:cursor-pointer hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-blue-100 text-blue-600">
          <CreditCard className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-medium">{paymentMode.name}</h2>
            {paymentMode.isDefault && (
              <Badge className="bg-gray-100 text-gray-600">DEFAULT</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {paymentMode.description || "No description"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {paymentMode.status === "active" ? (
          <>
            {!paymentMode.isDefault && (
              <SheetLayoutComp
                sheetTitle="Edit Party"
                triggerContent={
                  <div className="text-blue-500 hover:text-blue-700">
                    <Edit className="h-4 w-4" />
                  </div>
                }
              >
                <EditPaymentModeSheetContent {...paymentMode} />
              </SheetLayoutComp>
            )}
            {!paymentMode.isDefault && (
              <ModalLayout
                trigger={
                  <div className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </div>
                }
              >
                <Card>
                  <DeleteConfirmation
                    id={paymentMode._id}
                    type="payment-mode"
                    itemName="Payment Mode"
                    onClose={() => {}}
                  />
                </Card>
              </ModalLayout>
            )}
          </>
        ) : (
          <Badge variant="outline" className="text-gray-500">
            Inactive
          </Badge>
        )}
      </div>
    </div>
  );
}

// Separate component to use the hook
function EditPaymentModeSheetContent(paymentMode: PaymentMode) {
  const { setOpen } = useSheetControls();

  return (
    <EditPaymentModeForm
      paymentMode={paymentMode}
      onSuccess={() => setOpen(false)}
    />
  );
}
