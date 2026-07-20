"use client";

import { AddBusinessACard, BusinessCard } from "@/components/cards";
import { BusinessCardSkeleton } from "@/components/skeleton";
import { CompanyInfo } from "@/interface";
import { useBusiness } from "@/providers/business-cashbook-provider";
import { useBusiness as useGlobalBusiness } from "@/hooks/use-business";
import { useGetCompanyList, useUpdateBusinessOrder } from "@/services/business.service";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Move,
  Check,
  X,
  Search,
  Plus,
  RefreshCw,
  Building2,
  Users,
  History,
  Settings,
  Trash2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableItem } from '@/components/dnd/sortable-item';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CreateBusinessForm, EditBusinessForm, DeleteConfirmationForm } from "@/components/form";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { hasPermission } from "@/lib";
import { TeamManagementSidebar } from "@/components/business/team-management";
import { BooksAuditLogsSidebar } from "@/components/business/audit-logs";
import { DeletedBooksScreen } from "@/components/business/deleted-books-screen";
import { paths } from "@/routes/path";
import Link from "next/link";
import ModalLayout from "@/components/modals/modal-layout";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  permissions?: {
    canEdit?: boolean;
    canDelete?: boolean;
  };
  type?: "basic" | "switch";
  onClick?: () => void;
  layout?: "split" | "grid";
}

