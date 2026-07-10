// "use client";

// import type React from "react";

// import { DeleteConfirmationForm, EditBusinessForm } from "@/components/form";
// import ModalLayout from "@/components/modals/modal-layout";
// import { Card, CardFooter } from "@/components/ui/card";
// import { DialogTitle } from "@/components/ui/dialog";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import type { CompanyInfo } from "@/interface";
// import { formatDate, hasPermission } from "@/lib";
// import { paths } from "@/routes/path";
// import { useCompanyMemberRole } from "@/services/check-role.service";
// import { Building2, Edit, Loader2, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// interface CompanyCardProps {
//   business: CompanyInfo;
//   onClick?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   type?: "switch" | "basic";
// }

// export default function BusinessCard({
//   business,
//   onClick,
//   onEdit,
//   onDelete,
//   type = "basic",
// }: CompanyCardProps) {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   const {
//     data: userRole,
//     isLoading: isLoadingRole,
//     isError: isRoleError,
//     error: roleError,
//   } = useCompanyMemberRole(business._id);

//   const createdAt = formatDate(business.createdAt, "Do-MMM-YYYY");
//   const updatedAt = formatDate(business.updatedAt, "Do-MMM-YYYY");
//   const [isHandlingAction, setIsHandlingAction] = useState(false);

//   const handleCardClick = (e: React.MouseEvent) => {
//     // Only navigate if the click wasn't on an action button
//     const target = e.target as HTMLElement;
//     const isActionButton = target.closest("[data-action-button]");

//     if (!isActionButton) {
//       onClick?.();
//       if (type === "basic")
//         router.push(paths.dashboard.business.view(business._id));
//     }
//   };

//   const handleDelete = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isHandlingAction) {
//       setIsHandlingAction(true);
//       try {
//         onDelete?.();
//       } finally {
//         setIsHandlingAction(false);
//       }
//     }
//   };

//   if (isLoadingRole) {
//     return (
//       <div className="flex items-center justify-center p-4 rounded-lg bg-background dark:bg-primary/40 border border-primary/40 shadow-md">
//         <Loader2 className="h-6 w-6 animate-spin" />
//       </div>
//     );
//   }

//   if (isRoleError) {
//     return (
//       <div className="p-4 rounded-lg bg-background dark:bg-primary/40 border border-red-500/40 shadow-md">
//         <p className="text-red-500">Error loading permissions</p>
//       </div>
//     );
//   }

//   const canDelete = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "owner",
//     },
//     "crud_cashbook",
//     "D"
//   );

//   const canEdit = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "owner",
//     },
//     "crud_cashbook",
//     "U"
//   );

//   return (
//     <div
//       className="group relative flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/40 p-4 transition-all duration-75 border border-primary/40 shadow-md dark:hover:bg-white/5 cursor-pointer"
//       onClick={handleCardClick}
//     >
//       <div className="flex items-start md:items-center w-full">
//         {/* Left Tag Icon */}
//         <div className="sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full bg-primary/10 dark:bg-white/10 h-min">
//           <Building2 className="w-6 h-6 text-primary dark:text-white" />
//         </div>

//         {/* Main content - takes up available space */}
//         <div className="flex-1 flex flex-col space-y-1 min-w-0">
//           <div className="flex items-center justify-between w-full">
//             <div>
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate capitalize">
//                 {business.name?.toLowerCase()}
//               </h3>
//               <p className="text-sm font-medium text-gray-500 line-clamp-2 capitalize">
//                 {business.description?.toLowerCase()}
//               </p>
//             </div>

//             {/* Action icons - placed on the right side */}
//             <div
//               className="flex items-center gap-2 ml-4"
//               data-action-button
//               onClick={(e) => e.stopPropagation()}
//             >
//               {canEdit && (
//                 <Sheet open={open} onOpenChange={setOpen}>
//                   <SheetTrigger asChild>
//                     <button
//                       className="p-2 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 group-hover:cursor-pointer"
//                       aria-label="Edit"
//                       data-action-button
//                       onClick={(e) => {
//                         // Only stop propagation, don't prevent default
//                         e.stopPropagation();
//                         onEdit?.();
//                       }}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </button>
//                   </SheetTrigger>
//                   <SheetContent
//                     // onClick={(e) => {
//                     //   // e.preventDefault();
//                     //   e.stopPropagation();
//                     // }}
//                     side="right"
//                     className="overflow-y-scroll pb-4 w-full sm:min-w-1/2 lg:min-w-1/3 duration-75 transition-all"
//                   >
//                     <DialogTitle />
//                     <EditBusinessForm
//                       onClose={() => setOpen(false)}
//                       business={business}
//                     />
//                   </SheetContent>
//                 </Sheet>
//               )}

