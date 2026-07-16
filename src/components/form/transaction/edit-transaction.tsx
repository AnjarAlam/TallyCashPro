"use client";

import { TransactionFormValues, transactionFormSchema } from "@/schemes/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarIcon,
  CreditCard,
  Dot,
  FileText,
  IndianRupee,
  Landmark,
  MessageSquare,
  Paperclip,
  Settings,
  User,
  X,
  Eye,
  Trash2,
  Crop,
  Check,
  XCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Import ReactCrop dynamically to avoid CSS import issues
import ReactCrop, {
  Crop as ReactCropType,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";

import { FormFieldSettings } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTransactionForm } from "@/hooks/use-transaction-hook";
import { CreateTransactionDto, Party, Transaction, Attachment } from "@/interface";
import { cn } from "@/lib/utils";
import {
  useCreateTransaction,
  useGetCategoriesByBook,
  useUpdateTransaction,
  useGetCashbookById,
} from "@/services";

import Link from "next/link";
import { paths } from "@/routes/path";
import { IconBox } from "@/components/buttons";
import { useGetBookPartiesInfinite } from "@/services/party.service";
import { useGetPaymentModesByBook } from "@/services/payment-mode.service";
import { useUploadToS3 } from "@/services/file-upload.service";

interface EditTransactionFormProps {
  businessId: string;
  bookId: string;
  transaction: Transaction;
  onSubmitSuccess?: () => void;
}

interface UploadedFile {
  file?: File;
  previewUrl: string;
  isImage: boolean;
  uploaded?: boolean;
  attachment?: Attachment;
  croppedUrl?: string;
  originalUrl?: string;
  existing?: boolean; // Flag for existing attachments
}

// Inline CSS for ReactCrop (same as in add transaction form)
const reactCropStyles = `
  .ReactCrop {
    position: relative;
    display: inline-block;
    cursor: crosshair;
    max-width: 100%;
  }
  
  .ReactCrop--disabled .ReactCrop__crop-selection {
    cursor: inherit;
  }
  
  .ReactCrop__crop-selection {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate3d(0, 0, 0);
    box-sizing: border-box;
    border: 1px solid #fff;
    border-radius: 3px;
    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.5);
    z-index: 1;
    cursor: move;
    touch-action: none;
  }
  
  .ReactCrop__drag-handle {
    position: absolute;
    width: 9px;
    height: 9px;
    background-color: #fff;
    border: 1px solid #777;
    border-radius: 50%;
  }
  
  .ReactCrop__drag-handle::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    top: -6px;
    left: -6px;
  }
  
  .ReactCrop__drag-handle.ord-nw {
    top: -4px;
    left: -4px;
    cursor: nw-resize;
  }
  
  .ReactCrop__drag-handle.ord-n {
    top: -4px;
    left: 50%;
    margin-left: -4px;
    cursor: n-resize;
  }
  
  .ReactCrop__drag-handle.ord-ne {
    top: -4px;
    right: -4px;
    cursor: ne-resize;
  }
  
  .ReactCrop__drag-handle.ord-e {
    top: 50%;
    right: -4px;
    margin-top: -4px;
    cursor: e-resize;
  }
  
  .ReactCrop__drag-handle.ord-se {
    bottom: -4px;
    right: -4px;
    cursor: se-resize;
  }
  
  .ReactCrop__drag-handle.ord-s {
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
    cursor: s-resize;
  }
  
  .ReactCrop__drag-handle.ord-sw {
    bottom: -4px;
    left: -4px;
    cursor: sw-resize;
  }
  
  .ReactCrop__drag-handle.ord-w {
    top: 50%;
    left: -4px;
    margin-top: -4px;
    cursor: w-resize;
  }
  
  .ReactCrop__image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    user-select: none;
  }
`;

