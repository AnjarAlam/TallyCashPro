"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeftRight,
  BookOpen,
  Briefcase,
  Building2,
  CalendarIcon,
  Eye,
  FileText,
  Infinity,
  Loader2,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getCurrencyInfo } from "@/constants/currency";
import {
  useCreateTransfer,
  useGetAllUserBooksForTransfer,
  TransferTargetBook,
} from "@/services/transfer.service";
import { useGetPaymentModesByBook } from "@/services/payment-mode.service";
import { useUploadToS3 } from "@/services/file-upload.service";

type BusinessFilter = "all" | "same" | "other";

interface Attachment {
  url: string;
  key: string;
  fileType: string;
  mimeType: string;
  size: number;
}

interface UploadedFile {
  file: File;
  previewUrl: string;
  isImage: boolean;
  uploaded?: boolean;
  attachment?: Attachment;
}

export interface CreateTransferFormProps {
  businessId: string;
  cashbookId: string;
  currentCurrency: string;
  currentCashbookName: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

const getDateWithoutTime = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const isValidDecimalInput = (value: string) =>
  value === "" || /^\d*\.?\d*$/.test(value);

type TransferFormErrors = {
  targetBookId?: string;
  amount?: string;
  targetAmount?: string;
  paymentMode?: string;
  date?: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-600 mt-1">{message}</p>;
}

const businessFilterOptions: {
  id: BusinessFilter;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "all", label: "All Books", icon: <Infinity className="h-4 w-4" /> },
  { id: "same", label: "Same Business", icon: <Building2 className="h-4 w-4" /> },
  { id: "other", label: "Other Business", icon: <Briefcase className="h-4 w-4" /> },
];

