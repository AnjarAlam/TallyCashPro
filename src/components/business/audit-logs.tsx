// "use client";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import {
//   Activity,
//   User,
//   Calendar,
//   FileText,
//   BadgeCheck,
//   BadgeAlert,
//   BadgeMinus,
//   RefreshCw,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useGetCompanyAuditLogs } from "@/services/business.service";

// interface AuditLogsSidebarProps {
//   companyId: string;
//   companyName: string;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function AuditLogsSidebar({
//   companyId,
//   companyName,
//   open,
//   onOpenChange,
// }: AuditLogsSidebarProps) {
//   const {
//     auditLogs,
//     isAuditLogsLoading,
//     isAuditLogsError,
//     refetchAuditLogs,
//   } = useGetCompanyAuditLogs(companyId);

//   const getChangeTypeIcon = (changeType: string) => {
//     switch (changeType) {
//       case "create":
//         return <BadgeCheck className="h-4 w-4 text-green-500" />;
//       case "update":
//         return <RefreshCw className="h-4 w-4 text-blue-500" />;
//       case "delete":
//         return <BadgeMinus className="h-4 w-4 text-red-500" />;
//       default:
//         return <BadgeAlert className="h-4 w-4 text-amber-500" />;
//     }
//   };

//   const getChangeTypeBadge = (changeType: string) => {
//     switch (changeType) {
//       case "create":
//         return (
//           <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
//             Created
//           </Badge>
//         );
//       case "update":
//         return (
//           <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
//             Updated
//           </Badge>
//         );
//       case "delete":
//         return (
//           <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
//             Deleted
//           </Badge>
//         );
//       default:
//         return (
//           <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
//             Modified
//           </Badge>
//         );
//     }
//   };

//   const formatChangeValues = (values: Record<string, any>) => {
//     return Object.entries(values)
//       .filter(
//         ([key]) => !["_id", "createdAt", "updatedAt", "__v"].includes(key)
//       )
//       .map(([key, value]) => ({
//         key,
//         value:
//           typeof value === "boolean" ? (value ? "Yes" : "No") : String(value),
//       }));
//   };

//   if (isAuditLogsError) {
//     return (
//       <Sheet open={open} onOpenChange={onOpenChange}>
//         <SheetContent side="right" className="w-full sm:max-w-md lg:max-w-lg">
//           <SheetHeader>
//             <SheetTitle className="flex items-center gap-2">
//               <Activity className="h-5 w-5" />
//               Audit Logs
//             </SheetTitle>
//             <SheetDescription>
//               Error loading audit logs for {companyName}
//             </SheetDescription>
//           </SheetHeader>

//           <div className="flex items-center justify-center h-full">
//             <p className="text-red-500">Failed to load audit logs</p>
//           </div>
//         </SheetContent>
//       </Sheet>
//     );
//   }

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="w-full sm:max-w-md lg:max-w-lg p-0 flex flex-col"
//       >
//         {/* HEADER */}
//         <SheetHeader className="p-6 pb-4 border-b shrink-0">
//           <div className="flex items-center justify-between">
//             <div>
//               <SheetTitle className="flex items-center gap-2 text-lg">
//                 <Activity className="h-5 w-5" />
//                 Audit Logs
//               </SheetTitle>
//               <SheetDescription className="mt-1">
//                 Activity history for {companyName}
//               </SheetDescription>
//             </div>

//             <button
//               onClick={() => refetchAuditLogs()}
//               className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//               title="Refresh logs"
//             >
//               <RefreshCw className="h-4 w-4" />
//             </button>
//           </div>
//         </SheetHeader>