//               {canDelete && (
//                 <ModalLayout
//                   trigger={
//                     <button
//                       onClick={(e) => {
//                         // Only stop propagation, don't prevent default
//                         e.stopPropagation();
//                         onEdit?.();
//                       }}
//                       disabled={isHandlingAction}
//                       className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 group-hover:cursor-pointer"
//                       aria-label="Delete"
//                       data-action-button
//                     >
//                       {isHandlingAction ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Trash2 className="h-4 w-4" />
//                       )}
//                     </button>
//                   }
//                 >
//                   <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//                     <CardFooter className="w-full p-0">
//                       <DeleteConfirmationForm
//                         onClose={() => setOpen(false)}
//                         id={business._id}
//                         type="business"
//                         itemName={"Business"} // cashbookId={""}
//                         // type="business"
//                         // businessId={business._id}
//                       />
//                     </CardFooter>
//                   </Card>
//                 </ModalLayout>
//               )}
//             </div>
//           </div>

//           {/* Timestamps */}
//           <div className="mt-2 border-t border-dashed w-full pt-3 hidden md:flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
//             <div className="flex items-center">
//               <span>Updated {updatedAt}</span>
//             </div>
//             <div className="flex items-center">
//               <span>Created {createdAt}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// -------------1----------------


// components/business/business-card.tsx
"use client";

import type React from "react";

