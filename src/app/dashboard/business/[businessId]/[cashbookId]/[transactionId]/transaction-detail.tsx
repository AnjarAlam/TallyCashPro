// app/dashboard/business/[businessId]/[cashbookId]/[transactionId]/transaction-detail.tsx

"use client";
// components/TransactionDetail.tsx

import ErrorMessage from "@/components/customUI/error-message";
import { EditTransactionForm } from "@/components/form";
import { SheetLayoutComp } from "@/components/modals";
import { TransactionAuditLogs } from "@/components/TransictionAuditlogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fieldConfigurations } from "@/config";
import { TransactionFormProvider } from "@/hooks/use-transaction-hook";
import { formatCurrency, formatDate } from "@/lib";
import { useGetTransaction } from "@/services/transaction.service";
import { Transaction } from "@/interface";
import {
  Loader2,
  CreditCard,
  Wallet,
  Utensils,
  Film,
  Edit,
  Eye,
  Download,
  Paperclip,
  ImageIcon,
  FileIcon,
  ExternalLink,
  Check,
  Circle,
} from "lucide-react";
import { useState } from "react";
import { TransferActions } from "@/components/actions/transfer-actions";

interface Attachment {
  _id: string;
  key: string;
  url: string;
  fileType: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionData {
  _id: string;
  user: string;
  book: string;
  type: "cash_in" | "cash_out";
  subType?: string;
  status?: string;
  targetBookId?: string;
  amount: number;
  party: string;
  category: string;
  paymentMode: string;
  partyType: "customer" | "supplier"
  remark: string;
  date: string;
  time: string;
  description: string;
  attachments: Attachment[];
  createdBy: string;
  updatedFlag: boolean;
  updatedBy: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const TransactionDetail = ({
  transactionID,
  businessId,
  cashbookId,
}: {
  transactionID: string;
  businessId: string;
  cashbookId: string;
}) => {
  const {
    transactionData,
    isTransactionPending,
    isTransactionError,
    transactionError,
    refetchTransaction,
  } = useGetTransaction(transactionID);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showAttachments, setShowAttachments] = useState(true);

  if (isTransactionPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isTransactionError) {
    return (
      <ErrorMessage
        message={transactionError?.message || "Failed to load transaction"}
        onRetry={refetchTransaction}
      />
    );
  }

  if (!transactionData) {
    return <div className="text-center py-10">No transaction data found</div>;
  }

  const transaction = transactionData as Transaction;
  const isCashIn = transaction.type === "cash_in";
  const amountColor = isCashIn ? "text-green-600" : "text-red-600";
  const hasAttachments = transaction.attachments && transaction.attachments.length > 0;

  // Category icons mapping
  const categoryIcons = {
    Entertainment: <Film className="w-5 h-5" />,
    Groceries: <Utensils className="w-5 h-5" />,
    Food: <Utensils className="w-5 h-5" />,
    default: <Wallet className="w-5 h-5" />,
  };

  // Payment method icons
  const paymentIcons = {
    "Credit Card": <CreditCard className="w-5 h-5" />,
    Zelle: <Wallet className="w-5 h-5" />,
    default: <Wallet className="w-5 h-5" />,
  };

  const getIcon = (type: string, mapping: any) => {
    return mapping[type] || mapping["default"];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleViewImage = (index: number) => {
    setSelectedImageIndex(index);
    setShowImagePreview(true);
  };

  const handleDownloadFile = (attachment: Attachment, index: number) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = `Image ${index + 1}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const defaultVisibleFields = {
    category: {
      visible: true,
      config: fieldConfigurations.category,
    },
    partyName: {
      visible: true,
      config: fieldConfigurations.partyNAme,
    },
    otherDetail: {
      visible: true,
      config: fieldConfigurations.otherDetail,
    },
    paymentMode: {
      visible: true,
      config: fieldConfigurations.category,
    },
    date: {
      visible: true,
      config: fieldConfigurations.category,
    },
    remark: {
      visible: true,
      config: fieldConfigurations.category,
    },
    attachments: {
      visible: true,
      config: fieldConfigurations.category,
    },
  };

  return (
    <>
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with gradient */}
        <div
          className={`bg-gradient-to-r ${
            isCashIn ? "from-green-50 to-green-100" : "from-red-50 to-red-100"
          } p-6`}
        >
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="secondary" className="mb-2">
                {transaction.type}
              </Badge>
              <h1 className={`text-4xl font-bold ${amountColor}`}>
                {formatCurrency(transaction.amount)}
              </h1>
            </div>
            <div className="bg-white p-2 rounded-full shadow-sm">
              {getIcon(transaction.category, categoryIcons)}
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-2">
            {transaction.category}
          </h2>
          {transaction.description && (
            <p className="text-gray-600 mt-2">{transaction.description}</p>
          )}
        </div>

        {/* Transaction details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DetailCard
              label="Payment Method"
              value={
                <div className="flex items-center gap-2">
                  {getIcon(transaction.paymentMode, paymentIcons)}
                  <span>{transaction.paymentMode}</span>
                </div>
              }
            />
            <DetailCard
              label="Date"
              value={formatDate(transaction.date, "DD MMM, YYYY")}
            />
          </div>

          {transaction.party && (
            <DetailCard
              label="Party"
              value={<span className="font-medium">{transaction.party}</span>}
            />
          )}

          {transaction.remark && (
            <DetailCard label="Narration" value={transaction.remark} />
          )}

          {/* Attachments Section */}
          {hasAttachments && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Attachments</h3>
                  <Badge variant="outline" className="ml-2">
                    {transaction.attachments.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAttachments(!showAttachments)}
                >
                  {showAttachments ? 'Hide' : 'Show'}
                </Button>
              </div>

              {showAttachments && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {transaction.attachments.map((attachment, index) => {
                    const isImage = attachment.fileType === 'image' || attachment.mimeType.startsWith('image/');
                    
                    return (
                      <div
                        key={attachment._id}
                        className="border rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
                      >
                        {/* For images: Show small thumbnail on left */}
                        {isImage ? (
                          <div className="flex">
                            {/* Left: Small thumbnail image */}
                            <div 
                              className="w-24 h-24 flex-shrink-0 bg-gray-100 cursor-pointer relative group"
                              onClick={() => handleViewImage(index)}
                            >
                              <img
                                src={attachment.url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Failed to load image:', attachment.url);
                                  e.currentTarget.src = '/placeholder-image.png';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>

                            {/* Right: File info */}
                            <div className="flex-1 p-3">
                              <div className="flex items-start gap-1 mb-1">
                                <span className="text-sm font-medium">
                                  Image {index + 1}
                                </span>
                                <span className="text-green-500">
                                  <Check className="w-3 h-3" />
                                </span>
                                <span className="text-gray-400">
                                  <Circle className="w-3 h-3" fill="currentColor" />
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Image</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                  {formatFileSize(attachment.size)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 flex-1"
                                  onClick={() => handleViewImage(index)}
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                  
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3"
                                  onClick={() => handleOpenInNewTab(attachment.url)}
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* For non-image files: Keep original layout */
                          <div className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <FileIcon className="w-8 h-8 text-gray-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium truncate">
                                    File {index + 1}
                                  </span>
                                  <span className="text-green-500">
                                    <Check className="w-3 h-3" />
                                  </span>
                                  <span className="text-gray-400">
                                    <Circle className="w-3 h-3" fill="currentColor" />
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500">
                                    {attachment.fileType}
                                  </span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-500">
                                    {formatFileSize(attachment.size)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 flex-1"
                                onClick={() => handleDownloadFile(attachment, index)}
                              >
                                <Download className="w-3.5 h-3.5 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Transaction Metadata */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Transaction Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Transaction ID:</span>
                <p className="font-mono text-xs truncate" title={transaction._id}>
                  {transaction._id}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <p>{formatDate(transaction.createdAt, "DD MMM, YYYY hh:mm A")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex flex-col gap-4">
            {/* Transfer Actions for Pending Transfers */}
            {transaction.subType === "transfer" && 
             transaction.status === "pending" && 
             transaction.type === "cash_in" && (
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-amber-900">Transfer Action Required:</span>
                  <span className="text-sm text-amber-800">Approve or reject this transfer request</span>
                </div>
                <TransferActions
                  transferId={transaction._id}
                  status={transaction.status as "pending" | "approved" | "rejected"}
                  sourceBookId={transaction.book}
                  targetBookId={transaction.targetBookId || ""}
                  amount={transaction.amount}
                  currency={"USD"}
                  canApprove={true}
                  canReject={true}
                />
              </div>
            )}

            {/* Edit Transaction Button */}
            {/* <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
              <SheetLayoutComp
                triggerContent={
                  <div className="flex items-center justify-center p-3 bg-white rounded-md text-black border gap-3 hover:cursor-pointer">
                    <Edit strokeWidth={1} className="h-5 w-5" /> Edit Transaction
                  </div>
                }
                sheetTitle={"Edit Transaction"}
              >
                <EditTransactionForm
               
                  transaction={transaction}
                  businessId={businessId}
                  bookId={cashbookId}
                />
              </SheetLayoutComp>
            </TransactionFormProvider> */}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Image Preview
              </span>
              {selectedImageIndex !== -1 && transaction.attachments[selectedImageIndex] && (
                <span className="text-sm text-gray-500 font-normal">
                  Image {selectedImageIndex + 1} of {transaction.attachments.length}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedImageIndex !== -1 && transaction.attachments[selectedImageIndex] && (
            <div className="space-y-4">
              <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden min-h-[400px]">
                <img
                  src={transaction.attachments[selectedImageIndex].url}
                  alt={`Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    console.error('Failed to load image:', transaction.attachments[selectedImageIndex].url);
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">
                    Image {selectedImageIndex + 1}
                  </p>
                  <p className="text-gray-500">
                    {formatFileSize(transaction.attachments[selectedImageIndex].size)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenInNewTab(transaction.attachments[selectedImageIndex].url)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open in new tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadFile(transaction.attachments[selectedImageIndex], selectedImageIndex)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Navigation buttons for multiple images */}
              {transaction.attachments.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedImageIndex === 0}
                    onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedImageIndex === transaction.attachments.length - 1}
                    onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImagePreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


                      {/* Recent Activity (Audit Logs) */}
          <div className="border-t pt-20">
            <TransactionAuditLogs
              transactionId={transactionID}
              businessId={businessId}
              cashbookId={cashbookId}
              transactionType={transaction.type}
              transactionAmount={transaction.amount}
            />
          </div>
    </>
  );
};

const DetailCard = ({
  label,
  value,
  valueClassName = "",
  isMonospace = false,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  isMonospace?: boolean;
}) => (
  <div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <div className={`${isMonospace ? "font-mono" : ""} ${valueClassName}`}>
      {value}
    </div>
  </div>
);

export default TransactionDetail;