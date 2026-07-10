// components/modals/create-transfer-modal.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  CreateTransferForm,
  CreateTransferFormProps,
} from "@/components/form/transfer/create-transfer-form";

export type { CreateTransferFormProps };
export { CreateTransferForm };

interface CreateTransferModalProps extends CreateTransferFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTransferModal({
  isOpen,
  onClose,
  businessId,
  cashbookId,
  currentCurrency,
  currentCashbookName,
}: CreateTransferModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <CreateTransferForm
          businessId={businessId}
          cashbookId={cashbookId}
          currentCurrency={currentCurrency}
          currentCashbookName={currentCashbookName}
          onCancel={onClose}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