export function EditTransactionForm({
  transaction,
  bookId,
  businessId,
  onSubmitSuccess,
}: EditTransactionFormProps) {
  // Log IDs for debugging
  console.log("EditTransactionForm - businessId:", businessId);
  console.log("EditTransactionForm - bookId:", bookId);
  console.log("EditTransactionForm - transaction.book:", transaction.book);
  console.log("EditTransactionForm - transaction.bookDetails:", transaction.bookDetails);

  const { cashbook, isCashbookPending } = useGetCashbookById(businessId, bookId);

  // Use bookDetails from transaction if available, otherwise use fetched cashbook
  const bookName = transaction.bookDetails?.name || cashbook?.name;

  // Debug cashbook
  console.log("EditTransactionForm - cashbook:", cashbook);
  console.log("EditTransactionForm - isCashbookPending:", isCashbookPending);
  console.log("EditTransactionForm - bookName:", bookName);

  const { visibleFields, defaultValues } = useTransactionForm();
  const [transactionType, setTransactionType] = useState<
    "cash_in" | "cash_out"
  >(transaction.type);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState<ReactCropType>();
  const [croppingFileIndex, setCroppingFileIndex] = useState<number>(-1);
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the transaction API hook
  const {
    updateTransaction,
    isUpdatingTransaction,
    isUpdateTransactionError,
    updateTransactionError,
  } = useUpdateTransaction();

  const { uploadToS3, isUploading } = useUploadToS3();

  // Initialize the data fetching hooks
  const {
    parties,
    isPartiesPending,
    isPartiesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetBookPartiesInfinite(bookId);

  const {
    data: paymentModesData,
    isLoading: isPaymentModesLoading,
    isError: isPaymentModesError,
  } = useGetPaymentModesByBook({
    bookId,
    status: "active"
  });

  const {
    categories,
    isCategoriesPending,
    isCategoriesError,
    categoriesError,
    refetchCategories,
  } = useGetCategoriesByBook({
    bookId,
    // typeFilter: transactionType,
  });

  // Debug categories
  useEffect(() => {
    console.log("Categories Debug:", {
      categories,
      length: categories?.length,
      isCategoriesPending,
      isCategoriesError,
      bookId
    });
  }, [categories, isCategoriesPending, isCategoriesError, bookId]);

  // Store the original transaction data for debugging
  const [transactionData, setTransactionData] = useState<Transaction | null>(null);

  useEffect(() => {
    console.log("Transaction data received:", transaction);
    console.log("Category:", transaction.category);
    console.log("Payment Mode:", transaction.paymentMode);
    console.log("Party:", transaction.party);
    setTransactionData(transaction);
  }, [transaction]);

  // Convert existing attachments to UploadedFile format
  const existingAttachments: UploadedFile[] = (transaction.attachments || []).map((att, index) => {
    const isImage = att.fileType?.startsWith('image/') || att.mimeType?.startsWith('image/') || false;
    return {
      previewUrl: att.url,
      isImage,
      uploaded: true,
      attachment: att,
      existing: true,
    };
  });

  // Get display name from full value (id#name)
  const getDisplayName = (fullValue: string) => {
    if (!fullValue) return "";
    const parts = fullValue.split("#");
    return parts.length > 1 ? parts[1] : parts[0];
  };

  // Initialize form with proper values
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: transaction.amount,
      date: new Date(transaction.date),
      category: transaction.category || "", // Keep full value (id#name)
      paymentMode: transaction.paymentMode || "", // Keep full value (id#name)
      partyName: transaction.party || "", // Keep full value (id#name)
      description: transaction.description || "",
      remark: transaction.remark || "",
      attachments: transaction.attachments || [],
    },
  });

  // Log form values for debugging
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Initialize uploaded files with existing attachments
  useEffect(() => {
    if (existingAttachments.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles(existingAttachments);
    }
  }, [existingAttachments, uploadedFiles.length]);

  const handleTypeChange = (newType: "cash_in" | "cash_out") => {
    setTransactionType(newType);
    form.resetField("partyName");
    // Refetch categories when type changes
    refetchCategories();
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string): string => {
    if (fileType.includes("pdf")) return "/icons/pdf-icon.svg";
    if (fileType.includes("word") || fileType.includes("document"))
      return "/icons/doc-icon.svg";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "/icons/excel-icon.svg";
    return "/icons/file-icon.svg";
  };

  // Handle file selection
  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      let previewUrl = "";

      if (isImage) {
        previewUrl = URL.createObjectURL(file);
      } else {
        previewUrl = getFileIcon(file.type);
      }

      newFiles.push({
        file,
        previewUrl,
        isImage,
        uploaded: false,
        originalUrl: isImage ? previewUrl : undefined,
      });
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // If there are image files, open crop modal for the first one
    const firstImageIndex = newFiles.findIndex((f) => f.isImage);
    if (firstImageIndex !== -1) {
      const totalIndex = uploadedFiles.length + firstImageIndex;
      setCroppingFileIndex(totalIndex);
      setShowCropModal(true);
    } else {
      uploadFilesToS3(newFiles);
    }
  };

  // Upload files to S3
  const uploadFilesToS3 = async (files: UploadedFile[]) => {
    const uploadPromises = files.map((fileData) =>
      new Promise<Attachment | null>((resolve) => {
        if (!fileData.file) {
          // This is an existing file, no need to re-upload
          resolve(fileData.attachment || null);
          return;
        }

        const fileToUpload = fileData.croppedUrl
          ? dataURLtoFile(fileData.croppedUrl, fileData.file.name, fileData.file.type)
          : fileData.file;

        uploadToS3(
          { file: fileToUpload, folder: `transaction` },
          {
            onSuccess: (res) => {
              const attachment: Attachment = {
                url: res.data.url,
                key: res.data.key,
                fileType: res.data.fileType,
                mimeType: res.data.mimeType,
                size: res.data.size,
              };

              // Update the file in state
              setUploadedFiles((prev) => {
                const updated = [...prev];
                const fileIndex = prev.findIndex(
                  (f) => f.file === fileData.file
                );
                if (fileIndex !== -1) {
                  updated[fileIndex] = {
                    ...updated[fileIndex],
                    uploaded: true,
                    attachment,
                  };
                }
                return updated;
              });

              // Add to form attachments
              const currentAttachments = form.getValues("attachments") || [];
              form.setValue("attachments", [...currentAttachments, attachment]);

              resolve(attachment);
            },
            onError: (error) => {
              console.error("Upload failed:", error);
              resolve(null);
            },
          }
        );
      })
    );

    await Promise.all(uploadPromises);
  };

  // Convert data URL to File object
  function dataURLtoFile(dataurl: string, filename: string, mimeType: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  // Remove a file
  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];

    // Revoke object URLs for new files
    if (!fileToRemove.existing && fileToRemove.isImage) {
      if (fileToRemove.originalUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.originalUrl);
      }
    }

    // Remove from form attachments
    if (fileToRemove.attachment) {
      const currentAttachments = form.getValues("attachments") || [];
      const updatedAttachments = currentAttachments.filter(
        (att) => att.key !== fileToRemove.attachment?.key
      );
      form.setValue("attachments", updatedAttachments);
    }

    // Remove from state
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // View file in modal
  const viewFile = (index: number) => {
    setSelectedFileIndex(index);
    setShowPreview(true);
  };

  // Open crop modal for specific image
  const openCropModal = (index: number) => {
    const fileData = uploadedFiles[index];
    if (fileData.isImage && fileData.file) {
      setCroppingFileIndex(index);
      setShowCropModal(true);
      setCrop(undefined);
    }
  };

  // Handle crop completion
  const handleCropComplete = async () => {
    if (croppingFileIndex === -1 || !crop || !imgRef.current) return;

    setIsCropping(true);

    try {
      const fileData = uploadedFiles[croppingFileIndex];
      if (!fileData.isImage || !fileData.file) return;

      // Get canvas and context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas dimensions to crop size
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      // Draw cropped image onto canvas
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      // Convert canvas to data URL
      const croppedDataUrl = canvas.toDataURL(fileData.file.type, 0.9);

      // Update file with cropped version
      setUploadedFiles(prev => {
        const updated = [...prev];
        updated[croppingFileIndex] = {
          ...updated[croppingFileIndex],
          croppedUrl: croppedDataUrl,
          previewUrl: croppedDataUrl,
        };
        return updated;
      });

      // Close crop modal
      setShowCropModal(false);
      setCroppingFileIndex(-1);
      setCrop(undefined);

      // Upload the cropped file to S3
      const fileToUpload = dataURLtoFile(croppedDataUrl, fileData.file.name, fileData.file.type);

      uploadToS3(
        { file: fileToUpload, folder: `transaction` },
        {
          onSuccess: (res) => {
            const attachment: Attachment = {
              url: res.data.url,
              key: res.data.key,
              fileType: res.data.fileType,
              mimeType: res.data.mimeType,
              size: res.data.size,
            };

            // Update file in state
            setUploadedFiles(prev => {
              const updated = [...prev];
              const fileIndex = prev.findIndex(f => f.file === fileData.file);
              if (fileIndex !== -1) {
                updated[fileIndex] = {
                  ...updated[fileIndex],
                  uploaded: true,
                  attachment,
                };
              }
              return updated;
            });

            // Add to form attachments
            const currentAttachments = form.getValues("attachments") || [];
            form.setValue("attachments", [...currentAttachments, attachment]);
          },
          onError: (error) => {
            console.error("Upload failed:", error);
          },
        }
      );

    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsCropping(false);
    }
  };

  // Skip cropping for current image
  const skipCropping = () => {
    if (croppingFileIndex === -1) return;

    const fileData = uploadedFiles[croppingFileIndex];

    if (fileData.file) {
      // Upload original file without cropping
      uploadFilesToS3([fileData]);
    }

    // Close crop modal and move to next image if any
    const nextImageIndex = uploadedFiles.findIndex(
      (file, index) => index > croppingFileIndex && file.isImage && file.file && !file.uploaded
    );

    if (nextImageIndex !== -1) {
      setCroppingFileIndex(nextImageIndex);
      setCrop(undefined);
    } else {
      setShowCropModal(false);
      setCroppingFileIndex(-1);
      setCrop(undefined);
    }
  };

  // Skip all cropping
  const skipAllCropping = () => {
    const filesToUpload = uploadedFiles.filter(
      (file, index) => index >= croppingFileIndex && file.isImage && file.file && !file.uploaded
    );

    if (filesToUpload.length > 0) {
      uploadFilesToS3(filesToUpload);
    }

    setShowCropModal(false);
    setCroppingFileIndex(-1);
    setCrop(undefined);
  };

  // Handle form submission
  const handleSubmit = async (values: TransactionFormValues) => {
    console.log("Form values on submit:", values);

    // Use original transaction values as fallback for unchanged fields
    const category = values.category?.trim() ? values.category.split("#")[1] : transaction.category?.split("#")[1] || "";
    const paymentMode = values.paymentMode?.trim() ? values.paymentMode.split("#")[1] : transaction.paymentMode?.split("#")[1] || "";
    const partyName = values.partyName?.trim() ? values.partyName.split("#")[1] : transaction.party?.split("#")[1] || "";

    const payload: CreateTransactionDto = {
      book: bookId,
      type: transactionType,
      amount: values.amount,
      party: partyName,
      partyType: transactionType === "cash_in" ? "Customer" : "Supplier",
      category: category,
      paymentMode: paymentMode,
      remark: values.remark || "",
      date: format(values.date || "", "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm:ss"),
      description: values.description || "",
      attachments:
        values.attachments?.map((attachment) => ({
          url: attachment.url,
          key: attachment.key,
          fileType: attachment.fileType,
          mimeType: attachment.mimeType,
          size: attachment.size,
        })) || [],
    };

    console.log("Payload for update:", payload);

    updateTransaction(
      {
        id: transaction._id,
        data: payload,
      },
      {
        onSuccess: (res) => {
          onSubmitSuccess?.();
          // Clean up object URLs for new files
          uploadedFiles.forEach((file) => {
            if (!file.existing && file.isImage && file.originalUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(file.originalUrl);
            }
          });
          setUploadedFiles([]);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 p-4"
      >
        {/* Add ReactCrop styles inline */}
        <style jsx global>{reactCropStyles}</style>

        {/* <FormFieldSettings /> */}

        {/* Book Name Display */}
        {bookName && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
            <Landmark className="h-4 w-4 text-blue-700" />
            <span className="text-sm font-medium text-blue-900">{bookName}</span>
          </div>
        )}

        {/* Type Toggle Chips */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => handleTypeChange("cash_in")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:cursor-pointer ${transactionType === "cash_in"
                ? "bg-green-100 border-green-300 text-green-800"
                : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <ArrowDownCircle className="h-4 w-4" />
            <span>Cash In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("cash_out")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:cursor-pointer ${transactionType === "cash_out"
                ? "bg-red-100 border-red-300 text-red-800"
                : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <ArrowUpCircle className="h-4 w-4" />
            <span>Cash Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gray-100">
                      <IndianRupee className="h-4 w-4 text-gray-700" />
                    </div>
                    <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                      Amount *
                    </FormLabel>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-8 border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </div>
                  <FormMessage className="text-xs text-red-600" />
                </div>
              </FormItem>
            )}
          />

          {/* Category - always visible */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              console.log("Category field value:", field.value);
              console.log("Display name:", getDisplayName(field.value ?? ''));

              return (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <Landmark className="h-4 w-4 text-gray-700" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Category
                      </FormLabel>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={isCategoriesPending}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full">
                          <SelectValue>
                            {getDisplayName(field.value ?? '') ||
                              (isCategoriesPending
                                ? "Loading categories..."
                                : "Select a category")}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        position="popper"
                        className="border-gray-300 shadow-md"
                      >
                        {isCategoriesPending ? (
                          <div>Loading categories...</div>
                        ) : categories?.length > 0 ? (
                          categories?.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={`${category._id}#${category.name}`}
                              className="hover:bg-gray-100 capitalize "
                            >
                              {category.name.toLowerCase()}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 p-2">
                            No categories found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              );
            }}
          />

          {/* Party Name */}
          {visibleFields.partyName?.visible && (
            <FormField
              control={form.control}
              name="partyName"
              render={({ field }) => {
                console.log("Party field value:", field.value);
                console.log("Party display name:", getDisplayName(field.value ?? ''));

                return (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-gray-100">
                          <User className="h-4 w-4 text-gray-700" />
                        </div>
                        <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                          Party Name
                        </FormLabel>
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="p-1 rounded-full bg-destructive hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        )}
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isPartiesPending}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full"
                          >
                            <SelectValue>
                              {getDisplayName(field.value ?? '') ||
                                (isPartiesPending
                                  ? "Loading parties..."
                                  : "Select a party")}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          className="border-gray-300 shadow-md max-h-60 overflow-y-auto"
                        >
                          {isPartiesPending ? (
                            <div>Loading parties...</div>
                          ) : parties?.length > 0 ? (
                            <>
                              {parties?.map((party, idx) => (
                                <SelectItem
                                  key={idx}
                                  value={`${party._id}#${party.name}`}
                                  className="hover:bg-gray-100 capitalize"
                                >
                                  {party.name.toLowerCase()}
                                </SelectItem>
                              ))}
                              {hasNextPage && (
                                <SelectItem
                                  value="load-more"
                                  className="text-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                                  onSelect={() =>
                                    !isFetchingNextPage && fetchNextPage()
                                  }
                                >
                                  {isFetchingNextPage
                                    ? "Loading more..."
                                    : "Load more"}
                                </SelectItem>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-gray-500 p-2">
                              No parties found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                );
              }}
            />
          )}

          {/* Payment Mode - always visible */}
          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }) => {
              console.log("Payment Mode field value:", field.value);
              console.log("Payment Mode display name:", getDisplayName(field.value ?? ''));

              return (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <CreditCard className="h-4 w-4 text-gray-700" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Payment Mode
                      </FormLabel>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={isPaymentModesLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full">
                          <SelectValue>
                            {getDisplayName(field.value ?? '') ||
                              (isPaymentModesLoading
                                ? "Loading payment modes..."
                                : "Select payment mode")}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        position="popper"
                        className="border-gray-300 shadow-md"
                      >
                        {isPaymentModesLoading ? (
                          <div>Loading payment modes...</div>
                        ) : paymentModesData?.data?.length ?? 0 > 0 ? (
                          paymentModesData?.data?.map((mode, idx) => (
                            <SelectItem
                              key={idx}
                              value={`${mode._id}#${mode.name}`}
                              className="hover:bg-gray-100 capitalize"
                            >
                              {mode.name.toLowerCase()}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 p-2">
                            No payment modes found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              );
            }}
          />

          {/* Date */}
          {visibleFields.date?.visible && (
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <CalendarIcon className="h-4 w-4 text-gray-700" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Date *
                      </FormLabel>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50 focus-visible:ring-1 focus-visible:ring-gray-400",
                              !field.value && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-gray-300 shadow-md">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Other Details */}
        {visibleFields.otherDetail?.visible && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gray-100">
                      <FileText className="h-4 w-4 text-gray-700" />
                    </div>
                    <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                      Other Details (Optional)
                    </FormLabel>
                  </div>
                  <Textarea
                    placeholder="Additional details..."
                    className="min-h-[100px] border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    {...field}
                  />
                  <FormMessage className="text-xs text-red-600" />
                </div>
              </FormItem>
            )}
          />
        )}

        {/* Remarks */}
        {visibleFields.remark?.visible && (
          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gray-100">
                      <MessageSquare className="h-4 w-4 text-gray-700" />
                    </div>
                    <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                      Remarks
                    </FormLabel>
                  </div>
                  <Textarea
                    placeholder="Any remarks..."
                    className="min-h-[100px] border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    {...field}
                  />
                  <FormMessage className="text-xs text-red-600" />
                </div>
              </FormItem>
            )}
          />
        )}

        {/* Attachments Section */}
        {visibleFields.attachments?.visible && (
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gray-100">
                      <Paperclip className="h-4 w-4 text-gray-700" />
                    </div>
                    <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                      Attachments
                    </FormLabel>
                  </div>

                  {/* Upload Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 border-gray-300 hover:bg-gray-50 focus-visible:ring-1 focus-visible:ring-gray-400"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      {isUploading ? "Uploading..." : "Upload Files"}
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleFileSelect(files);
                        }
                        if (e.target) {
                          e.target.value = "";
                        }
                      }}
                    />
                    <span
                      className={`text-sm ${field.value?.length ? "text-gray-700" : "text-gray-500"
                        }`}
                    >
                      {field.value?.length
                        ? `${field.value.length} file(s) uploaded`
                        : "No files uploaded"}
                    </span>
                  </div>

                  {/* File Previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Uploaded Files:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative border rounded-lg overflow-hidden bg-gray-50 group"
                          >
                            {/* File Preview */}
                            <div className="aspect-square flex items-center justify-center">
                              {file.isImage ? (
                                <img
                                  src={file.previewUrl}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center p-4">
                                  <div className="text-gray-400 mb-2">
                                    {file.attachment?.fileType?.includes("pdf")
                                      ? "📄"
                                      : file.attachment?.fileType?.includes("word")
                                        ? "📝"
                                        : file.attachment?.fileType?.includes("excel")
                                          ? "📊"
                                          : "📎"}
                                  </div>
                                  <span className="text-xs text-center text-gray-600 truncate w-full">
                                    {`Attachment ${index + 1}`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* File Info */}
                            <div className="p-2 bg-white border-t">
                              <div className="flex items-center justify-between">

                                <div className="flex items-center gap-1">
                                  {file.uploaded && (
                                    <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">
                                      ✓
                                    </span>
                                  )}
                                  {file.croppedUrl && (
                                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">
                                      ✂️
                                    </span>
                                  )}
                                  {file.existing && (
                                    <span className="text-[10px] bg-gray-100 text-gray-800 px-1 rounded">
                                      ⚫
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                              {file.isImage && file.file && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                                  onClick={() => openCropModal(index)}
                                  title="Crop Image"
                                >
                                  <Crop className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                                onClick={() => viewFile(index)}
                                title="View File"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                                onClick={() => removeFile(index)}
                                title="Remove File"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <FormDescription className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, PDF, DOC, XLS (max 5MB each)
                  </FormDescription>
                  <FormMessage className="text-xs text-red-600" />
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isUpdatingTransaction}
            className="px-6 py-2 rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700"
          >
            {isUpdatingTransaction
              ? "Updating..."
              : `Update ${transactionType === "cash_in" ? "Cash In" : "Cash Out"
              }`}
          </Button>
        </div>
      </form>

      {/* Image Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedFileIndex !== -1 &&
                (`Attachment ${selectedFileIndex + 1}`)}
            </DialogTitle>
          </DialogHeader>
          {selectedFileIndex !== -1 &&
            uploadedFiles[selectedFileIndex]?.isImage && (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={uploadedFiles[selectedFileIndex].previewUrl}
                  alt="Preview"
                  className="w-40 max-h-[60vh] object-contain"
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

      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] z-[9999]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Image
              {croppingFileIndex !== -1 && (
                <span className="text-sm text-gray-500 font-normal">
                  ({croppingFileIndex + 1} of {uploadedFiles.filter(f => f.isImage && f.file).length})
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Drag the corners to select the area you want to keep.
            </DialogDescription>
          </DialogHeader>

          {croppingFileIndex !== -1 && uploadedFiles[croppingFileIndex]?.isImage && uploadedFiles[croppingFileIndex]?.file && (
            <div className="space-y-4">
              <div className="relative w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={undefined}
                  circularCrop={false}
                  className="max-h-full max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={uploadedFiles[croppingFileIndex].originalUrl || uploadedFiles[croppingFileIndex].previewUrl}
                    alt="Crop preview"
                    className="max-h-full max-w-full object-contain"
                    onLoad={(e) => {
                      const { width, height } = e.currentTarget;
                      const initialCrop = centerCrop(
                        makeAspectCrop(
                          {
                            unit: '%',
                            width: 80,
                          },
                          16 / 9,
                          width,
                          height
                        ),
                        width,
                        height
                      );
                      setCrop(initialCrop);
                    }}
                  />
                </ReactCrop>
              </div>

              <div className="text-sm text-gray-600">
                <p>Image: {uploadedFiles[croppingFileIndex].file?.name}</p>
                <p>Size: {(uploadedFiles[croppingFileIndex].file?.size || 0 / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={skipCropping}
                disabled={isCropping}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Skip This Image
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={skipAllCropping}
                disabled={isCropping}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Skip All
              </Button>
            </div>
            <Button
              type="button"
              onClick={handleCropComplete}
              disabled={isCropping || !crop}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCropping ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Apply Crop & Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

const RedirectToSettingBtn = ({
  businessId,
  bookId,
  slug,
}: {
  businessId: string;
  bookId: string;
  slug: string;
}) => {
  const url = `${paths.dashboard.business.root}/${businessId}/${bookId}/fields/${slug}`;
  console.log("RedirectToSettingBtn - URL:", url);
  console.log("RedirectToSettingBtn - businessId:", businessId, "bookId:", bookId, "slug:", slug);

  return (
    <Link
      href={url}
    >
      <IconBox icon={Settings} />
    </Link>
  );
};