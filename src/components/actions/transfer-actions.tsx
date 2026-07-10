// components/actions/transfer-actions.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useApproveTransfer,
  useRejectTransfer,
} from "@/services/transfer.service";

interface TransferActionsProps {
  transferId: string;
  status: "pending" | "approved" | "rejected";
  sourceBookId: string;
  targetBookId: string;
  amount: number;
  currency: string;
  canApprove?: boolean;
  canReject?: boolean;
}

export function TransferActions({
  transferId,
  status,
  sourceBookId,
  targetBookId,
  amount,
  currency,
  canApprove = true,
  canReject = true,
}: TransferActionsProps) {
  const { toast } = useToast();
  const approveTransfer = useApproveTransfer();
  const rejectTransfer = useRejectTransfer();

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = () => {
    if (!approveTransfer) {
      toast({
        title: "Error",
        description: "Transfer approval service is not available",
        // variant: "destructive",
      });
      return;
    }

    approveTransfer.mutate(
      {
        transferId,
        data: { approvalReason: approvalReason || undefined },
      },
      {
        onSuccess: (data) => {
          setShowApproveDialog(false);
          setApprovalReason("");
          toast({
            title: "Success",
            description: data.message || "Transfer approved successfully",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || error.message || "Failed to approve transfer",
          });
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectTransfer) {
      toast({
        title: "Error",
        description: "Transfer rejection service is not available",
      });
      return;
    }

    rejectTransfer.mutate(
      {
        transferId,
        data: { rejectionReason: rejectionReason || undefined },
      },
      {
        onSuccess: (data) => {
          setShowRejectDialog(false);
          setRejectionReason("");
          toast({
            title: "Success",
            description: data.message || "Transfer rejected successfully",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || error.message || "Failed to reject transfer",
          });
        },
      }
    );
  };

  // If not pending or user doesn't have permission, don't show actions
  if (status !== "pending" || (!canApprove && !canReject)) {
    return (
      <div className="text-sm text-gray-500 capitalize">

      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {canApprove && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 hover:border-green-300"
            onClick={() => setShowApproveDialog(true)}
            disabled={approveTransfer?.isPending}
          >
            {approveTransfer?.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            Accept
          </Button>
        )}

        {canReject && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
            onClick={() => setShowRejectDialog(true)}
            disabled={rejectTransfer?.isPending}
          >
            {rejectTransfer?.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            Reject
          </Button>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve Transfer</DialogTitle>
            <DialogDescription>
              Approve transfer of {currency} {amount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Amount:</span>
                <p className="font-medium">{currency} {amount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium text-amber-600">Pending</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approval-reason">Approval Reason (Optional)</Label>
              <Textarea
                id="approval-reason"
                placeholder="Enter reason for approval..."
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                This will be recorded in the audit log
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={approveTransfer?.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approveTransfer?.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {approveTransfer?.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
            <DialogDescription>
              Reject transfer of {currency} {amount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Amount:</span>
                <p className="font-medium">{currency} {amount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium text-amber-600">Pending</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejection-reason" className="text-gray-700">
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="resize-none"
                required
              />
              <p className="text-xs text-gray-500">
                This will be recorded in the audit log
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={rejectTransfer?.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejectTransfer?.isPending || !rejectionReason.trim()}
              variant="destructive"
            >
              {rejectTransfer?.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}