export function CreateTransferForm({
  businessId,
  cashbookId,
  currentCurrency,
  currentCashbookName,
  onCancel,
  onSuccess,
}: CreateTransferFormProps) {
  const createTransfer = useCreateTransfer();
  const { uploadToS3, isUploading } = useUploadToS3();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { allBooks, isBooksLoading } = useGetAllUserBooksForTransfer();

  const { data: paymentModesData, isLoading: isPaymentModesLoading } =
    useGetPaymentModesByBook({
      bookId: cashbookId,
      status: "active",
    });

  const [businessFilter, setBusinessFilter] = useState<BusinessFilter>("all");
  const [showOtherCurrency, setShowOtherCurrency] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<TransferFormErrors>({});

  const [formData, setFormData] = useState({
    sourceBookId: cashbookId,
    targetBookId: "",
    amount: "",
    targetAmount: "",
    remark: "",
    date: getDateWithoutTime(),
    paymentMode: "",
    attachments: [] as Attachment[],
  });

  const sourceCurrencyInfo = getCurrencyInfo(currentCurrency);

  const eligibleBooks = useMemo(() => {
    return allBooks.filter((book) => {
      if (book._id === cashbookId || book.status !== "active") return false;

      const isSameBusiness = book.companyId === businessId;
      if (businessFilter === "same" && !isSameBusiness) return false;
      if (businessFilter === "other" && isSameBusiness) return false;

      const isSameCurrency = book.currency === currentCurrency;
      if (!showOtherCurrency && !isSameCurrency) return false;

      return true;
    });
  }, [
    allBooks,
    cashbookId,
    businessId,
    businessFilter,
    showOtherCurrency,
    currentCurrency,
  ]);

  const groupedBooks = useMemo(() => {
    const groups = new Map<string, TransferTargetBook[]>();
    for (const book of eligibleBooks) {
      const key = book.companyName || "Unknown Business";
      const existing = groups.get(key) || [];
      existing.push(book);
      groups.set(key, existing);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [eligibleBooks]);

  const selectedTargetBook = useMemo(
    () => allBooks.find((book) => book._id === formData.targetBookId),
    [allBooks, formData.targetBookId],
  );

  const isCrossCurrency = useMemo(() => {
    return (
      !!selectedTargetBook &&
      selectedTargetBook.currency !== currentCurrency
    );
  }, [selectedTargetBook, currentCurrency]);

  const targetCurrencyInfo = getCurrencyInfo(
    selectedTargetBook?.currency || currentCurrency,
  );

  const conversionLabel = useMemo(() => {
    const amount = parseFloat(formData.amount);
    const targetAmount = parseFloat(formData.targetAmount);
    if (!isCrossCurrency || !amount || !targetAmount) return null;
    const rate = amount / targetAmount;
    return `1 ${targetCurrencyInfo.code} = ${rate.toFixed(2)} ${sourceCurrencyInfo.code}`;
  }, [
    formData.amount,
    formData.targetAmount,
    isCrossCurrency,
    sourceCurrencyInfo.code,
    targetCurrencyInfo.code,
  ]);

  useEffect(() => {
    if (
      formData.targetBookId &&
      !eligibleBooks.some((book) => book._id === formData.targetBookId)
    ) {
      setFormData((prev) => ({
        ...prev,
        targetBookId: "",
        targetAmount: "",
      }));
    }
  }, [eligibleBooks, formData.targetBookId]);

  useEffect(() => {
    if (!isCrossCurrency) {
      setFormData((prev) => ({ ...prev, targetAmount: "" }));
    }
  }, [isCrossCurrency]);

  const getFileIcon = (fileType: string): string => {
    if (fileType.includes("pdf")) return "/icons/pdf-icon.svg";
    if (fileType.includes("word") || fileType.includes("document"))
      return "/icons/doc-icon.svg";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "/icons/excel-icon.svg";
    return "/icons/file-icon.svg";
  };

  const uploadFilesToS3 = async (files: UploadedFile[]) => {
    for (const fileData of files) {
      try {
        await new Promise<void>((resolve, reject) => {
          uploadToS3(
            { file: fileData.file, folder: "transfer" },
            {
              onSuccess: (res) => {
                const attachment: Attachment = {
                  url: res.data.url,
                  key: res.data.key,
                  fileType: res.data.fileType,
                  mimeType: res.data.mimeType,
                  size: res.data.size,
                };

                setUploadedFiles((prev) => {
                  const updated = [...prev];
                  const fileIndex = prev.findIndex((f) => f.file === fileData.file);
                  if (fileIndex !== -1) {
                    updated[fileIndex] = {
                      ...updated[fileIndex],
                      uploaded: true,
                      attachment,
                    };
                  }
                  return updated;
                });

                setFormData((prev) => ({
                  ...prev,
                  attachments: [...prev.attachments, attachment],
                }));
                resolve();
              },
              onError: (error) => reject(error),
            },
          );
        });
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }
  };

  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : getFileIcon(file.type),
      isImage: file.type.startsWith("image/"),
      uploaded: false,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    uploadFilesToS3(newFiles);
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    if (fileToRemove.attachment) {
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter(
          (att) => att.key !== fileToRemove.attachment?.key,
        ),
      }));
    }
    if (fileToRemove.isImage) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearError = (field: keyof TransferFormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateForm = (): TransferFormErrors => {
    const newErrors: TransferFormErrors = {};

    if (!formData.targetBookId) {
      newErrors.targetBookId = "Please select a target cashbook";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }
    if (
      isCrossCurrency &&
      (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0)
    ) {
      newErrors.targetAmount =
        "Please enter a valid target book amount greater than 0";
    }
    if (!formData.paymentMode) {
      newErrors.paymentMode = "Please select a payment mode";
    }
    if (!formData.date) {
      newErrors.date = "Please select a transfer date";
    }

    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      sourceBookId: cashbookId,
      targetBookId: "",
      amount: "",
      targetAmount: "",
      remark: "",
      date: getDateWithoutTime(),
      paymentMode: "",
      attachments: [],
    });
    setUploadedFiles([]);
    setBusinessFilter("all");
    setShowOtherCurrency(false);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    const errorFields = Object.keys(validationErrors);

    if (errorFields.length > 0) {
      setErrors(validationErrors);
      toast.error(
        errorFields.length === 1
          ? Object.values(validationErrors)[0]
          : `Please complete ${errorFields.length} required fields before submitting`,
      );
      return;
    }

    setErrors({});

    const payload = {
      sourceBookId: formData.sourceBookId,
      targetBookId: formData.targetBookId,
      amount: parseFloat(formData.amount),
      ...(isCrossCurrency
        ? { targetAmount: parseFloat(formData.targetAmount) }
        : {}),
      remark: formData.remark,
      date: format(formData.date, "yyyy-MM-dd"),
      paymentMode: formData.paymentMode.split("#")[1] || formData.paymentMode,
      attachments: formData.attachments,
    };

    createTransfer.mutate(payload, {
      onSuccess: () => {
        resetForm();
        (onSuccess ?? onCancel)();
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Transfer Between Books
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Transfer funds between books in the same or different businesses.
            Cross-currency transfers require both source and target amounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>From Cashbook</Label>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <div className="p-2 rounded-md bg-blue-100">
                <BookOpen className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="font-medium text-sm">{currentCashbookName}</p>
                <p className="text-xs text-gray-500">
                  {sourceCurrencyInfo.code} · {sourceCurrencyInfo.symbol}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-4 bg-gray-50/60">
            <Label>Filter Books by Business</Label>
            <p className="text-xs text-gray-500">Select where to transfer funds</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {businessFilterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBusinessFilter(option.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                    businessFilter === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  )}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Target Book *</Label>
                <p className="text-xs text-gray-500 mt-1">
                  ({sourceCurrencyInfo.code})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="other-currency" className="text-xs text-gray-600">
                  Show other currency books
                </Label>
                <Switch
                  id="other-currency"
                  checked={showOtherCurrency}
                  onCheckedChange={setShowOtherCurrency}
                />
              </div>
            </div>

            <Select
              value={formData.targetBookId}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, targetBookId: value }));
                clearError("targetBookId");
              }}
              disabled={isBooksLoading}
            >
              <SelectTrigger
                className={cn(errors.targetBookId && "border-red-500 focus:ring-red-500")}
              >
                <SelectValue placeholder="Select target book" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {isBooksLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading books...
                  </div>
                ) : groupedBooks.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No eligible books found. Try changing filters or enable other
                    currency books.
                  </div>
                ) : (
                  groupedBooks.map(([companyName, books]) => (
                    <SelectGroup key={companyName}>
                      <SelectLabel>
                        {companyName} ({books.length})
                      </SelectLabel>
                      {books.map((book) => (
                        <SelectItem key={book._id} value={book._id}>
                          <span className="flex items-center gap-2">
                            <span>{book.name}</span>
                            <span className="text-xs text-gray-500">
                              {book.currency}
                            </span>
                            {book.companyId !== businessId && (
                              <span className="text-[10px] rounded bg-amber-100 text-amber-700 px-1.5 py-0.5">
                                Other Business
                              </span>
                            )}
                            {book.currency !== currentCurrency && (
                              <span className="text-[10px] rounded bg-purple-100 text-purple-700 px-1.5 py-0.5">
                                {book.currency}
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))
                )}
              </SelectContent>
            </Select>

            <FieldError message={errors.targetBookId} />
            {selectedTargetBook && (
              <p className="text-xs text-gray-500">
                Selected: {selectedTargetBook.name} ·{" "}
                {selectedTargetBook.companyName} · {selectedTargetBook.currency}
              </p>
            )}
          </div>

          <div
            className={cn(
              "space-y-4 rounded-xl border p-4",
              isCrossCurrency ? "bg-blue-50 border-blue-100" : "bg-white",
              (errors.amount || errors.targetAmount) && "border-red-300",
            )}
          >
            <div className="space-y-2">
              <Label>Amount *</Label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-blue-700 min-w-[48px]">
                  {sourceCurrencyInfo.code}
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={formData.amount}
                  className={cn(errors.amount && "border-red-500 focus-visible:ring-red-500")}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isValidDecimalInput(value)) {
                      setFormData((prev) => ({ ...prev, amount: value }));
                      clearError("amount");
                    }
                  }}
                />
              </div>
              <FieldError message={errors.amount} />
            </div>

            {isCrossCurrency && (
              <div className="space-y-2">
                <Label>Amount in Target Book *</Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-blue-700 min-w-[48px]">
                    {targetCurrencyInfo.code}
                  </span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={formData.targetAmount}
                    className={cn(
                      errors.targetAmount && "border-red-500 focus-visible:ring-red-500",
                    )}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isValidDecimalInput(value)) {
                        setFormData((prev) => ({
                          ...prev,
                          targetAmount: value,
                        }));
                        clearError("targetAmount");
                      }
                    }}
                  />
                </div>
                <FieldError message={errors.targetAmount} />
              </div>
            )}

            {conversionLabel && (
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800">
                <ArrowLeftRight className="h-3.5 w-3.5" />
                {conversionLabel}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 p-3 text-xs text-indigo-800">
            Transfer categories such as &quot;TRANSFER TO [BOOK]&quot; and
            &quot;TRANSFER FROM [BOOK]&quot; will be created automatically on both
            books when you submit.
          </div>

          <div className="space-y-2">
            <Label>Payment Mode *</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, paymentMode: value }));
                clearError("paymentMode");
              }}
              disabled={isPaymentModesLoading}
            >
              <SelectTrigger
                className={cn(errors.paymentMode && "border-red-500 focus:ring-red-500")}
              >
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                {isPaymentModesLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : paymentModesData?.data?.length ? (
                  paymentModesData.data.map((mode: { _id: string; name: string }) => (
                    <SelectItem
                      key={mode._id}
                      value={`${mode._id}#${mode.name}`}
                    >
                      {mode.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">
                    No payment modes found
                  </div>
                )}
              </SelectContent>
            </Select>
            <FieldError message={errors.paymentMode} />
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                    errors.date && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date
                    ? format(formData.date, "dd MMM, yyyy")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    if (date) {
                      setFormData((prev) => ({
                        ...prev,
                        date: getDateWithoutTime(date),
                      }));
                      clearError("date");
                    }
                  }}
                  disabled={(date) => getDateWithoutTime(date) > getDateWithoutTime()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FieldError message={errors.date} />
          </div>

          <div className="space-y-2">
            <Label>Remarks (Optional)</Label>
            <Textarea
              placeholder="Additional notes about this transfer..."
              value={formData.remark}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, remark: e.target.value }))
              }
            />
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-600" />
              <Label>Attachments</Label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  "Upload Files"
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => {
                  if (e.target.files?.length) handleFileSelect(e.target.files);
                  if (e.target) e.target.value = "";
                }}
              />
              <span className="text-sm text-gray-500">
                {formData.attachments.length
                  ? `${formData.attachments.length} file(s) uploaded`
                  : "No files uploaded"}
              </span>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg overflow-hidden bg-gray-50"
                  >
                    <div className="aspect-square flex items-center justify-center p-2">
                      {file.isImage ? (
                        <img
                          src={file.previewUrl}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="p-2 border-t bg-white flex items-center justify-between gap-2">
                      <span className="text-xs truncate">{file.file.name}</span>
                      <div className="flex gap-1">
                        {file.isImage && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => {
                              setSelectedFileIndex(index);
                              setShowPreview(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createTransfer.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTransfer.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createTransfer.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Create Transfer
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedFileIndex !== -1 &&
                uploadedFiles[selectedFileIndex]?.file.name}
            </DialogTitle>
          </DialogHeader>
          {selectedFileIndex !== -1 &&
            uploadedFiles[selectedFileIndex]?.isImage && (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-auto max-h-[70vh]">
                <img
                  src={uploadedFiles[selectedFileIndex].previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
