// components/form/cashbook/transfer-cashbook.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Loader2,
  Send,
  AlertCircle,
  Building,
  ArrowRight,
  Users,
  BookOpen,
  X,
  ChevronRight,
  Shield,
  FileText,
  Calendar,
  Mail,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CompanySelector } from "@/components/company-selector";
import { useTransferCashbook } from "@/services/cashbook.service";
import { toast } from "sonner";
import { useGetCompaniesForTransfer } from "@/services/business.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TransferCashbookFormProps {
  bookId: string;
  currentCompanyId: string;
  bookName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TransferCashbookForm({
  bookId,
  currentCompanyId,
  bookName,
  onClose,
  onSuccess,
}: TransferCashbookFormProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [transferReason, setTransferReason] = useState<string>("");
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the companies hook
  const {
    companies,
    isCompaniesLoading,
    isCompaniesError,
    companiesError,
    refetchCompanies,
  } = useGetCompaniesForTransfer();

  const {
    transferCashbook,
    isTransferringCashbook,
    isTransferCashbookError,
    transferCashbookError,
  } = useTransferCashbook();

  // Debug logging
  useEffect(() => {
    console.log("📊 Companies Data Debug:", {
      totalCompanies: companies.length,
      companies: companies.map((c) => ({ id: c._id, name: c.name })),
      currentCompanyId,
      availableCompanies: companies.filter((c) => c._id !== currentCompanyId).length,
      selectedCompanyId,
      isSelectedCompanyValid: selectedCompanyId && companies.some((c) => c._id === selectedCompanyId),
    });
  }, [companies, currentCompanyId, selectedCompanyId]);

  // Filter out current company
  const availableCompanies = companies.filter((company) => company._id !== currentCompanyId);

  const handleTransfer = async () => {
    if (!selectedCompanyId) {
      toast.error("Please select a company to transfer to");
      return;
    }

    // Validate selectedCompanyId
    if (typeof selectedCompanyId !== "string" || selectedCompanyId.trim() === "") {
      toast.error("Invalid company selected. Please try again.");
      return;
    }

    // Validate that selected company exists
    const selectedCompanyExists = availableCompanies.some(
      (company) => company._id === selectedCompanyId
    );

    if (!selectedCompanyExists) {
      toast.error("Selected company no longer exists. Please refresh and try again.");
      return;
    }

    setIsSubmitting(true);

    console.log("🚀 Starting Transfer - Payload:", {
      bookId: String(bookId),
      targetCompanyId: String(selectedCompanyId),
      transferReason: transferReason || undefined,
      payloadType: {
        bookId: typeof bookId,
        targetCompanyId: typeof selectedCompanyId,
        transferReason: typeof transferReason,
      },
    });

    try {
      transferCashbook(
        {
          bookId: String(bookId),
          targetCompanyId: String(selectedCompanyId),
          transferReason: transferReason.trim() || undefined,
        },
        {
          onSuccess: (data) => {
            console.log("✅ Transfer successful:", data);
            toast.success(data.message || "Cashbook transferred successfully!");
            onClose();
            onSuccess?.();
          },
          onError: (error) => {
            console.error("❌ Transfer error:", {
              error,
              message: error.message,
              fullError: JSON.stringify(error, null, 2),
            });

            // Check for specific error messages
            if (error.message?.includes("targetCompanyId must be a string")) {
              toast.error("Invalid company ID format. Please select a company again.");
              setSelectedCompanyId(""); // Reset selection
            } else if (error.message?.includes("should not be empty")) {
              toast.error("Please select a valid company to transfer to.");
            } else {
              toast.error(error.message || "Failed to transfer cashbook. Please try again.");
            }
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error("❌ Transfer exception:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectedCompany = availableCompanies.find((company) => company._id === selectedCompanyId);

  const currentCompany = companies.find((company) => company._id === currentCompanyId);

  // Handle refresh companies
  const handleRefreshCompanies = () => {
    refetchCompanies();
    toast.info("Refreshing company list...");
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (step === "confirm") {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b z-50 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Confirm Book Transfer</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Review details before transferring "<span className="font-semibold text-gray-700">{bookName}</span>"
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Transfer Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Transfer Summary</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Company */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-500">Transfer From</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {currentCompany?.logo ? (
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={currentCompany.logo} alt={currentCompany.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getAvatarInitials(currentCompany.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 border">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {currentCompany?.name?.charAt(0).toUpperCase() || "C"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{currentCompany?.name || "Current Company"}</p>
                        <p className="text-sm text-gray-500">ID: {currentCompanyId.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Company */}
                <Card className="border border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-600">Transfer To</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      {selectedCompany?.logo ? (
                        <Avatar className="h-12 w-12 border border-green-200">
                          <AvatarImage src={selectedCompany.logo} alt={selectedCompany.name} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {getAvatarInitials(selectedCompany.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 border border-green-200">
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {selectedCompany?.name?.charAt(0).toUpperCase() || "T"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-semibold text-green-800">{selectedCompany?.name}</p>
                        {selectedCompany?.email && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <Mail className="h-3 w-3" />
                            {selectedCompany.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Book Details */}
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-blue-800">Book Details</h4>
                          <p className="text-sm text-gray-600 mt-1">Complete information about the book being transferred</p>
                        </div>
                        <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                          Book ID: {bookId.slice(0, 8)}...
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Book Name</p>
                            <p className="font-medium">{bookName}</p>
                          </div>
                          <Badge variant="outline" className="bg-gray-100">
                            Active
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Current Location</p>
                            <p className="font-medium">{currentCompany?.name || "Current Company"}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <p className="text-sm font-medium text-gray-500">New Location</p>
                            <p className="font-medium text-green-700">{selectedCompany?.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transfer Direction Visual */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 border-dashed"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Transfer Direction</span>
                      <ArrowRight className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Reason */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-700" />
                  <Label htmlFor="transferReason" className="text-sm font-medium text-gray-900">
                    Transfer Reason (Optional)
                  </Label>
                </div>
                <div className="space-y-2">
                  <Textarea
                    id="transferReason"
                    placeholder="Example: Transferring to new company structure, Consolidating books, Company reorganization..."
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    rows={3}
                    className="resize-none border-gray-300 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    This helps maintain a clear audit trail for the transfer.
                  </p>
                </div>
              </div>
            </div>

          

            {/* Error Display */}
            {isTransferCashbookError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="space-y-2">
                  <div className="font-medium text-red-800">Transfer Failed</div>
                  <div className="text-sm text-red-700">
                    {transferCashbookError?.message || "Unknown error occurred"}
                  </div>
                  {transferCashbookError?.message?.includes("targetCompanyId") && (
                    <div className="text-xs bg-red-100 p-2 rounded border border-red-200">
                      <strong>Debug Info:</strong> Selected Company ID: "{selectedCompanyId}" (Type: {typeof selectedCompanyId})
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Transfer ID:</span> {bookId.slice(0, 12)}...
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setStep("select")} disabled={isTransferringCashbook || isSubmitting}>
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                Back
              </Button>
              <Button
                onClick={handleTransfer}
                disabled={isTransferringCashbook || isSubmitting || !selectedCompanyId}
                className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {(isTransferringCashbook || isSubmitting) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Transferring...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Confirm Transfer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SELECT STEP
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-50 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transfer Cashbook</h2>
              <p className="text-sm text-gray-500 mt-1">
                Select a company to transfer "<span className="font-semibold text-gray-700">{bookName}</span>"
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Current Book Info */}
          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">{bookName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800">{bookName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                        Book ID: {bookId.slice(0, 8)}...
                      </Badge>
                      <span className="text-xs text-blue-600">Ready for transfer</span>
                    </div>
                  </div>
                </div>
                {/* <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                  View Details
                </Button> */}
              </div>
            </CardContent>
          </Card>

          {/* Error Display for companies */}
          {isCompaniesError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong className="text-red-800">Failed to load companies:</strong>{" "}
                  <span className="text-red-700">{companiesError?.message}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefreshCompanies} className="h-7 text-xs border-red-300 text-red-700">
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Company Selector Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Select Target Company</h3>
              </div>
              <Badge variant="outline" className="bg-gray-100">
                {availableCompanies.length} available
              </Badge>
            </div>

            {availableCompanies.length === 0 && !isCompaniesLoading ? (
              <Card className="border border-dashed">
                <CardContent className="p-8 text-center">
                  <Building className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No other companies available</p>
                  <p className="text-sm text-gray-400">
                    You need access to at least one other company to transfer this book.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <CompanySelector
                  companies={availableCompanies}
                  onSelect={(companyId) => {
                    console.log("Company selected:", companyId, "Type:", typeof companyId);
                    // Ensure companyId is a string
                    if (companyId && typeof companyId === "string") {
                      setSelectedCompanyId(companyId);
                    } else {
                      console.error("Invalid companyId received:", companyId);
                      toast.error("Invalid company selection");
                    }
                  }}
                  selectedCompanyId={selectedCompanyId}
                  isLoading={isCompaniesLoading}
                  searchPlaceholder="Search companies by name or email..."
                  emptyMessage={
                    availableCompanies.length === 0
                      ? "No other companies available for transfer"
                      : "No companies match your search"
                  }
                />

                {selectedCompany && (
                  <Card className="border border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-green-600">Selected Company</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border border-green-300">
                            {selectedCompany.logo ? (
                              <AvatarImage src={selectedCompany.logo} alt={selectedCompany.name} />
                            ) : (
                              <AvatarFallback className="bg-green-100 text-green-700">
                                {selectedCompany.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-semibold text-green-800">{selectedCompany.name}</p>
                            {selectedCompany.email && (
                              <div className="flex items-center gap-1 text-sm text-green-600">
                                <Mail className="h-3 w-3" />
                                {selectedCompany.email}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-white text-green-700 border-green-300">
                          Ready for Transfer
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Validation Error */}
          {selectedCompanyId && !selectedCompany && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Selected company not found in list. Please refresh and try again.
              </AlertDescription>
            </Alert>
          )}


        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background border-t px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Step 1 of 2 • <span className="font-medium text-gray-700">Select Company</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="min-w-24">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedCompanyId) {
                  toast.error("Please select a company to continue");
                  return;
                }

                // Validate selected company exists
                if (!availableCompanies.some((c) => c._id === selectedCompanyId)) {
                  toast.error("Invalid company selected. Please choose from the list.");
                  return;
                }

                setStep("confirm");
              }}
              disabled={!selectedCompanyId || isCompaniesLoading || !selectedCompany}
              className="gap-2 min-w-24"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}