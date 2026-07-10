"use client";

import { TransactionFormValues, transactionFormSchema } from "@/schemes/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowDownCircle,
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
          <FormFieldSettings />

          {/* Book Name Display */}
          {cashbook?.name && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
              <Landmark className="h-4 w-4 text-blue-700" />
              <span className="text-sm font-medium text-blue-900">{cashbook.name}</span>
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
              render={({ field }) => (
                <FormItem className="relative">
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-md bg-gray-100">
                        <Landmark className="h-4 w-4 text-gray-700" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Category
                      </FormLabel>
                      <RedirectToSettingBtn
                        businessId={businessId}
                        bookId={bookId}
                        slug="category"
                      />
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={isCategoriesPending}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full">
                          <SelectValue
                            placeholder={
                              isCategoriesPending
                                ? "Loading categories..."
                                : "Select a category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        align="center"
                        position="item-aligned"
                        className="z-[9999] border-gray-300 shadow-md max-h-60"
                      >
                        {isCategoriesPending ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={`${category._id}#${category.name}`}
                              className="hover:bg-gray-100 capitalize"
                            >
                              {category.name.toLowerCase()}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No categories found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-600" />
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
                          <IconBox
                            containerClass="bg-destructive hover:bg-destructive/90 cursor-pointer"
                            icon={X}
                            iconClass="text-white"
                            onClick={() => field.onChange("")}
                          />
                        )}
                      </div>
                      <div className="w-full">
                        <FormControl>
                          <SheetLayoutComp
                            triggerContent={
                              <div className="flex justify-between items-center border border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full p-2 rounded-sm text-xs font-bold">
                                {field.value ? field.value : "Select Party"}
                                <ArrowRight className="w-5 h-5" />
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
                      </div>
                      <FormMessage className="text-xs text-red-600" />
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
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <CreditCard className="h-4 w-4 text-gray-700" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Payment Mode
                      </FormLabel>
                      <RedirectToSettingBtn
                        businessId={businessId}
                        bookId={bookId}
                        slug="payment-mode"
                      />
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={isPaymentModesLoading}
                    >
                      <FormControl>
                        <SelectTrigger onClick={() => alert("CLICKED")} className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full">
                          <SelectValue
                            placeholder={
                              isPaymentModesLoading
                                ? "Loading payment modes..."
                                : "Select payment mode"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        align="center"
                        position="item-aligned"
                        className="z-[9999] border-gray-300 shadow-md max-h-60"
                      >
                        {isPaymentModesLoading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : paymentModesData?.data && paymentModesData.data.length > 0 ? (
                          paymentModesData.data.map((mode) => (
                            <SelectItem
                              key={mode._id}
                              value={`${mode._id}#${mode.name}`}
                              className="hover:bg-gray-100 capitalize"
                            >
                              {mode.name.toLowerCase()}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No payment modes found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-600" />
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

          {/* Attachments Section - FIXED */}
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
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Upload Files"
                        )}
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

                    {/* File Previews - FIXED */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Uploaded Files:
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                                    alt={file.file.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = "/icons/image-icon.svg";
                                    }}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-4">
                                    <div className="text-gray-400 mb-2">
                                      {file.file.type.includes("pdf")
                                        ? "📄"
                                        : file.file.type.includes("word")
                                          ? "📝"
                                          : file.file.type.includes("excel")
                                            ? "📊"
                                            : "📎"}
                                    </div>
                                    <span className="text-xs text-center text-gray-600 truncate w-full">
                                      {file.file.name}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* File Info */}
                              <div className="p-2 bg-white border-t">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600 truncate flex-1">
                                    {file.file.name.length > 20
                                      ? `${file.file.name.substring(0, 15)}...${file.file.name.split('.').pop()}`
                                      : file.file.name}
                                  </span>
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
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                {file.isImage && !file.uploaded && (
                                  <>
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
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="secondary"
                                      className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                                      onClick={() => viewFile(index)}
                                      title="View Image"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
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

                    <div className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, PDF, DOC, XLS (max 5MB each)
                    </div>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isCreatingTransaction || isUploading}
              className="px-6 py-2 rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700"
            >
              {isCreatingTransaction ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Add ${transactionType === "cash_in" ? "Cash In" : "Cash Out"}`
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