import { DeleteConfirmationForm, EditBusinessForm } from "@/components/form";
import ModalLayout from "@/components/modals/modal-layout";
import { Card, CardFooter } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CompanyInfo } from "@/interface";
import { formatDate, hasPermission } from "@/lib";
import { paths } from "@/routes/path";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { 
  Building2, 
  Edit, 
  Loader2, 
  Settings, 
  Trash2, 
  Move, 
  Activity, 
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { BooksAuditLogsSidebar } from "@/components/business/audit-logs";
import { TeamManagementSidebar } from "@/components/business/team-management";

interface CompanyCardProps {
  business: CompanyInfo;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReorder?: () => void;
  type?: "switch" | "basic";
}

export default function BusinessCard({
  business,
  onClick,
  onEdit,
  onDelete,
  onReorder,
  type = "basic",
}: CompanyCardProps) {
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAuditLogs, setOpenAuditLogs] = useState(false);
  const [openTeamManagement, setOpenTeamManagement] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const router = useRouter();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const {
    data: userRole,
    isLoading: isLoadingRole,
    isError: isRoleError,
    error: roleError,
  } = useCompanyMemberRole(business._id);

  const createdAt = formatDate(business.createdAt, "Do-MMM-YYYY");
  const updatedAt = formatDate(business.updatedAt, "Do-MMM-YYYY");
  const [isHandlingAction, setIsHandlingAction] = useState(false);

  // Handle modal close events
  const handleModalClose = () => {
    setIsClosingModal(true);
    setTimeout(() => setIsClosingModal(false), 100);
  };

  const handleEditClose = () => {
    setOpenEditSheet(false);
    handleModalClose();
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
    handleModalClose();
  };

  const handleAuditLogsClose = () => {
    setOpenAuditLogs(false);
    handleModalClose();
  };

  const handleTeamManagementClose = () => {
    setOpenTeamManagement(false);
    handleModalClose();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent card click when modal is closing or any modal/sidebar is open
    if (isClosingModal || openEditSheet || openAuditLogs || openDeleteModal || openTeamManagement) {
      return;
    }
    
    const target = e.target as HTMLElement;
    const isActionButton = target.closest("[data-action-button]");
    const isMenuButton = target.closest("[data-menu-button]");
    const isDropdownMenu = target.closest("[data-dropdown-menu]");

    if (!isActionButton && !isMenuButton && !isDropdownMenu) {
      onClick?.();
      if (type === "basic")
        router.push(paths.dashboard.business.view(business._id));
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isHandlingAction) {
      setIsHandlingAction(true);
      try {
        onDelete?.();
      } finally {
        setIsHandlingAction(false);
      }
    }
  };

  const handleMenuAction = (action: 'edit' | 'reorder' | 'audit' | 'team' | 'delete', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    switch (action) {
      case 'edit':
        setOpenEditSheet(true);
        onEdit?.();
        break;
      case 'reorder':
        onReorder?.();
        break;
      case 'audit':
        setOpenAuditLogs(true);
        break;
      case 'team':
        setOpenTeamManagement(true);
        break;
      case 'delete':
        setOpenDeleteModal(true);
        break;
    }
    
    setMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuTriggerRef.current && 
        !menuTriggerRef.current.contains(event.target as Node) &&
        dropdownMenuRef.current && 
        !dropdownMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoadingRole) {
    return (
      <div className="flex items-center justify-center p-4 rounded-lg bg-background dark:bg-primary/40 border border-primary/40 shadow-md">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isRoleError) {
    return (
      <div className="p-4 rounded-lg bg-background dark:bg-primary/40 border border-red-500/40 shadow-md">
        <p className="text-red-500">Error loading permissions</p>
      </div>
    );
  }

  const canDelete = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "owner",
    },
    "crud_cashbook",
    "D"
  );

  const canEdit = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "owner",
    },
    "crud_cashbook",
    "U"
  );

  const canReorder = ["owner", "admin"].includes(userRole?.data.companyRole || "owner");
  const canViewAuditLogs = ["owner", "admin", "manager"].includes(userRole?.data.companyRole || "owner");
  const canManageTeam = ["owner", "admin", "partner"].includes(userRole?.data.companyRole || "owner");

  const hasAnyAction = canEdit || canReorder || canViewAuditLogs || canManageTeam || canDelete;

  return (
    <div
      className="group relative flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/40 p-4 transition-all duration-75 border border-primary/40 shadow-md dark:hover:bg-white/5 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start md:items-center w-full">
        {/* Left Tag Icon */}
        <div className="sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full bg-primary/10 dark:bg-white/10 h-min">
          <Building2 className="w-6 h-6 text-primary dark:text-white" />
        </div>

        {/* Main content - takes up available space */}
        <div className="flex-1 flex flex-col space-y-1 min-w-0">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate capitalize">
                {business.name?.toLowerCase()}
              </h3>
              <p className="text-sm font-medium text-gray-500 line-clamp-2 capitalize">
                {business.description?.toLowerCase()}
              </p>
            </div>

            {hasAnyAction && (
              <div
                className="flex items-center ml-4"
                data-action-button
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      ref={menuTriggerRef}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Business settings"
                      data-menu-button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    ref={dropdownMenuRef}
                    align="end" 
                    className="w-56"
                    data-dropdown-menu
                    onInteractOutside={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {canEdit && (
                      <DropdownMenuItem
                        onClick={(e) => handleMenuAction('edit', e)}
                        className="cursor-pointer flex items-center gap-2"
                        data-action-button
                      >
                        <Edit className="h-4 w-4" />
                        Edit Business
                      </DropdownMenuItem>
                    )}
                    
                    {canReorder && (
                      <DropdownMenuItem
                        onClick={(e) => handleMenuAction('reorder', e)}
                        className="cursor-pointer flex items-center gap-2"
                        data-action-button
                      >
                        <Move className="h-4 w-4" />
                        Reorder Business
                      </DropdownMenuItem>
                    )}

                    {canManageTeam && (
                      <>
                        {(canEdit || canReorder) && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          onClick={(e) => handleMenuAction('team', e)}
                          className="cursor-pointer flex items-center gap-2"
                          data-action-button
                        >
                          <Users className="h-4 w-4" />
                          Team Management
                        </DropdownMenuItem>
                      </>
                    )}

                    {canViewAuditLogs && (
                      <>
                        {(canEdit || canReorder || canManageTeam) && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          onClick={(e) => handleMenuAction('audit', e)}
                          className="cursor-pointer flex items-center gap-2"
                          data-action-button
                        >
                          <Activity className="h-4 w-4" />
                          Activities & Audit Logs
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {canDelete && (
                      <>
                        {(canEdit || canReorder || canManageTeam || canViewAuditLogs) && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          onClick={(e) => handleMenuAction('delete', e)}
                          className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                          data-action-button
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Business
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="mt-2 border-t border-dashed w-full pt-3 hidden md:flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center">
              <span>Updated {updatedAt}</span>
            </div>
            <div className="flex items-center">
              <span>Created {createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Sheet */}
      {canEdit && (
        <Sheet open={openEditSheet} onOpenChange={handleEditClose}>
          <SheetContent
            side="right"
            className="overflow-y-scroll pb-4 w-full sm:min-w-1/2 lg:min-w-1/3 duration-75 transition-all"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogTitle />
            <EditBusinessForm
              onClose={handleEditClose}
              business={business}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Team Management Sidebar */}
      {canManageTeam && (
        <TeamManagementSidebar
          companyId={business._id}
          companyName={business.name}
          open={openTeamManagement}
          onOpenChange={handleTeamManagementClose}
        />
      )}

      {/* Audit Logs Sidebar */}
      {canViewAuditLogs && (
        <BooksAuditLogsSidebar
          companyId={business._id}
          companyName={business.name}
          open={openAuditLogs}
          onOpenChange={handleAuditLogsClose}
        />
      )}

      {/* Delete Confirmation Modal */}
      {canDelete && (
        <ModalLayout
          open={openDeleteModal}
          onOpenChange={handleDeleteClose}
          trigger={<div className="hidden"></div>}
        >
          <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <CardFooter className="w-full p-0">
              <DeleteConfirmationForm
                onClose={handleDeleteClose}
                id={business._id}
                type="business"
                itemName={"Business"}
              />
            </CardFooter>
          </Card>
        </ModalLayout>
      )}
    </div>
  );
}