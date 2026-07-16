"use client";

import { TransactionFormValues, transactionFormSchema } from "@/schemes/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  ArrowUpCircle,
  CalendarIcon,
  CreditCard,
  FileText,
  IndianRupee,
  Landmark,
  MessageSquare,
  Paperclip,
  Settings,
  User,
  X,
  Search,
  Eye,
  Trash2,
  Crop,
  Check,
  XCircle,
  Loader2,
  Upload,
  CheckCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

// Import ReactCrop
import ReactCrop, {
  Crop as ReactCropType,
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";

import { FormFieldSettings, QuickPartiesPage } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
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
import { CreateTransactionDto, Attachment } from "@/interface";
import { cn } from "@/lib/utils";
import { useCreateTransaction, useGetCategoriesByBook, useGetCashbookById } from "@/services";

import { IconBox } from "@/components/buttons";
import { SheetLayoutComp } from "@/components/modals";
import { paths } from "@/routes/path";
import { useUploadToS3 } from "@/services/file-upload.service";
import { useGetPaymentModesByBook } from "@/services/payment-mode.service";
import Link from "next/link";

interface TransactionFormProps {
  businessId: string;
  type: "cash_in" | "cash_out";
  bookId: string;
  onSubmitSuccess?: () => void;
}

interface UploadedFile {
  file: File;
  previewUrl: string;
  isImage: boolean;
  uploaded?: boolean;
  attachment?: Attachment;
  croppedUrl?: string;
  originalUrl?: string;
  croppedPreviewUrl?: string;
}

export function AddTransactionForm({
  type,
  bookId,
  businessId,
  onSubmitSuccess,
}: TransactionFormProps) {
  const { cashbook, isCashbookPending } = useGetCashbookById(businessId, bookId);

  // Debug cashbook
  console.log("AddTransactionForm - businessId:", businessId);
  console.log("AddTransactionForm - bookId:", bookId);
  console.log("AddTransactionForm - cashbook:", cashbook);
  console.log("AddTransactionForm - isCashbookPending:", isCashbookPending);

  const { visibleFields, defaultValues } = useTransactionForm();
  const [transactionType, setTransactionType] = useState<
    "cash_in" | "cash_out"
  >(type);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showCropPreviewModal, setShowCropPreviewModal] = useState(false);
  const [crop, setCrop] = useState<ReactCropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppingFileIndex, setCroppingFileIndex] = useState<number>(-1);
  const [isCropping, setIsCropping] = useState(false);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string>("");
  const [isUploadingCrop, setIsUploadingCrop] = useState(false);
  const [isFullscreenCrop, setIsFullscreenCrop] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropModalRef = useRef<HTMLDivElement>(null);

  // Initialize the transaction API hook
  const {
    createTransaction,
    isCreatingTransaction,
  } = useCreateTransaction();
  const { uploadToS3, isUploading } = useUploadToS3();

  // Initialize the data fetching hooks
  const {
    data: paymentModesData,
    isLoading: isPaymentModesLoading,
  } = useGetPaymentModesByBook({
    bookId,
    status: "active"
  });

  const {
    categories,
    isCategoriesPending,
    refetchCategories,
  } = useGetCategoriesByBook({
    bookId,
    // typeFilter: transactionType,
  });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: new Date(),
      paymentMode: "",
      category: "",
      partyName: "",
      otherDetail: "",
      remark: "",
      attachments: [],
      amount: undefined,
      description: "",
      ...defaultValues,
    },
  });

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.isImage) {
          if (file.originalUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(file.originalUrl);
          }
          if (file.croppedUrl?.startsWith("data:")) {
            URL.revokeObjectURL(file.croppedUrl);
          }
          if (file.croppedPreviewUrl?.startsWith("data:")) {
            URL.revokeObjectURL(file.croppedPreviewUrl);
          }
        }
      });
    };
  }, []);

  // Sync local transactionType state when type prop changes
  useEffect(() => {
    setTransactionType(type);
  }, [type]);

  // Refetch categories when transaction type changes
  useEffect(() => {
    refetchCategories();
  }, [transactionType, refetchCategories]);

  // Generate crop preview when crop changes
  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

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

      // Generate preview URL
      const previewUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCropPreviewUrl(previewUrl);
    }
  }, [completedCrop]);

  // Adjust crop area to ensure OK button is visible
  useEffect(() => {
    if (showCropModal && cropModalRef.current) {
      // Ensure modal content is properly sized
      const modalContent = cropModalRef.current;
      const buttonsSection = modalContent.querySelector('.crop-buttons-section');

      if (buttonsSection) {
        // Scroll to bottom to ensure buttons are visible
        setTimeout(() => {
          buttonsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      }
    }
  }, [showCropModal]);

  const handleTypeChange = (newType: "cash_in" | "cash_out") => {
    setTransactionType(newType);
    form.resetField("partyName");
    form.resetField("category");
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
      setCrop(undefined);
      setCompletedCrop(undefined);
      setShowCropModal(true);
    } else {
      uploadFilesToS3(newFiles);
    }
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

  // Upload files to S3
  const uploadFilesToS3 = async (files: UploadedFile[]) => {
    for (const fileData of files) {
      try {
        const fileToUpload = fileData.croppedUrl
          ? dataURLtoFile(fileData.croppedUrl, fileData.file.name, fileData.file.type)
          : fileData.file;

        await new Promise<void>((resolve, reject) => {
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
                resolve();
              },
              onError: (error) => {
                console.error("Upload failed:", error);
                reject(error);
              },
            }
          );
        });
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }
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

    // Remove from form attachments
    if (fileToRemove.attachment) {
      const currentAttachments = form.getValues("attachments") || [];
      const updatedAttachments = currentAttachments.filter(
        (att) => att.key !== fileToRemove.attachment?.key
      );
      form.setValue("attachments", updatedAttachments);
    }

    // Revoke object URLs
    if (fileToRemove.isImage) {
      if (fileToRemove.originalUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.originalUrl);
      }
      if (fileToRemove.croppedUrl?.startsWith("data:")) {
        URL.revokeObjectURL(fileToRemove.croppedUrl);
      }
      if (fileToRemove.croppedPreviewUrl?.startsWith("data:")) {
        URL.revokeObjectURL(fileToRemove.croppedPreviewUrl);
      }
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
    setCroppingFileIndex(index);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsFullscreenCrop(false);
    setShowCropModal(true);
  };

  // Toggle fullscreen crop view
  const toggleFullscreenCrop = () => {
    setIsFullscreenCrop(!isFullscreenCrop);
  };

  // Handle crop preview (show crop before confirming)
  const handleCropPreview = async () => {
    if (croppingFileIndex === -1 || !completedCrop || !imgRef.current) return;

    setIsCropping(true);
    try {
      // Generate crop preview
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !completedCrop) return;

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCropPreviewUrl(croppedDataUrl);
      setShowCropModal(false);
      setShowCropPreviewModal(true);
    } catch (error) {
      console.error("Error generating crop preview:", error);
    } finally {
      setIsCropping(false);
    }
  };

  // Confirm and upload cropped image
  const handleConfirmCrop = async () => {
    if (croppingFileIndex === -1 || !cropPreviewUrl) return;

    setIsUploadingCrop(true);

    try {
      const fileData = uploadedFiles[croppingFileIndex];

      // Create cropped file from preview
      const croppedFile = dataURLtoFile(cropPreviewUrl, fileData.file.name, 'image/jpeg');

      // Update file with cropped version
      setUploadedFiles(prev => {
        const updated = [...prev];
        updated[croppingFileIndex] = {
          ...updated[croppingFileIndex],
          croppedUrl: cropPreviewUrl,
          croppedPreviewUrl: cropPreviewUrl,
          previewUrl: cropPreviewUrl,
          file: croppedFile,
        };
        return updated;
      });

      // Upload the cropped file to S3
      await new Promise<void>((resolve, reject) => {
        uploadToS3(
          { file: croppedFile, folder: `transaction` },
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

              // Find next image to crop
              const nextImageIndex = uploadedFiles.findIndex(
                (file, index) => index > croppingFileIndex && file.isImage && !file.uploaded
              );

              if (nextImageIndex !== -1) {
                setCroppingFileIndex(nextImageIndex);
                setCrop(undefined);
                setCompletedCrop(undefined);
                setShowCropPreviewModal(false);
                setShowCropModal(true);
              } else {
                setShowCropPreviewModal(false);
                setCroppingFileIndex(-1);
                setCrop(undefined);
                setCompletedCrop(undefined);
                setCropPreviewUrl("");
              }

              resolve();
            },
            onError: (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
          }
        );
      });

    } catch (error) {
      console.error("Error uploading cropped image:", error);
    } finally {
      setIsUploadingCrop(false);
    }
  };

  // Skip cropping for current image
  const skipCropping = () => {
    if (croppingFileIndex === -1) return;

    const fileData = uploadedFiles[croppingFileIndex];

    // Upload original file without cropping
    uploadFilesToS3([fileData]);

    // Find next image to crop
    const nextImageIndex = uploadedFiles.findIndex(
      (file, index) => index > croppingFileIndex && file.isImage && !file.uploaded
    );

    if (nextImageIndex !== -1) {
      setCroppingFileIndex(nextImageIndex);
      setCrop(undefined);
      setCompletedCrop(undefined);
      setShowCropModal(true);
    } else {
      setShowCropModal(false);
      setCroppingFileIndex(-1);
      setCrop(undefined);
      setCompletedCrop(undefined);
    }
  };

  // Skip all cropping
  const skipAllCropping = () => {
    const filesToUpload = uploadedFiles.filter(
      (file, index) => index >= croppingFileIndex && file.isImage && !file.uploaded
    );

    if (filesToUpload.length > 0) {
      uploadFilesToS3(filesToUpload);
    }

    setShowCropModal(false);
    setCroppingFileIndex(-1);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Handle crop modal close
  const handleCropModalClose = () => {
    // Skip current image when closing modal
    skipCropping();
  };

  // Handle crop preview modal close
  const handleCropPreviewModalClose = () => {
    // Go back to crop modal
    setShowCropPreviewModal(false);
    setShowCropModal(true);
  };

  // Handle form submission
  const handleSubmit = async (values: TransactionFormValues) => {
    try {
      const payload: CreateTransactionDto = {
        book: bookId,
        type: transactionType,
        amount: values.amount || 0,
        party: values.partyName || "",
        partyType: transactionType === "cash_in" ? "Customer" : "Supplier",
        category: values.category?.split("#")[1] || "",
        paymentMode: values.paymentMode?.split("#")[1] || "",
        remark: values.remark || "",
        date: format(values.date || new Date(), "yyyy-MM-dd"),
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

      await createTransaction(payload, {
        onSuccess: (res) => {
          // Clean up object URLs
          uploadedFiles.forEach((file) => {
            if (file.isImage) {
              if (file.originalUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(file.originalUrl);
              }
              if (file.croppedUrl?.startsWith("data:")) {
                URL.revokeObjectURL(file.croppedUrl);
              }
              if (file.croppedPreviewUrl?.startsWith("data:")) {
                URL.revokeObjectURL(file.croppedPreviewUrl);
              }
            }
          });

          setUploadedFiles([]);
          form.reset();
          onSubmitSuccess?.();
        },
      });
    } catch (error) {
      console.error("Transaction submission error:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* <FormFieldSettings /> */}

          {/* Book Name Display */}

          {/* {cashbook?.name && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
              <Landmark className="h-4 w-4 text-blue-700" />
              <span className="text-sm font-medium text-blue-900">{cashbook.name}</span>
            </div>
          )} */}

          {/* Type Toggle Chips */}

          {/* <div className="flex gap-2 mb-6">
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
          </div> */}

          <div className="flex flex-col bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_2.2fr] gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 items-start sm:items-center">
                    <FormLabel className="text-xs font-bold text-gray-700 sm:py-2">
                      Amount
                    </FormLabel>
                    <div>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Enter Here"
                          className="border-slate-200 focus-visible:ring-blue-500 rounded-xl h-10 text-xs font-semibold text-slate-800"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                        />
                      </div>
                      <FormMessage className="text-xs text-red-600 mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Category - always visible */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="flex flex-col gap-2 py-4 px-6 bg-white">
                    <FormLabel className="text-xs font-bold text-gray-700">
                      Category
                    </FormLabel>
                    <div>
                      {isCategoriesPending ? (
                        <div className="flex items-center justify-start py-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                          <span className="text-xs text-slate-400 ml-2">Loading categories...</span>
                        </div>
                      ) : categories && categories.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {categories.map((category) => {
                            const isSelected = field.value === `${category._id}#${category.name}`;
                            return (
                              <button
                                key={category._id}
                                type="button"
                                onClick={() => field.onChange(`${category._id}#${category.name}`)}
                                className={`px-4.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all border ${
                                  isSelected
                                    ? "bg-[#EEF3FF] text-[#3B82F6] border-[#3B82F6] shadow-sm font-bold"
                                    : "bg-[#F3F4F9] text-gray-700 border-transparent hover:bg-gray-200/60"
                                }`}
                              >
                                {category.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 py-1">No categories found</div>
                      )}
                      <FormMessage className="text-xs text-red-600 mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Party Name */}
            {visibleFields.partyName?.visible && (
              <FormField
                control={form.control}
                name="partyName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2.2fr] gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 items-start sm:items-center bg-white">
                      <FormLabel className="text-xs font-bold text-gray-700 sm:py-2">
                        Party Name
                      </FormLabel>
                      <div>
                        <FormControl>
                          <SheetLayoutComp
                            triggerContent={
                              <div className="relative w-full cursor-pointer">
                                <Input
                                  type="text"
                                  readOnly
                                  placeholder="Search"
                                  value={field.value || ""}
                                  className="w-full border-slate-200 focus-visible:ring-blue-500 rounded-xl h-10 text-xs font-semibold text-slate-800 pr-10 cursor-pointer"
                                />
                                {field.value && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      field.onChange("");
                                    }}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            }
                            sheetTitle="Parties"
                            side="right"
                          >
                            <QuickPartiesPage
                              bookId={bookId}
                              onValueChange={field.onChange}
                            />
                          </SheetLayoutComp>
                        </FormControl>
                        <FormMessage className="text-xs text-red-600 mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Payment Mode - always visible */}
            <FormField
              control={form.control}
              name="paymentMode"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="flex flex-col gap-2 py-4 px-6 bg-white">
                    <FormLabel className="text-xs font-bold text-gray-700">
                      Payment Mode
                    </FormLabel>
                    <div>
                      {isPaymentModesLoading ? (
                        <div className="flex items-center justify-start py-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                          <span className="text-xs text-slate-400 ml-2">Loading modes...</span>
                        </div>
                      ) : paymentModesData?.data && paymentModesData.data.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {paymentModesData.data.map((mode) => {
                            const isSelected = field.value === `${mode._id}#${mode.name}`;
                            return (
                              <button
                                key={mode._id}
                                type="button"
                                onClick={() => field.onChange(`${mode._id}#${mode.name}`)}
                                className={`px-4.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all border ${
                                  isSelected
                                    ? "bg-[#EEF3FF] text-[#3B82F6] border-[#3B82F6] shadow-sm font-bold"
                                    : "bg-[#F3F4F9] text-gray-700 border-transparent hover:bg-gray-200/60"
                                }`}
                              >
                                {mode.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 py-1">No payment modes found</div>
                      )}
                      <FormMessage className="text-xs text-red-600 mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Date */}
            {visibleFields.date?.visible && (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2.2fr] gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 items-start sm:items-center bg-white">
                      <FormLabel className="text-xs font-bold text-gray-700 sm:py-2">
                        Date *
                      </FormLabel>
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl h-10 text-xs font-semibold text-slate-800 hover:bg-slate-50",
                                  !field.value && "text-gray-500"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-gray-200 shadow-md">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-xs text-red-600 mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Description (Additional Information) */}
            {visibleFields.otherDetail?.visible && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2.2fr] gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 items-start bg-white">
                      <FormLabel className="text-xs font-bold text-gray-700 sm:pt-2.5">
                        Additional Information
                      </FormLabel>
                      <div>
                        <Textarea
                          placeholder="Enter Here"
                          className="min-h-[90px] border-slate-200 focus-visible:ring-blue-500 rounded-xl text-xs font-medium resize-none"
                          {...field}
                        />
                        <FormMessage className="text-xs text-red-600 mt-1" />
                      </div>
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
                  <FormItem className="space-y-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2.2fr] gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 items-start bg-white">
                      <FormLabel className="text-xs font-bold text-gray-700 sm:pt-2.5">
                        Remarks <span className="text-[10px] font-normal text-gray-400 italic ml-1">(Optional)</span>
                      </FormLabel>
                      <div>
                        <Textarea
                          placeholder="Enter Here"
                          className="min-h-[90px] border-slate-200 focus-visible:ring-blue-500 rounded-xl text-xs font-medium resize-none"
                          {...field}
                        />
                        <FormMessage className="text-xs text-red-600 mt-1" />
                      </div>
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
                  <FormItem className="space-y-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2.2fr] gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 items-start bg-white">
                      <FormLabel className="text-xs font-bold text-gray-700 sm:pt-2.5">
                        Attachment
                      </FormLabel>
                      <div className="w-full">
                        {/* Custom File Upload Input */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border border-dashed border-blue-400 rounded-xl bg-blue-50/10 hover:bg-blue-50/20 p-1 px-4.5 h-10 flex items-center cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs border-r border-blue-100 pr-4 mr-4">
                            <Upload className="w-4 h-4" />
                            <span>Choose File</span>
                          </div>
                          <span className="text-xs text-slate-500 font-semibold truncate flex-1">
                            {uploadedFiles.length > 0
                              ? `${uploadedFiles.length} file(s) selected`
                              : "No file choosen"}
                          </span>
                        </div>
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

                        {/* Uploaded Files Preview Grid */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-lg group"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {file.isImage ? (
                                      <div
                                        className="relative w-8 h-8 rounded border border-gray-200 overflow-hidden cursor-pointer"
                                        onClick={() => viewFile(index)}
                                      >
                                        <img
                                          src={file.croppedUrl || file.previewUrl}
                                          alt="Preview"
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.src = "/icons/image-icon.svg";
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold text-gray-700 truncate">
                                        {file.file.name}
                                      </p>
                                      <p className="text-[10px] text-gray-400">
                                        {(file.file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {file.isImage && !file.uploaded && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        className="h-7 w-7 p-0 bg-white hover:bg-gray-100 border"
                                        onClick={() => openCropModal(index)}
                                        title="Crop Image"
                                      >
                                        <Crop className="h-3.5 h-3.5 text-gray-600" />
                                      </Button>
                                    )}
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="secondary"
                                      className="h-7 w-7 p-0 bg-white hover:bg-gray-100 border text-red-500 hover:text-red-700"
                                      onClick={() => removeFile(index)}
                                      title="Remove File"
                                    >
                                      <Trash2 className="h-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <FormMessage className="text-xs text-red-600 mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="w-full px-6 pb-1">
            <Button
              type="submit"
              disabled={isCreatingTransaction || isUploading}
              className={`w-full h-10 rounded-[14px] shadow-sm text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                transactionType === "cash_in"
                  ? "bg-[#43AF51] hover:bg-[#3d9f49]"
                  : "bg-[#C54E4E] hover:bg-[#b04646]"
              }`}
            >
              {isCreatingTransaction ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {transactionType === "cash_in" ? (
                    <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[#43AF51]">
                      <ArrowDown className="w-3 h-3 stroke-[3.5]" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[#C54E4E]">
                      <ArrowUp className="w-3 h-3 stroke-[3.5]" />
                    </span>
                  )}
                  <span>Add {transactionType === "cash_in" ? "Cash In" : "Cash Out"}</span>
                </>
              )}
            </Button>
          </div>

        </form>
      </Form>

      {/* Image Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] z-[100]">
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
                  onError={(e) => {
                    e.currentTarget.src = "/icons/image-icon.svg";
                  }}
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

      {/* Crop Modal - FIXED WITH OK BUTTON */}
      <Dialog open={showCropModal} onOpenChange={handleCropModalClose}>
        <DialogContent
          ref={cropModalRef}
          className={`max-w-4xl ${isFullscreenCrop ? 'w-[95vw] h-[95vh] max-h-[95vh]' : 'max-h-[90vh]'} z-[9999] flex flex-col`}
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Image ({croppingFileIndex + 1} of {uploadedFiles.filter(f => f.isImage && !f.uploaded).length})
            </DialogTitle>
            <DialogDescription>
              Drag the corners to select the area you want to keep. Click and drag inside the crop area to reposition.
            </DialogDescription>
          </DialogHeader>

          {croppingFileIndex !== -1 && uploadedFiles[croppingFileIndex]?.isImage && (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              {/* Image crop area with fullscreen toggle */}
              <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white hover:bg-gray-100 shadow-md"
                    onClick={toggleFullscreenCrop}
                    title={isFullscreenCrop ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreenCrop ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="w-full h-full flex items-center justify-center p-2">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={undefined}
                    circularCrop={false}
                    className="max-w-full max-h-full"
                    ruleOfThirds
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
                            1, // Free aspect ratio
                            width,
                            height
                          ),
                          width,
                          height
                        );
                        setCrop(initialCrop);
                      }}
                      onError={(e) => {
                        console.error("Failed to load image for cropping");
                        skipCropping();
                      }}
                    />
                  </ReactCrop>
                </div>
              </div>

              {/* Image info */}
              <div className="flex-shrink-0 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Image Info:</p>
                  <p className="truncate">{uploadedFiles[croppingFileIndex].file.name}</p>
                  <p>Size: {(uploadedFiles[croppingFileIndex].file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {completedCrop && (
                  <div>
                    <p className="font-medium">Crop Dimensions:</p>
                    <p>{Math.round(completedCrop.width)}px × {Math.round(completedCrop.height)}px</p>
                    <p>Position: {Math.round(completedCrop.x)}, {Math.round(completedCrop.y)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hidden canvas for crop preview */}
          <canvas
            ref={previewCanvasRef}
            style={{
              display: 'none',
            }}
          />

          {/* ACTION BUTTONS SECTION - ALWAYS VISIBLE */}
          <DialogFooter className="crop-buttons-section flex-shrink-0 gap-2 sm:gap-0 flex-col sm:flex-row border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={skipCropping}
                disabled={isCropping}
                className="flex-1 sm:flex-none"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Skip This
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={skipAllCropping}
                disabled={isCropping}
                className="flex-1 sm:flex-none"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Skip All
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCropModalClose}
                disabled={isCropping}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCropPreview}
                disabled={isCropping || !completedCrop}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Preview & Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crop Preview Modal */}
      <Dialog open={showCropPreviewModal} onOpenChange={handleCropPreviewModalClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] z-[9999]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Confirm Crop
            </DialogTitle>
            <DialogDescription>
              Review your cropped image before uploading.
            </DialogDescription>
          </DialogHeader>

          {cropPreviewUrl && (
            <div className="space-y-4">
              <div className="relative w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={cropPreviewUrl}
                  alt="Cropped preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium">Ready to upload:</p>
                <p>Format: JPEG</p>
                <p>Quality: 90%</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleCropPreviewModalClose}
              disabled={isUploadingCrop}
              className="flex-1 sm:flex-none"
            >
              Back to Crop
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCrop}
              disabled={isUploadingCrop}
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
            >
              {isUploadingCrop ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm & Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
  return (
    <Link
      href={`${paths.dashboard.business.root}/${businessId}/${bookId}/fields/${slug}`}
    >
      <IconBox icon={Settings} />
    </Link>
  );
};