const getAvatarInitials = (name?: string) => {
  if (!name) return "B";
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getGradientClass = (name: string) => {
  const gradients = [
    "from-blue-500 to-indigo-600 text-white shadow-blue-100",
    "from-emerald-500 to-teal-600 text-white shadow-emerald-100",
    "from-violet-500 to-purple-600 text-white shadow-violet-100",
    "from-amber-500 to-orange-600 text-white shadow-amber-100",
    "from-rose-500 to-pink-600 text-white shadow-rose-100",
    "from-cyan-500 to-blue-600 text-white shadow-cyan-100",
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
};

export default function BusinessList(props: CompanyCardProps) {
  const { type = "basic", onClick, layout = "grid" } = props;
  const { companyList: businesses, isCompanyListPending, refetchCompanyList: refetch } = useGetCompanyList();
  const { setCompanyInfo } = useBusiness();
  const globalBusiness = useGlobalBusiness();
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedBusinesses, setReorderedBusinesses] = useState<CompanyInfo[]>([]);
  const { updateBusinessOrder: updateOrder, isUpdatingOrder } = useUpdateBusinessOrder();

  // Split view states
  const [activeBusinessId, setActiveBusinessId] = useState<string>("");
  const [activePanelType, setActivePanelType] = useState<"placeholder" | "details" | "add_business" | "edit_business" | "team_management" | "audit_logs" | "deleted_books">("placeholder");
  const [selectedBusiness, setSelectedBusiness] = useState<CompanyInfo | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [deletedBooksRefreshTrigger, setDeletedBooksRefreshTrigger] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    if (businesses) {
      const companyList = businesses.map(b => b.company);
      setReorderedBusinesses(companyList);
    }
  }, [businesses]);

  // Keep selectedBusiness in sync when details are updated
  useEffect(() => {
    if (selectedBusiness && reorderedBusinesses.length > 0) {
      const updated = reorderedBusinesses.find(b => b._id === selectedBusiness._id);
      if (updated) {
        setSelectedBusiness(updated);
      }
    }
  }, [reorderedBusinesses, selectedBusiness]);

  // Auto-select active/stored business or fallback to first business in split view on initial load only
  useEffect(() => {
    if (layout === "split" && reorderedBusinesses.length > 0 && !hasInitialized) {
      const targetBiz = globalBusiness.businessInfo.id
        ? reorderedBusinesses.find(b => b._id === globalBusiness.businessInfo.id)
        : null;

      const activeBiz = targetBiz || reorderedBusinesses[0];

      setActiveBusinessId(activeBiz._id);
      setSelectedBusiness(activeBiz);
      setCompanyInfo(activeBiz);

      // Update global business provider context and localStorage
      globalBusiness.updateBusinessInfo({
        id: activeBiz._id,
        name: activeBiz.name,
        category: activeBiz.category,
        description: activeBiz.description,
      });
      localStorage.setItem("currentBusiness", JSON.stringify({
        id: activeBiz._id,
        name: activeBiz.name,
        category: activeBiz.category,
        description: activeBiz.description,
      }));

      setActivePanelType("details");
      setHasInitialized(true);
    }
  }, [reorderedBusinesses, layout, setCompanyInfo, hasInitialized, globalBusiness]);

  // Synchronize local states with global business context when it changes externally (e.g. from the sidebar dropdown)
  useEffect(() => {
    if (layout === "split" && hasInitialized && globalBusiness.businessInfo.id) {
      if (globalBusiness.businessInfo.id !== activeBusinessId) {
        const matched = reorderedBusinesses.find(b => b._id === globalBusiness.businessInfo.id);
        if (matched) {
          setActiveBusinessId(matched._id);
          setSelectedBusiness(matched);
          setCompanyInfo(matched);
          setActivePanelType("details");
        }
      }
    }
  }, [globalBusiness.businessInfo.id, reorderedBusinesses, layout, activeBusinessId, setCompanyInfo, hasInitialized]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setReorderedBusinesses((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = () => {
    if (!reorderedBusinesses.length) return;

    const orderData = reorderedBusinesses.map((business, index) => ({
      companyId: business._id,
      order: index
    }));

    updateOrder(orderData, {
      onSuccess: () => {
        setIsReordering(false);
        refetch();
        toast.success("Business order updated successfully");
      },
      onError: (error) => {
        console.error('Failed to update order:', error);
        toast.error(error?.message || "Failed to update business order");
      }
    });
  };

  const handleCancelReorder = () => {
    if (businesses) {
      const companyList = businesses.map(b => b.company);
      setReorderedBusinesses(companyList);
    }
    setIsReordering(false);
  };

  const handleReorderClick = () => {
    setIsReordering(true);
  };

  const handleSelectBusiness = (business: CompanyInfo) => {
    if (activeBusinessId === business._id) {
      setActiveBusinessId("");
      setSelectedBusiness(null);
      setCompanyInfo(null as any);
      setActivePanelType("placeholder");
      if (window.innerWidth < 768) {
        setIsMobileOpen(false);
      }
    } else {
      setActiveBusinessId(business._id);
      setSelectedBusiness(business);
      setCompanyInfo(business);

      // Update global business provider context and localStorage
      globalBusiness.updateBusinessInfo({
        id: business._id,
        name: business.name,
        category: business.category,
        description: business.description,
      });
      localStorage.setItem("currentBusiness", JSON.stringify({
        id: business._id,
        name: business.name,
        category: business.category,
        description: business.description,
      }));

      setActivePanelType("details");
      if (window.innerWidth < 768) {
        setIsMobileOpen(true);
      }
    }
  };

  const filteredBusinessesList = reorderedBusinesses.filter(b => {
    const nameMatch = b.name.toLowerCase().includes(searchText.toLowerCase());
    const descMatch = b.description?.toLowerCase().includes(searchText.toLowerCase()) || false;
    const catMatch = b.category?.toLowerCase().includes(searchText.toLowerCase()) || false;
    return nameMatch || descMatch || catMatch;
  });

  const BusinessDetailsView = ({
    business,
    onBack,
    refetchList,
  }: {
    business: CompanyInfo;
    onBack?: () => void;
    refetchList: () => void;
  }) => {
    const { data: userRole } = useCompanyMemberRole(business._id);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [actionsOpen, setActionsOpen] = useState(true);

    const role = userRole?.data?.companyRole;
    const canEdit = hasPermission({ businessRole: role }, "crud_business", "U");
    const canDelete = hasPermission({ businessRole: role }, "crud_business", "D");

    const createdAt = new Date(business.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const updatedAt = new Date(business.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0 bg-white">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="md:hidden p-1.5 hover:bg-gray-100 rounded-full">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">{business.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
                  {business.category?.replace(/_/g, " ") || "Retail Store"}
                </Badge>
                {role && (
                  <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-none px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {role}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20">
          {/* Description & Overview */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Overview</h3>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {business.description || "No description provided."}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Created On</span>
                <span className="font-semibold text-gray-700 mt-0.5 block">{createdAt}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Last Updated</span>
                <span className="font-semibold text-gray-700 mt-0.5 block">{updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-3">
            <button
              onClick={() => setActionsOpen(!actionsOpen)}
              className="flex items-center justify-between w-full px-1 py-2 text-left hover:bg-gray-50/80 rounded-xl transition-all cursor-pointer group"
            >
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">
                Actions & Management
              </h3>
              {actionsOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform" />
              )}
            </button>

            {actionsOpen && (
              <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Go to Books */}
                <Link
                  href={`${paths.dashboard.business.view(business._id)}/book`}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-md shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Go to Cash Books</h4>
                      <p className="text-white/80 text-[10px] mt-0.5">Manage ledger entries, cash flow and balances</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Team Management */}
                <Link
                  href="/dashboard/team-management"
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-xl">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">Team Management</h4>
                      <p className="text-gray-500 text-[10px] mt-0.5">Invite, remove, and manage permissions of partners or staff</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                {/* Audit Logs */}
                <button
                  onClick={() => {
                    setActivePanelType("audit_logs");
                    if (window.innerWidth < 768) setIsMobileOpen(true);
                  }}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-xl">
                      <History className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">Audit Logs & Activities</h4>
                      <p className="text-gray-500 text-[10px] mt-0.5">Track modifications, ledger activities and access logs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Edit Settings */}
                {canEdit && (
                  <button
                    onClick={() => {
                      setActivePanelType("edit_business");
                      if (window.innerWidth < 768) setIsMobileOpen(true);
                    }}
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-xl">
                        <Settings className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">Edit Business</h4>
                        <p className="text-gray-500 text-[10px] mt-0.5">Modify title, description, category and details</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                )}

                {/* Deleted Books */}
                <button
                  onClick={() => {
                    setActivePanelType("deleted_books");
                    if (window.innerWidth < 768) setIsMobileOpen(true);
                  }}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100/80 rounded-xl">
                      <Trash2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">Deleted Books</h4>
                      <p className="text-gray-500 text-[10px] mt-0.5">Restore cashbooks deleted in the last 15 days</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Delete Business */}
                {canDelete && (
                  <button
                    onClick={() => setOpenDeleteModal(true)}
                    className="flex items-center justify-between p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 rounded-2xl shadow-sm transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-100/50 rounded-xl group-hover:bg-rose-100 transition-colors">
                        <Trash2 className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-rose-700">Delete Business</h4>
                        <p className="text-rose-600/80 text-[10px] mt-0.5">Permanently remove this business and all its books</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {canDelete && (
          <ModalLayout
            open={openDeleteModal}
            onOpenChange={(open) => {
              setOpenDeleteModal(open);
              if (!open) {
                refetchList();
              }
            }}
            trigger={<div className="hidden"></div>}
          >
            <Card className="bg-white p-4 rounded-lg shadow-md border-none">
              <CardFooter className="w-full p-0">
                <DeleteConfirmationForm
                  onClose={() => {
                    setOpenDeleteModal(false);
                    refetchList();
                    onBack?.();
                  }}
                  id={business._id}
                  type="business"
                  itemName={business.name}
                />
              </CardFooter>
            </Card>
          </ModalLayout>
        )}
      </div>
    );
  };

  const renderRightPanelContent = () => {
    if (!selectedBusiness && activePanelType !== "add_business") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/20 select-none">
          <div className="relative w-20 h-20 mb-4 text-gray-300 dark:text-gray-600 animate-pulse">
            <Building2 className="w-20 h-20" />
          </div>
          <h3 className="text-base font-bold text-gray-800">No Business Selected</h3>
          <p className="max-w-xs mt-2 text-xs text-gray-500 leading-relaxed font-medium">
            Click on any business from the list to view its details, team management, audit logs, or edit its settings.
          </p>
        </div>
      );
    }

    switch (activePanelType) {
      case "add_business":
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between p-4 border-b shrink-0 bg-white">
              <button
                onClick={() => {
                  setActivePanelType(selectedBusiness ? "details" : "placeholder");
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <CreateBusinessForm
                onClose={() => {
                  setActivePanelType(selectedBusiness ? "details" : "placeholder");
                  setIsMobileOpen(false);
                  refetch();
                }}
              />
            </div>
          </div>
        );
      case "edit_business":
        if (!selectedBusiness) return null;
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between p-4 border-b shrink-0 bg-white">
              <button
                onClick={() => {
                  setActivePanelType("details");
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EditBusinessForm
                business={selectedBusiness}
                onClose={() => {
                  setActivePanelType("details");
                  setIsMobileOpen(false);
                  refetch();
                }}
              />
            </div>
          </div>
        );
      case "team_management":
        if (!selectedBusiness) return null;
        return (
          <div className="flex flex-col h-full bg-white overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b shrink-0 bg-white">
              <button
                onClick={() => {
                  setActivePanelType("details");
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TeamManagementSidebar
                companyId={selectedBusiness._id}
                companyName={selectedBusiness.name}
                variant="page"
              />
            </div>
          </div>
        );
      case "audit_logs":
        if (!selectedBusiness) return null;
        return (
          <div className="flex flex-col h-full bg-white overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b shrink-0 bg-white">
              <button
                onClick={() => {
                  setActivePanelType("details");
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <BooksAuditLogsSidebar
                companyId={selectedBusiness._id}
                companyName={selectedBusiness.name}
                variant="page"
              />
            </div>
          </div>
        );
      case "deleted_books":
        if (!selectedBusiness) return null;
        return (
          <div className="flex flex-col h-full bg-white overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b shrink-0 bg-white">
              <button
                onClick={() => {
                  setActivePanelType("details");
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletedBooksRefreshTrigger((prev) => prev + 1)}
                className="h-8 px-3 text-xs font-semibold text-gray-600 hover:text-gray-950 border-gray-200 bg-white hover:bg-gray-50 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Refresh deleted books"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                <span>Refresh</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DeletedBooksScreen
                businessId={selectedBusiness._id}
                refreshTrigger={deletedBooksRefreshTrigger}
              />
            </div>
          </div>
        );
      case "details":
        if (!selectedBusiness) return null;
        return (
          <BusinessDetailsView
            business={selectedBusiness}
            onBack={() => setIsMobileOpen(false)}
            refetchList={() => {
              refetch();
              setActivePanelType("placeholder");
              setSelectedBusiness(null);
              setActiveBusinessId("");
            }}
          />
        );
      case "placeholder":
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/20 select-none">
            <div className="relative w-20 h-20 mb-4 text-gray-300 dark:text-gray-600 animate-pulse">
              <Building2 className="w-20 h-20" />
            </div>
            <h3 className="text-base font-bold text-gray-800">No Business Selected</h3>
            <p className="max-w-xs mt-2 text-xs text-gray-500 leading-relaxed font-medium">
              Click on any business from the list to view its details, team management, audit logs, or edit its settings.
            </p>
          </div>
        );
    }
  };

  // Rendering for standard Grid list (overview page / switch)
  if (isCompanyListPending) {
    if (layout === "split") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-5 h-[calc(100vh-32px)] mx-[-8px] md:mx-[-24px] overflow-hidden bg-white">
          <div className="col-span-1 md:col-span-3 flex flex-col h-full bg-white border-r border-gray-100 overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-gray-100 animate-pulse rounded" />
              <div className="h-6 w-20 bg-gray-100 animate-pulse rounded" />
            </div>
            <div className="h-10 w-full bg-gray-50 animate-pulse rounded-xl" />
            <div className="space-y-3 flex-1 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-gray-50 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
          <div className="col-span-2 hidden md:block h-full bg-gray-50/20 p-6 space-y-6">
            <div className="h-12 w-48 bg-gray-100 animate-pulse rounded" />
            <div className="h-32 w-full bg-gray-100 animate-pulse rounded-2xl" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 w-full bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
        <AddBusinessACard />
        {[...Array(3)].map((_, i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // RENDER DUAL-PANE SPLIT VIEW FOR THE MAIN BUSINESS LIST PAGE
  if (layout === "split") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-7 h-[calc(100vh-32px)] mx-[-8px] md:mx-[-24px] overflow-hidden bg-white">

        {/* LEFT PANEL: Console and List */}
        <div className="flex flex-col col-span-1 md:col-span-4 h-full min-w-0 bg-white border-r border-gray-100 overflow-hidden">

          {/* Header row inside LEFT PANEL */}
          <div className="flex items-center justify-between px-6 pb-2 pt-2 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-extrabold text-gray-900 uppercase tracking-wide">
                All Businesses
              </h2>
              {reorderedBusinesses.length > 0 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {reorderedBusinesses.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="h-7 border-gray-200 text-[13px] font-semibold px-2 hover:bg-gray-50 flex items-center gap-1 text-gray-700 rounded-lg shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </Button>

              {!isReordering && reorderedBusinesses.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReorderClick}
                  className="h-7 border-gray-200 text-[10px] font-semibold px-2 hover:bg-gray-50 flex items-center gap-1 text-gray-700 rounded-lg shrink-0 cursor-pointer"
                >
                  <Move className="w-3 h-3" />
                  <span>Reorder</span>
                </Button>
              )}

              {isReordering && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelReorder}
                    disabled={isUpdatingOrder}
                    className="h-7 border-gray-200 text-[10px] font-semibold px-2 hover:bg-gray-50 flex items-center gap-1 text-gray-700 rounded-lg shrink-0 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveOrder}
                    disabled={isUpdatingOrder}
                    className="h-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-2 text-[10px] flex items-center gap-1 shadow-sm transition-all duration-200 active:scale-95 shrink-0 cursor-pointer animate-in fade-in zoom-in-95 duration-150"
                  >
                    {isUpdatingOrder ? (
                      <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    <span>Save Order</span>
                  </Button>
                </div>
              )}

              <Button
                size="sm"
                onClick={() => {
                  setIsCreateDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-3 h-7 text-[13px] flex items-center gap-1 shadow-sm transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
              >
                <span>Add Business</span>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-6 py-3 border-b border-gray-100 bg-white shrink-0">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search Businesses..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-12 pl-10 pr-8 bg-gray-50 border-gray-200 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100 rounded-xl transition-all placeholder:text-gray-400 text-sm font-medium"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* List area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/20">
            {filteredBusinessesList.length > 0 ? (
              <div className="space-y-2">
                {isReordering ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={filteredBusinessesList.map(b => b._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredBusinessesList.map((business) => (
                        <SortableItem key={business._id} id={business._id}>
                          <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-xs">
                            <Move className="w-4 h-4 text-gray-400 cursor-grab shrink-0" />
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br ${getGradientClass(business.name)} shrink-0 shadow-sm`}>
                              {getAvatarInitials(business.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">{business.name}</h3>
                              <p className="text-[10px] text-gray-500 truncate capitalize">{business.category?.replace(/_/g, " ") || "Retail Store"}</p>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  filteredBusinessesList.map((business) => {
                    const isSelected = activeBusinessId === business._id;
                    return (
                      <div
                        key={business._id}
                        onClick={() => handleSelectBusiness(business)}
                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-150 hover:bg-gray-50/50 ${isSelected
                          ? "border-blue-500 bg-blue-50/20 shadow-xs shadow-blue-50/20 ring-2 ring-blue-500/10"
                          : "border-gray-200 bg-white"
                          }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br ${getGradientClass(business.name)} shrink-0 shadow-sm`}>
                          {getAvatarInitials(business.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{business.name}</h3>
                          <p className="text-[10px] text-gray-500 truncate capitalize">{business.category?.replace(/_/g, " ") || "Retail Store"}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isSelected ? "text-blue-500 translate-x-0.5" : "text-gray-400"}`} />
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-sm font-semibold text-gray-700">No Businesses Found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                  {searchText ? "No businesses match your search query." : "Click 'New Business' to create one."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP RIGHT PANEL: Details/Forms/Settings */}
        <div className="hidden md:block col-span-3 border-l border-gray-100 h-full overflow-hidden bg-gray-50/20">
          {renderRightPanelContent()}
        </div>

        {/* MOBILE RIGHT PANEL: Drawer overlay */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-hidden">
            {renderRightPanelContent()}
          </SheetContent>
        </Sheet>

        {/* Create Business Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="w-[92%] sm:min-w-[536px] max-h-[90vh] overflow-y-auto p-5 bg-white rounded-2xl border border-slate-200/50 shadow-2xl scrollbar-none">
            <DialogTitle className="sr-only">Add New Business</DialogTitle>
            <CreateBusinessForm
              onClose={() => {
                setIsCreateDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // DEFAULT GRID LAYOUT (Overview Page, Switch list, etc.)
  return (
    <div className="space-y-4 mt-7">
      <div className="md:px-5 px-2 flex justify-between items-end">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">All Businesses</h2>
          {isReordering && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Move className="h-4 w-4 animate-pulse" />
              <span>Drag to reorder</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {businesses && businesses.length > 0 ? (
            <h2 className="text-sm md:text-lg text-gray-500">{businesses.length} Businesses</h2>
          ) : null}

          {!isReordering && businesses && businesses.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReorderClick}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Reorder
            </Button>
          )}

          {isReordering && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelReorder}
                disabled={isUpdatingOrder}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveOrder}
                disabled={isUpdatingOrder}
                className="flex items-center gap-2"
              >
                {isUpdatingOrder ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Save Order
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:px-4">
        {businesses && businesses.length > 0 ? (
          <>
            {type != "switch" && <AddBusinessACard />}

            {isReordering ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={reorderedBusinesses.map(b => b._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {reorderedBusinesses?.map((business) => (
                    <SortableItem key={business._id} id={business._id}>
                      <BusinessCard
                        type={type}
                        onClick={() => {
                          onClick?.();
                          setCompanyInfo(business as CompanyInfo);
                        }}
                        onReorder={handleReorderClick}
                        key={business._id}
                        business={business}
                      />
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              businesses?.map((business) => (
                <BusinessCard
                  type={type}
                  onClick={() => {
                    onClick?.();
                    setCompanyInfo(business?.company as CompanyInfo);
                  }}
                  onReorder={handleReorderClick}
                  key={business.company._id}
                  business={business.company}
                />
              ))
            )}
          </>
        ) : (
          type != "switch" && <AddBusinessACard />
        )}
      </div>
    </div>
  );
}