//         {/* SCROLL CONTAINER (NO ScrollArea) */}
//         <div className="flex-1 overflow-y-auto p-6 pt-4">
//           {isAuditLogsLoading ? (
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="space-y-3 p-4 rounded-lg border"
//                 >
//                   <div className="flex justify-between">
//                     <Skeleton className="h-4 w-32" />
//                     <Skeleton className="h-6 w-16" />
//                   </div>
//                   <Skeleton className="h-4 w-48" />
//                   <Skeleton className="h-20 w-full" />
//                 </div>
//               ))}
//             </div>
//           ) : auditLogs.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//               <Activity className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
//               <h3 className="text-lg font-medium">No activity yet</h3>
//               <p className="text-gray-500 dark:text-gray-400">
//                 No audit logs found for this business
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {auditLogs.map((log) => (
//                 <div
//                   key={log._id}
//                   className="p-4 rounded-lg border bg-white dark:bg-gray-900/50"
//                 >
//                   <div className="flex justify-between mb-3">
//                     <div className="flex gap-2">
//                       {getChangeTypeIcon(log.changeType)}
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h4 className="font-medium">
//                             {log.action.replace(/_/g, " ")}
//                           </h4>
//                           {getChangeTypeBadge(log.changeType)}
//                         </div>
//                         <p className="text-sm text-gray-500">
//                           {log.changeReason}
//                         </p>
//                       </div>
//                     </div>

//                     <span className="text-xs text-gray-500 whitespace-nowrap">
//                       {formatDistanceToNow(
//                         new Date(log.changedAt),
//                         { addSuffix: true }
//                       )}
//                     </span>
//                   </div>

//                   <Separator className="my-3" />

//                   <div className="space-y-3 text-sm">
//                     <div className="flex items-center gap-2">
//                       <User className="h-4 w-4 text-gray-400" />
//                       <span className="font-medium">User:</span>
//                       <span>{log.changedBy.name}</span>
//                       <span className="text-gray-500">
//                         ({log.changedBy.email})
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-gray-400" />
//                       <span className="font-medium">Date:</span>
//                       <span>
//                         {new Date(log.changedAt).toLocaleDateString()} at{" "}
//                         {new Date(log.changedAt).toLocaleTimeString()}
//                       </span>
//                     </div>

//                     {Object.keys(log.newValues).length > 0 && (
//                       <div className="pt-2">
//                         <div className="flex items-center gap-2 mb-2">
//                           <FileText className="h-4 w-4 text-gray-400" />
//                           <span className="font-medium">Changes:</span>
//                         </div>

//                         <div className="pl-6 space-y-1">
//                           {formatChangeValues(log.newValues).map((item) => (
//                             <div key={item.key}>
//                               <span className="font-medium capitalize">
//                                 {item.key.replace(/([A-Z])/g, " $1")}:
//                               </span>{" "}
//                               <span className="text-gray-600 dark:text-gray-400">
//                                 {item.value}
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }




"use client";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Activity,
  User,
  Calendar,
  FileText,
  BadgeCheck,
  BadgeAlert,
  BadgeMinus,
  RefreshCw,
  Book,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBooksAuditLogs } from "@/services/business.service";

interface BooksAuditLogsSidebarProps {
  companyId: string;
  companyName: string;
  variant?: "sheet" | "page";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BooksAuditLogsSidebar({
  companyId,
  companyName,
  variant = "sheet",
  open = false,
  onOpenChange,
}: BooksAuditLogsSidebarProps) {
  const isPage = variant === "page";
  const {
    auditLogs,
    isAuditLogsLoading,
    isAuditLogsError,
    refetchAuditLogs,
  } = useGetBooksAuditLogs(companyId);

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case "create":
        return <BadgeCheck className="h-4 w-4 text-green-500" />;
      case "update":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "delete":
        return <BadgeMinus className="h-4 w-4 text-red-500" />;
      default:
        return <BadgeAlert className="h-4 w-4 text-amber-500" />;
    }
  };

  const getChangeTypeBadge = (changeType: string) => {
    switch (changeType) {
      case "create":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Created
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Updated
          </Badge>
        );
      case "delete":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Deleted
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            Modified
          </Badge>
        );
    }
  };

  const formatChangeValues = (values: Record<string, any>) => {
    return Object.entries(values)
      .filter(
        ([key]) => !["_id", "createdAt", "updatedAt", "__v"].includes(key)
      )
      .map(([key, value]) => ({
        key,
        value:
          typeof value === "boolean" ? (value ? "Yes" : "No") : String(value),
      }));
  };

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg">
      <Book className="h-12 w-12 text-red-300 mb-4" />
      <p className="text-red-500 font-medium">Failed to load books audit logs</p>
      <p className="text-sm text-gray-500 mt-2">
        Please try refreshing the page or contact support if the issue persists.
      </p>
      <button onClick={() => refetchAuditLogs()} className="mt-4 px-4 py-2 border rounded-md">Retry</button>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 p-4 rounded-lg border">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Book className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-medium mb-2">No book activity yet</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        No audit logs found for books in this company. 
        Changes to books will appear here.
      </p>
    </div>
  );

  const renderLogItem = (log: any) => (
    <div
      key={log._id}
      className="p-4 rounded-lg border bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-colors"
    >
      <div className="flex justify-between mb-3">
        <div className="flex gap-2">
          {getChangeTypeIcon(log.changeType)}
          <div>
            <div className="flex items-center gap-2">
              {getChangeTypeBadge(log.changeType)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {log.changeReason}
            </p>
          </div>
        </div>

        <span className="text-xs text-gray-500 whitespace-nowrap">
          {formatDistanceToNow(
            new Date(log.changedAt),
            { addSuffix: true }
          )}
        </span>
      </div>

      <Separator className="my-3" />

      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-gray-400" />
          <span className="font-medium">User:</span>
          <span>{log.changedBy.name}</span>
          <span className="text-gray-500 truncate max-w-[120px]">
            ({log.changedBy.email})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-medium">Date:</span>
          <span>
            {new Date(log.changedAt).toLocaleDateString()} at{" "}
            {new Date(log.changedAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );

  const panelBody = (
    <div className={isPage ? "flex flex-col w-full h-full overflow-hidden" : "flex flex-col h-full overflow-hidden"}>
      {/* HEADER */}
      <div className={isPage ? "p-6 pb-4 border-b shrink-0 bg-white" : "p-6 pb-4 border-b shrink-0 bg-white"}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <Book className="h-5 w-5" />
              Businesses Audit Logs
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Business activity history for {companyName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchAuditLogs()}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Refresh logs"
              disabled={isAuditLogsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isAuditLogsLoading ? 'animate-spin' : ''}`} />
            </button>
            {onOpenChange && (
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SCROLL CONTAINER */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 bg-gray-50/30">
        {isAuditLogsLoading ? (
          renderLoadingState()
        ) : auditLogs.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {auditLogs.map(renderLogItem)}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {!isAuditLogsLoading && auditLogs.length > 0 && (
        <div className="shrink-0 border-t p-4 text-xs text-gray-500 bg-white">
          <div className="flex justify-between items-center">
            <span>
              Showing {auditLogs.length} log{auditLogs.length !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-400">
              Last updated: {new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (isPage) {
    if (isAuditLogsError) {
      return renderErrorState();
    }
    return panelBody;
  }

  if (isAuditLogsError) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md lg:max-w-lg">
          {renderErrorState()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md lg:max-w-lg p-0 flex flex-col"
      >
        {panelBody}
      </SheetContent>
    </Sheet>
  );
}
