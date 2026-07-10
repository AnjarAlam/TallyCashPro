
// ---1--

// // components/business/team-management.tsx
// "use client";

// import { useState } from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import {
//   Users,
//   BookOpen,
//   User,
//   Shield,
//   Eye,
//   Edit,
//   Activity,
//   Mail,
//   Briefcase,
//   Search,
//   UserPlus,
//   X,
//   Star,
//   Loader2,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { useCompanyMembers, useChangeMemberRole } from "@/services/team.service";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { AddBusinessMemberForm } from "@/components/form/business/add-member";

// interface TeamManagementSidebarProps {
//   companyId: string;
//   companyName: string;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// interface BookMember {
//   id: string;
//   name: string;
//   email: string;
//   bookId: string;
//   bookName: string;
//   bookRole: "ADMIN" | "EDITOR" | "VIEWER" | "ACCOUNTANT";
//   bookCurrency?: string;
//   permissions?: string[];
// }

// export const TeamManagementSidebar = ({ 
//   companyId, 
//   companyName, 
//   open, 
//   onOpenChange 
// }: TeamManagementSidebarProps) => {
//   const [activeTab, setActiveTab] = useState<"business" | "books">("business");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showRoleDialog, setShowRoleDialog] = useState(false);
//   const [showAddMemberSheet, setShowAddMemberSheet] = useState(false);
//   const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
//   const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
//   const [selectedNewRole, setSelectedNewRole] = useState<"owner" | "partner" | "staff" | null>(null);

//   // Real API call for business members
//   const {
//     data: membersData,
//     isLoading: membersLoading,
//     isError: membersError,
//     error: membersErrorData,
//     refetch: refetchMembers,
//   } = useCompanyMembers(companyId);

//   // Hook for changing member role
//   const { mutate: changeMemberRole, isPending: isChangingRole } = useChangeMemberRole();

//   // Mock data for books tab
//   const bookMembers: BookMember[] = [
//     {
//       id: "1",
//       name: "Pallav Mishra",
//       email: "pallavmishra20@gmail.com",
//       bookId: "book1",
//       bookName: "Tuntun",
//       bookRole: "EDITOR",
//       bookCurrency: "USD",
//     },
//     {
//       id: "2",
//       name: "Pallav Mishra",
//       email: "pallavmishra20@gmail.com",
//       bookId: "book2",
//       bookName: "Bus",
//       bookRole: "ADMIN",
//       bookCurrency: "USD",
//     },
//     {
//       id: "3",
//       name: "Pallav Mishra",
//       email: "pallavmishra20@gmail.com",
//       bookId: "book3",
//       bookName: "Food Expense",
//       bookRole: "VIEWER",
//       bookCurrency: "INR",
//     },
//     {
//       id: "4",
//       name: "Rahul09",
//       email: "rahul09@gmail.com",
//       bookId: "book3",
//       bookName: "Food Expense",
//       bookRole: "VIEWER",
//       bookCurrency: "INR",
//     },
//   ];

//   const getRoleIcon = (role?: string) => {
//     if (!role) return <User className="h-4 w-4 text-gray-500" />;

//     switch (role.toLowerCase()) {
//       case 'owner':
//         return <Star className="h-4 w-4 text-amber-500" />;
//       case 'partner':
//         return <Briefcase className="h-4 w-4 text-blue-500" />;
//       case 'staff':
//         return <User className="h-4 w-4 text-gray-500" />;
//       default:
//         return <User className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const getBookRoleIcon = (role: string) => {
//     switch (role) {
//       case 'ADMIN':
//         return <Shield className="h-3.5 w-3.5 text-purple-600" />;
//       case 'EDITOR':
//         return <Edit className="h-3.5 w-3.5 text-blue-600" />;
//       case 'VIEWER':
//         return <Eye className="h-3.5 w-3.5 text-gray-600" />;
//       case 'ACCOUNTANT':
//         return <Activity className="h-3.5 w-3.5 text-green-600" />;
//       default:
//         return <User className="h-3.5 w-3.5 text-gray-500" />;
//     }
//   };

//   const getRoleBadge = (role?: string) => {
//     if (!role) return "bg-gray-100 text-gray-800 border-gray-200 text-xs";

//     switch (role.toLowerCase()) {
//       case 'owner':
//         return "bg-amber-100 text-amber-800 border-amber-200 text-xs";
//       case 'partner':
//         return "bg-blue-100 text-blue-800 border-blue-200 text-xs";
//       case 'staff':
//         return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
//     }
//   };

//   const getBookRoleBadge = (role: string) => {
//     switch (role) {
//       case 'ADMIN':
//         return "bg-purple-100 text-purple-800 border-purple-200 text-xs";
//       case 'EDITOR':
//         return "bg-blue-100 text-blue-800 border-blue-200 text-xs";
//       case 'VIEWER':
//         return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
//       case 'ACCOUNTANT':
//         return "bg-green-100 text-green-800 border-green-200 text-xs";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
//     }
//   };

//   const getAvatarInitials = (name?: string) => {
//     if (!name) return "U";
//     return name
//       .split(' ')
//       .map(part => part[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Extract business members from API data
//   const businessMembers = membersData?.data || [];

//   // Filter data based on search query with safe checks
//   const filteredBusinessMembers = businessMembers.filter(member => {
//     const name = member.user?.name || "";
//     const email = member.user?.email || "";
//     const role = member.companyRole || "";

//     return (
//       name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       role.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   // Handle role change confirmation
//   const handleRoleChangeConfirm = () => {
//     if (!selectedMemberId || !selectedNewRole) return;

//     changeMemberRole(
//       { memberId: selectedMemberId, newRole: selectedNewRole },
//       {
//         onSuccess: () => {
//           setShowRoleDialog(false);
//           setSelectedMemberId(null);
//           setSelectedMemberName(null);
//           setSelectedNewRole(null);
//         },
//       }
//     );
//   };

//   // Handle open role change dialog
//   const handleOpenRoleDialog = (memberId: string, memberName: string, currentRole: string) => {
//     setSelectedMemberId(memberId);
//     setSelectedMemberName(memberName);
//     setSelectedNewRole(currentRole as "owner" | "partner" | "staff");
//     setShowRoleDialog(true);
//   };

//   const filteredBookMembers = bookMembers.filter(member =>
//     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.bookRole.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Group book members by book name
//   const groupedBookMembers = filteredBookMembers.reduce((acc, member) => {
//     if (!acc[member.bookName]) {
//       acc[member.bookName] = {
//         bookId: member.bookId,
//         bookName: member.bookName,
//         bookCurrency: member.bookCurrency || "USD",
//         members: []
//       };
//     }
//     acc[member.bookName].members.push(member);
//     return acc;
//   }, {} as Record<string, { bookId: string; bookName: string; bookCurrency: string; members: typeof bookMembers }>);

//   const renderLoading = () => (
//     <div className="flex justify-center items-center h-64">
//       <Loader2 className="h-8 w-8 animate-spin" />
//     </div>
//   );

//   const renderError = () => (
//     <div className="text-center py-8 text-red-500">
//       Error loading business members: {membersErrorData?.message}
//       <Button onClick={() => refetchMembers()} variant="ghost" className="ml-4">
//         Retry
//       </Button>
//     </div>
//   );

//   const renderEmptyState = (type: "business" | "books") => (
//     <div className="text-center py-8 text-gray-500">
//       No {type === "business" ? "business members" : "book assignments"} found
//     </div>
//   );

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="overflow-y-auto pb-4 w-full sm:min-w-[520px] lg:min-w-[500px] duration-75 transition-all p-0"
//       >
//         <div className="flex flex-col h-full">
//           {/* Header with Close Button and Add Member Button */}
//           <div className="sticky top-0 bg-background border-b z-50 px-6 py-4">
//             <div className="flex items-center justify-between mb-4">
//               <SheetHeader className="flex-1">
//                 <SheetTitle className="text-xl font-bold text-gray-900">
//                   Team Management
//                 </SheetTitle>
//                 <SheetDescription className="text-sm text-gray-500 mt-1">
//                   Manage team members and permissions for 
//                   <span className="font-semibold text-gray-700 ml-1">{companyName}</span>
//                 </SheetDescription>
//               </SheetHeader>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="default"
//                   size="sm"
//                   className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 px-3 py-1.5 h-8"
//                   onClick={() => setShowAddMemberSheet(true)}
//                 >
//                   <UserPlus className="h-3.5 w-3.5" />
//                   <span className="text-sm">Add Member</span>
//                 </Button>

//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => onOpenChange(false)}
//                   className="h-7 w-7 rounded-full hover:bg-gray-100"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="relative mb-3">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//               <Input
//                 type="search"
//                 placeholder="Search members, roles, or books..."
//                 className="pl-9 w-full h-9 text-sm"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <Tabs 
//               defaultValue="business" 
//               value={activeTab}
//               onValueChange={(value) => setActiveTab(value as "business" | "books")}
//               className="w-full"
//             >
//               <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg h-9">
//                 <TabsTrigger 
//                   value="business" 
//                   className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
//                 >
//                   <Users className="h-3.5 w-3.5" />
//                   <span>Business</span>
//                   <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
//                     {businessMembers.length}
//                   </Badge>
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="books" 
//                   className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
//                 >
//                   <BookOpen className="h-3.5 w-3.5" />
//                   <span>Books</span>
//                   <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
//                     {bookMembers.length}
//                   </Badge>
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             <div className="px-6 py-4">
//               <Tabs 
//                 defaultValue="business" 
//                 value={activeTab}
//                 onValueChange={(value) => setActiveTab(value as "business" | "books")}
//                 className="w-full"
//               >
//                 {/* Business-wise Members Tab - USING REAL API DATA */}
//                 <TabsContent value="business" className="space-y-4">
//                   {membersLoading ? (
//                     renderLoading()
//                   ) : membersError ? (
//                     renderError()
//                   ) : !businessMembers.length ? (
//                     renderEmptyState("business")
//                   ) : (
//                     <>
//                       {/* Company Overview - Compact */}
//                       <div className="flex items-center gap-6 p-2.5 bg-gray-50 rounded-lg">
//                         <div className="flex items-center gap-2">
//                           <Users className="h-4 w-4 text-gray-600" />
//                           <span className="text-sm font-medium text-gray-700">Members</span>
//                           <span className="text-sm font-bold text-gray-900">{businessMembers.length}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <BookOpen className="h-4 w-4 text-gray-600" />
//                           <span className="text-sm font-medium text-gray-700">Books</span>
//                           <span className="text-sm font-bold text-gray-900">9</span>
//                         </div>
//                       </div>

//                       {/* Roles & Permissions Section - Compact */}
//                       <div className="space-y-3">
//                         <h3 className="text-base font-semibold text-gray-900">
//                           Business Roles & Permissions
//                         </h3>

//                         <div className="space-y-2">
//                           <Card className="border border-blue-100 bg-blue-50">
//                             <CardContent className="p-3">
//                               <div className="flex items-start gap-2.5">
//                                 <div className="p-1.5 bg-white rounded-md shadow-xs">
//                                   <Briefcase className="h-4 w-4 text-blue-600" />
//                                 </div>
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-1.5">
//                                     <h4 className="text-sm font-bold text-blue-800">PARTNER</h4>
//                                     <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
//                                       Business Level
//                                     </Badge>
//                                   </div>
//                                   <p className="text-xs text-gray-600 mt-1 leading-relaxed">
//                                     Full access to manage books, members, and business operations
//                                   </p>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>

//                           <Card className="border border-green-100 bg-green-50">
//                             <CardContent className="p-3">
//                               <div className="flex items-start gap-2.5">
//                                 <div className="p-1.5 bg-white rounded-md shadow-xs">
//                                   <User className="h-4 w-4 text-green-600" />
//                                 </div>
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-1.5">
//                                     <h4 className="text-sm font-bold text-green-800">STAFF</h4>
//                                     <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
//                                       Business Level
//                                     </Badge>
//                                   </div>
//                                   <p className="text-xs text-gray-600 mt-1 leading-relaxed">
//                                     Team member with access based on assigned book permissions
//                                   </p>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </div>
//                       </div>

//                       {/* Current Members Section - Compact Cards */}
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                           <h3 className="text-base font-semibold text-gray-900">
//                             Current Members
//                           </h3>
//                           <span className="text-xs text-gray-500">
//                             {filteredBusinessMembers.length} of {businessMembers.length}
//                           </span>
//                         </div>

//                         <div className="space-y-2">
//                           {filteredBusinessMembers.map((member) => {
//                             const memberName = member.user?.name || member.user?.email || "Unknown User";
//                             const memberEmail = member.user?.email || "No email";
//                             const memberRole = member.companyRole || "Unknown Role";

//                             return (
//                               <Card key={member._id} className="border border-gray-200 hover:border-gray-300 transition-colors">
//                                 <CardContent className="p-3">
//                                   <div className="flex items-center justify-between gap-2">
//                                     <div className="flex items-center gap-2.5 min-w-0 flex-1">
//                                       <Avatar className="h-8 w-8 border">
//                                         <AvatarFallback className={memberRole === 'owner' ? 'bg-amber-100 text-amber-700 text-xs' : 'bg-gray-100 text-gray-700 text-xs'}>
//                                           {getAvatarInitials(memberName)}
//                                         </AvatarFallback>
//                                       </Avatar>
//                                       <div className="min-w-0 flex-1">
//                                         <div className="flex items-center gap-1.5">
//                                           <h4 className="text-sm font-semibold text-gray-900 truncate">
//                                             {memberName}
//                                           </h4>
//                                           {getRoleIcon(memberRole)}
//                                         </div>
//                                         <div className="flex items-center gap-1.5 mt-0.5">
//                                           <Mail className="h-3 w-3 text-gray-400" />
//                                           <p className="text-xs text-gray-500 truncate">{memberEmail}</p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-1.5">
//                                       <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className={`${getRoleBadge(memberRole)} px-2 py-0.5 h-5 text-xs cursor-pointer hover:shadow-md transition-all`}
//                                         onClick={() => handleOpenRoleDialog(member._id, memberName, memberRole)}
//                                       >
//                                         {memberRole}
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 </CardContent>
//                               </Card>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </TabsContent>

//                 {/* Book-wise Members Tab - USING MOCK DATA */}
//                 <TabsContent value="books" className="space-y-4">
//                   {/* Book Roles & Permissions Section - Compact */}
//                   <div className="space-y-3">
//                     <h3 className="text-base font-semibold text-gray-900">
//                       Book Access Levels
//                     </h3>

//                     <div className="grid grid-cols-1 gap-3">
//                       <Card className="border border-purple-100 bg-purple-50">
//                         <CardContent className="p-3">
//                           <div className="flex items-start gap-2.5">
//                             <div className="p-1.5 bg-white rounded-md shadow-xs">
//                               <Shield className="h-4 w-4 text-purple-600" />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-sm font-bold text-purple-800">ADMIN</h4>
//                               <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Manage all book members</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Edit all transactions</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Configure book settings</span>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       <Card className="border border-blue-100 bg-blue-50">
//                         <CardContent className="p-3">
//                           <div className="flex items-start gap-2.5">
//                             <div className="p-1.5 bg-white rounded-md shadow-xs">
//                               <Edit className="h-4 w-4 text-blue-600" />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-sm font-bold text-blue-800">EDITOR</h4>
//                               <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Add/edit transactions</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Manage parties & categories</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <XCircle className="h-3 w-3 text-red-400" />
//                                   <span>Cannot manage members</span>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       <Card className="border border-gray-200 bg-gray-50">
//                         <CardContent className="p-3">
//                           <div className="flex items-start gap-2.5">
//                             <div className="p-1.5 bg-white rounded-md shadow-xs">
//                               <Eye className="h-4 w-4 text-gray-600" />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-sm font-bold text-gray-800">VIEWER</h4>
//                               <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>View all transactions</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Access reports</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <XCircle className="h-3 w-3 text-red-400" />
//                                   <span>No editing permissions</span>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       <Card className="border border-green-100 bg-green-50">
//                         <CardContent className="p-3">
//                           <div className="flex items-start gap-2.5">
//                             <div className="p-1.5 bg-white rounded-md shadow-xs">
//                               <Activity className="h-4 w-4 text-green-600" />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-sm font-bold text-green-800">ACCOUNTANT</h4>
//                               <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Custom date range access</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Manage transactions within period</span>
//                                 </li>
//                                 <li className="flex items-center gap-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-500" />
//                                   <span>Generate period reports</span>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </div>

//                   {/* Book Assignments Section - Compact */}
//                   {!filteredBookMembers.length ? (
//                     renderEmptyState("books")
//                   ) : (
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-base font-semibold text-gray-900">
//                           Book Assignments
//                         </h3>
//                         <span className="text-xs text-gray-500">
//                           {filteredBookMembers.length} assignments
//                         </span>
//                       </div>

//                       <div className="space-y-3">
//                         {Object.entries(groupedBookMembers).map(([bookName, bookData]) => (
//                           <Card key={bookName} className="border border-gray-200">
//                             <div className="p-3">
//                               <div className="flex items-center justify-between mb-2">
//                                 <div className="flex items-center gap-2.5">
//                                   <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
//                                     <BookOpen className="h-4 w-4 text-gray-700" />
//                                   </div>
//                                   <div className="min-w-0">
//                                     <h4 className="text-sm font-bold text-gray-900 truncate">
//                                       {bookName}
//                                     </h4>
//                                     <div className="flex items-center gap-1.5 mt-0.5">
//                                       <Badge variant="outline" className="bg-gray-100 text-xs px-1.5 py-0 h-5">
//                                         {bookData.bookCurrency || 'USD'}
//                                       </Badge>
//                                       <span className="text-xs text-gray-500">
//                                         {bookData.members.length} member{bookData.members.length !== 1 ? 's' : ''}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
//                                   Manage
//                                 </Button>
//                               </div>
//                               <Separator className="my-2" />
//                               <div className="space-y-2">
//                                 {bookData.members.map((member) => (
//                                   <div key={member.id} className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2 min-w-0 flex-1">
//                                       <Avatar className="h-6 w-6">
//                                         <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
//                                           {getAvatarInitials(member.name)}
//                                         </AvatarFallback>
//                                       </Avatar>
//                                       <div className="min-w-0">
//                                         <p className="text-xs font-medium text-gray-900 truncate">
//                                           {member.name}
//                                         </p>
//                                         <p className="text-xs text-gray-500 truncate">
//                                           {member.email}
//                                         </p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-1.5">
//                                       {getBookRoleIcon(member.bookRole)}
//                                       <Badge variant="outline" className={`${getBookRoleBadge(member.bookRole)} px-1.5 py-0 h-5`}>
//                                         {member.bookRole}
//                                       </Badge>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </div>

//           {/* Footer - Compact */}
//           <div className="sticky bottom-0 bg-background border-t px-6 py-3">
//             <div className="flex items-center justify-between">
//               <div className="text-xs text-gray-500">
//                 <span className="font-medium text-gray-700">{businessMembers.length}</span> business members •{' '}
//                 <span className="font-medium text-gray-700">{bookMembers.length}</span> book assignments
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button 
//                   variant="outline" 
//                   size="sm" 
//                   className="h-8 px-3 text-sm"
//                   onClick={() => onOpenChange(false)}
//                 >
//                   Close
//                 </Button>
//                 <Button 
//                   className="bg-gray-900 hover:bg-gray-800 h-8 px-3 text-sm"
//                 >
//                   Save Changes
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </SheetContent>

//       {/* Role Change Dialog */}
//       <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
//         <DialogContent className="sm:max-w-[400px] z-[9999]">
//           <DialogHeader>
//             <DialogTitle>Change Member Role</DialogTitle>
//             <DialogDescription>
//               Update the role for <span className="font-semibold text-gray-900">{selectedMemberName}</span>
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700">New Role</label>
//               <Select
//                 value={selectedNewRole || ""}
//                 onValueChange={(value) => setSelectedNewRole(value as "owner" | "partner" | "staff")}
//               >
//                 <SelectTrigger className="border-gray-300">
//                   <SelectValue placeholder="Select a role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="owner">
//                     <div className="flex items-center gap-2">
//                       <Star className="h-4 w-4 text-amber-500" />
//                       <span>Owner</span>
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="partner">
//                     <div className="flex items-center gap-2">
//                       <Briefcase className="h-4 w-4 text-blue-500" />
//                       <span>Partner</span>
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="staff">
//                     <div className="flex items-center gap-2">
//                       <User className="h-4 w-4 text-gray-500" />
//                       <span>Staff</span>
//                     </div>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
//               <p className="text-xs text-blue-800 leading-relaxed">
//                 <span className="font-semibold">Note:</span> Changing a member's role will update their permissions across all books in this business.
//               </p>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setShowRoleDialog(false)}
//               disabled={isChangingRole}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleRoleChangeConfirm}
//               disabled={isChangingRole || !selectedNewRole}
//               className="bg-gray-900 hover:bg-gray-800"
//             >
//               {isChangingRole ? "Updating..." : "Update Role"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Member Sheet */}
//       <Sheet open={showAddMemberSheet} onOpenChange={setShowAddMemberSheet}>
//         <SheetContent
//           side="right"
//           className="w-full sm:max-w-[420px] overflow-y-auto"
//         >
//           <SheetHeader>
//             <SheetTitle>Add Team Member</SheetTitle>
//             <SheetDescription>
//               Invite a new member to your business. They'll receive an email invitation to join.
//             </SheetDescription>
//           </SheetHeader>

//           <div className="mt-6">
//             <AddBusinessMemberForm 
//               businessId={companyId}
//               onClose={() => {
//                 setShowAddMemberSheet(false);
//                 // Optionally refetch members here if needed
//                 refetchMembers();
//               }}
//             />
//           </div>
//         </SheetContent>
//       </Sheet>
//     </Sheet>
//   );
// };


// -----1-----------

// components/business/team-management.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  User,
  Shield,
  Eye,
  Edit,
  Activity,
  Mail,
  Briefcase,
  Search,
  UserPlus,
  X,
  Star,
  Loader2,
  CheckCircle,
  XCircle,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { useCompanyMembers, useChangeMemberRole } from "@/services/team.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddBusinessMemberForm } from "@/components/form/business/add-member";
import { AddMemberToBookForm } from "@/components/form/cashbook/add-member";
import {
  useGetUserBooks,
  useGetBookMembers,
  useChangeMemberBookRole,
  useRemoveMemberFromBook,
  useAddMemberToBook,
} from "@/services/company.member.books.service";
import { toast } from "sonner";
import { APIS } from "@/constants/api";
import {
  AccountantDurationModal,
  AccountantDurationResult,
} from "@/components/modals/accountant-duration-modal";

interface TeamManagementSidebarProps {
  companyId: string;
  companyName: string;
  /** Sheet on business card; full page from business settings */
  variant?: "sheet" | "page";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface BookData {
  _id: string;
  name: string;
  description: string;
  status: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  totalIn: number;
  totalOut: number;
  balance: number;
}

interface BookMember {
  id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    photoURL?: string;
  };
  role: "admin" | "editor" | "viewer" | "accountant";
}

interface BookWithMembers extends BookData {
  members: BookMember[];
}

export const TeamManagementSidebar = ({
  companyId,
  companyName,
  variant = "sheet",
  open = false,
  onOpenChange,
}: TeamManagementSidebarProps) => {
  const isPage = variant === "page";
  const isPanelOpen = isPage || open;
  const [activeTab, setActiveTab] = useState<"business" | "books">("business");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showAddMemberSheet, setShowAddMemberSheet] = useState(false);
  const [showAddBookMemberSheet, setShowAddBookMemberSheet] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<"owner" | "partner" | "staff" | null>(null);
  const [selectedBookMember, setSelectedBookMember] = useState<{
    bookId: string;
    bookName: string;
    memberId: string;
    memberName: string;
    currentRole: string;
  } | null>(null);
  const [booksWithMembers, setBooksWithMembers] = useState<BookWithMembers[]>([]);
  const [accountantDurationState, setAccountantDurationState] = useState<{
    open: boolean;
    bookId: string;
    memberBookId: string;
  } | null>(null);

  // Real API call for business members
  const {
    data: membersData,
    isLoading: membersLoading,
    isError: membersError,
    error: membersErrorData,
    refetch: refetchMembers,
  } = useCompanyMembers(companyId);

  // API call for user books
  const {
    userBooks = [],
    isUserBooksPending: booksLoading,
    isUserBooksError: booksError,
    userBooksError: booksErrorData,
    refetchUserBooks: refetchBooks,
  } = useGetUserBooks(
    { companyId, textSearch: searchQuery },
    activeTab === "books" && isPanelOpen
  );

  // API call for book members (will be called for each book)
  const [bookMembersData, setBookMembersData] = useState<Record<string, BookMember[]>>({});

  // Hooks for book member operations
  const { changeMemberBookRole, isChangingMemberBookRole } = useChangeMemberBookRole();
  const { removeMemberFromBook } = useRemoveMemberFromBook();
  const { addMemberToBook, isAddingMemberToBook } = useAddMemberToBook();

  // Hook for changing member role (business)
  const { mutate: changeMemberRole, isPending: isChangingRole } = useChangeMemberRole();

  useEffect(() => {
    if (activeTab === "books" && isPanelOpen && userBooks.length > 0) {
      // Initialize books with members
      const books = userBooks.map((book: any) => ({
        ...book,
        members: bookMembersData[book._id] || [],
      }));
      setBooksWithMembers(books as BookWithMembers[]);
    }
  }, [userBooks, activeTab, isPanelOpen, bookMembersData]);

  useEffect(() => {
    // Fetch book members when books tab is opened
    if (activeTab === "books" && isPanelOpen && userBooks.length > 0) {
      userBooks.forEach((book: any) => {
        if (!bookMembersData[book._id]) {
          fetchBookMembers(book._id);
        }
      });
    }
  }, [activeTab, isPanelOpen, userBooks]);

  const fetchBookMembers = async (bookId: string) => {
    try {
      const url = APIS.CompanyMemberBooks.getBookMembers.Url(companyId, bookId);
      const response = await axiosInstance.get(url);
      const data = response.data;

      if (data.data) {
        console.log('📚 Book Members Structure:', data.data[0]); // Log first member to see structure
        setBookMembersData(prev => ({
          ...prev,
          [bookId]: data.data
        }));

        // Update booksWithMembers state
        setBooksWithMembers(prev => prev.map(book =>
          book._id === bookId
            ? { ...book, members: data.data }
            : book
        ));
      }
    } catch (error) {
      console.error(`Error fetching members for book ${bookId}:`, error);
      toast.error("Failed to fetch book members");
    }
  };

  const getRoleIcon = (role?: string) => {
    if (!role) return <User className="h-4 w-4 text-gray-500" />;

    switch (role.toLowerCase()) {
      case 'owner':
        return <Star className="h-4 w-4 text-amber-500" />;
      case 'partner':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'staff':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBookRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Shield className="h-3.5 w-3.5 text-purple-600" />;
      case 'data_operator':
        return <Edit className="h-3.5 w-3.5 text-blue-600" />;
      case 'viewer':
        return <Eye className="h-3.5 w-3.5 text-gray-600" />;
      case 'accountant':
        return <Activity className="h-3.5 w-3.5 text-green-600" />;
      default:
        return <User className="h-3.5 w-3.5 text-gray-500" />;
    }
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return "bg-gray-100 text-gray-800 border-gray-200 text-xs";

    switch (role.toLowerCase()) {
      case 'owner':
        return "bg-amber-100 text-amber-800 border-amber-200 text-xs";
      case 'partner':
        return "bg-blue-100 text-blue-800 border-blue-200 text-xs";
      case 'staff':
        return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
    }
  };

  const getBookRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return "bg-purple-100 text-purple-800 border-purple-200 text-xs";
      case 'data_operator':
        return "bg-blue-100 text-blue-800 border-blue-200 text-xs";
      case 'viewer':
        return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
      case 'accountant':
        return "bg-green-100 text-green-800 border-green-200 text-xs";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
    }
  };

  const getAvatarInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Extract business members from API data
  const businessMembers = membersData?.data || [];

  // Filter business members based on search query
  const filteredBusinessMembers = businessMembers.filter(member => {
    const name = member.user?.name || "";
    const email = member.user?.email || "";
    const role = member.companyRole || "";

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter books based on search query
  const filteredBooks = booksWithMembers.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.members.some(member =>
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle business role change confirmation
  const handleRoleChangeConfirm = () => {
    if (!selectedMemberId || !selectedNewRole) return;

    changeMemberRole(
      { memberId: selectedMemberId, newRole: selectedNewRole },
      {
        onSuccess: () => {
          setShowRoleDialog(false);
          setSelectedMemberId(null);
          setSelectedMemberName(null);
          setSelectedNewRole(null);
          refetchMembers();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to change role");
        }
      }
    );
  };

  // Handle open business member role change
  const handleOpenRoleDialog = (memberId: string, memberName: string, currentRole: string) => {
    setSelectedMemberId(memberId);
    setSelectedMemberName(memberName);
    setSelectedNewRole(currentRole as "owner" | "partner" | "staff");
    setShowRoleDialog(true);
  };

  // Handle book member role change
  const handleBookRoleChange = (bookId: string, memberBookId: string, newRole: string) => {
    if (newRole === "accountant") {
      setAccountantDurationState({ open: true, bookId, memberBookId });
      return;
    }
    changeMemberBookRole(
      {
        memberBookId,
        newRole: newRole as "admin" | "editor" | "viewer" | "accountant"
      },
      {
        onSuccess: () => {
          toast.success("Role updated successfully");
          fetchBookMembers(bookId);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update role");
        }
      }
    );
  };

  const onAccountantDurationConfirm = (result: AccountantDurationResult) => {
    if (!accountantDurationState) return;
    const { bookId, memberBookId } = accountantDurationState;
    changeMemberBookRole(
      {
        memberBookId,
        newRole: "accountant",
        dataAccessDurationDays: result.dataAccessDurationDays,
      },
      {
        onSuccess: () => {
          toast.success("Role updated successfully");
          fetchBookMembers(bookId);
          setAccountantDurationState(null);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update role");
        }
      }
    );
  };

  const [deleteConfirmationData, setDeleteConfirmationData] = useState<{
    bookId: string;
    userId: string;
    memberName: string;
  } | null>(null);
  const [deleteInputValue, setDeleteInputValue] = useState("");

  // Real mutation function
  const executeRemoveMember = (bookId: string, userId: string) => {
    console.log("Executing removal:", { companyId, bookId, userId });
    removeMemberFromBook(
      {
        companyId,
        bookId,
        userId
      },
      {
        onSuccess: () => {
          toast.success("Member removed successfully");
          fetchBookMembers(bookId);
          setDeleteConfirmationData(null);
          setDeleteInputValue("");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to remove member");
        }
      }
    );
  };

  // Trigger function
  const handleRemoveMemberFromBook = (bookId: string, userId: string, memberName: string) => {
    setDeleteConfirmationData({ bookId, userId, memberName });
    setDeleteInputValue("");
  };

  // Handle add member to book
  // const handleAddMemberToBook = (bookId: string, email: string, role: string) => {
  //   addMemberToBook(
  //     {
  //       bookId,
  //       email,
  //       role: role as "admin" | "editor" | "viewer" | "accountant"
  //     },
  //     {
  //       onSuccess: () => {
  //         toast.success("Member added to book successfully");
  //         fetchBookMembers(bookId);
  //         setShowAddBookMemberSheet(false);
  //       },
  //       onError: (error) => {
  //         toast.error(error.message || "Failed to add member to book");
  //       }
  //     }
  //   );
  // };

  // Handle open book member role change
  const handleOpenBookRoleDialog = (
    bookId: string,
    bookName: string,
    memberId: string,
    memberName: string,
    currentRole: string
  ) => {
    setSelectedBookMember({
      bookId,
      bookName,
      memberId,
      memberName,
      currentRole
    });
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  const renderError = (error: any, retryFunction: () => void) => (
    <div className="text-center py-8 text-red-500">
      Error loading data: {error?.message}
      <Button onClick={retryFunction} variant="ghost" className="ml-4">
        Retry
      </Button>
    </div>
  );

  const renderEmptyState = (type: "business" | "books") => (
    <div className="text-center py-8 text-gray-500">
      No {type === "business" ? "business members" : "books"} found
    </div>
  );

  const panelBody = (
    <div className={isPage ? "flex flex-col w-full" : "flex flex-col h-full"}>
      <div
        className={
          isPage
            ? "sticky top-0 bg-background border-b z-10 pb-4 mb-2"
            : "sticky top-0 bg-background border-b z-50 px-6 py-4"
        }
      >
        {!isPage && (
          <div className="flex items-center justify-between mb-4">
            <SheetHeader className="flex-1">
              <SheetTitle className="text-xl font-bold text-gray-900">
                Team Management
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500 mt-1">
                Manage team members and permissions for
                <span className="font-semibold text-gray-700 ml-1">{companyName}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange?.(false)}
                className="h-7 w-7 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isPage && (
          <p className="text-sm text-gray-500 mb-4">
            Manage team members and permissions for{" "}
            <span className="font-semibold text-gray-700">{companyName}</span>
          </p>
        )}

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search members, books, or roles..."
                className="pl-9 w-full h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs
              defaultValue="business"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "business" | "books")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg h-9">
                <TabsTrigger
                  value="business"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Business</span>

                </TabsTrigger>
                <TabsTrigger
                  value="books"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Books</span>

                </TabsTrigger>
              </TabsList>
            </Tabs>
      </div>

      <div className={isPage ? "w-full" : "flex-1 overflow-y-auto"}>
        <div className={isPage ? "py-2" : "px-6 py-4"}>
              <Tabs
                defaultValue="business"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "business" | "books")}
                className="w-full"
              >
                {/* Business-wise Members Tab - USING REAL API DATA */}
                <TabsContent value="business" className="space-y-4">
                  {membersLoading ? (
                    renderLoading()
                  ) : membersError ? (
                    renderError(membersErrorData, refetchMembers)
                  ) : !businessMembers.length ? (
                    renderEmptyState("business")
                  ) : (
                    <>
                      {/* Company Overview - Compact */}
                      {/* <div className="flex items-center gap-6 p-2.5 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Members</span>
                          <span className="text-sm font-bold text-gray-900">{businessMembers.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Books</span>
                          <span className="text-sm font-bold text-gray-900">{userBooks.length}</span>
                        </div>
                      </div> */}

                      {/* Roles & Permissions Section - Compact */}
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          Business Roles & Permissions
                        </h3>

                        <div className="space-y-2">
                          <Card className="border border-blue-100 bg-blue-50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 bg-white rounded-md shadow-xs">
                                  <Briefcase className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-sm font-bold text-blue-800">PARTNER</h4>
                                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                      Business Level
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    Full access to manage books, members, and business operations
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border border-green-100 bg-green-50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 bg-white rounded-md shadow-xs">
                                  <User className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-sm font-bold text-green-800">STAFF</h4>
                                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                      Business Level
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    Team member with access based on assigned book permissions
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Current Members Section - Compact Cards */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-gray-900">
                            Current Members
                          </h3>
                          <span className="text-xs text-gray-500">
                            {filteredBusinessMembers.length} of {businessMembers.length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {filteredBusinessMembers.map((member) => {
                            const memberName = member.user?.name || member.user?.email || "Unknown User";
                            const memberEmail = member.user?.email || "No email";
                            const memberRole = member.companyRole || "Unknown Role";

                            return (
                              <Card key={member._id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      <Avatar className="h-8 w-8 border">
                                        <AvatarFallback className={memberRole === 'owner' ? 'bg-amber-100 text-amber-700 text-xs' : 'bg-gray-100 text-gray-700 text-xs'}>
                                          {getAvatarInitials(memberName)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {memberName}
                                          </h4>
                                          {getRoleIcon(memberRole)}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <Mail className="h-3 w-3 text-gray-400" />
                                          <p className="text-xs text-gray-500 truncate">{memberEmail}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className={`${getRoleBadge(memberRole)} px-2 py-0.5 h-5 text-xs cursor-pointer hover:shadow-md transition-all`}
                                        onClick={() => handleOpenRoleDialog(member._id, memberName, memberRole)}
                                      >
                                        {memberRole}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Book-wise Members Tab - USING REAL API DATA */}
                <TabsContent value="books" className="space-y-4">
                  {booksLoading ? (
                    renderLoading()
                  ) : booksError ? (
                    renderError(booksErrorData, refetchBooks)
                  ) : !filteredBooks.length ? (
                    renderEmptyState("books")
                  ) : (
                    <>
                      {/* Book Roles & Permissions Section - Compact */}
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          Book Access Levels
                        </h3>

                        <div className="grid grid-cols-1 gap-3">
                          <Card className="border border-purple-100 bg-purple-50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 bg-white rounded-md shadow-xs">
                                  <Shield className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-purple-800">ADMIN</h4>
                                  <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Manage all book members</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Edit all transactions</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Configure book settings</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border border-blue-100 bg-blue-50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 bg-white rounded-md shadow-xs">
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-blue-800">EDITOR</h4>
                                  <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Add/edit transactions</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Manage parties & categories</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <XCircle className="h-3 w-3 text-red-400" />
                                      <span>Cannot manage members</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border border-gray-200 bg-gray-50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 bg-white rounded-md shadow-xs">
                                  <Eye className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-gray-800">VIEWER</h4>
                                  <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>View all transactions</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Access reports</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <XCircle className="h-3 w-3 text-red-400" />
                                      <span>No editing permissions</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border border-green-100 bg-green-50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 bg-white rounded-md shadow-xs">
                                  <Activity className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-green-800">ACCOUNTANT</h4>
                                  <ul className="text-xs text-gray-600 space-y-1 mt-1.5">
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Custom date range access</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Manage transactions within period</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>Generate period reports</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Books & Members Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-gray-900">
                            Books & Members
                          </h3>
                          <span className="text-xs text-gray-500">
                            {filteredBooks.length} books • {filteredBooks.reduce((total, book) => total + book.members.length, 0)} members
                          </span>
                        </div>

                        <div className="space-y-3">
                          {filteredBooks.map((book) => (
                            <Card key={book._id} className="border border-gray-200">
                              <div className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                                      <BookOpen className="h-4 w-4 text-gray-700" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-sm font-bold text-gray-900 truncate">
                                        {book.name}
                                      </h4>

                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => {
                                      setSelectedBookId(book._id);
                                      setShowAddBookMemberSheet(true);
                                    }}
                                  >
                                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                                    Add Member to book
                                  </Button>
                                </div>
                                <Separator className="my-2" />

                                {/* Members List */}
                                <div className="space-y-2">
                                  {book.members.length === 0 ? (
                                    <div className="text-center py-3 text-gray-500 text-sm">
                                      No members added to this book yet
                                    </div>
                                  ) : (
                                    book.members.map((member) => (
                                      <div key={member.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                                              {getAvatarInitials(member.user.name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="min-w-0">
                                            <p className="text-xs font-medium text-gray-900 truncate">
                                              {member.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                              {member.user.email}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          {getBookRoleIcon(member.role)}
                                          <Select
                                            value={member.role}
                                            onValueChange={(value) =>
                                              handleBookRoleChange(book._id, member.id, value)
                                            }
                                          >
                                            <SelectTrigger className={`${getBookRoleBadge(member.role)} border-none h-5 px-1.5 text-xs w-24`}>
                                              <SelectValue>
                                                <span className="capitalize">{member.role}</span>
                                              </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent align="end">
                                              <SelectItem value="admin">Admin</SelectItem>
                                              <SelectItem value="data_operator">Data Operator</SelectItem>
                                              <SelectItem value="viewer">Viewer</SelectItem>
                                              <SelectItem value="accountant">Accountant</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleRemoveMemberFromBook(book._id, member.user._id, member.user.name)}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Footer - Compact */}
          {/* <div className="sticky bottom-0 bg-background border-t px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-sm"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div> */}
    </div>
  );

  const panelDialogs = (
    <>
      {/* Business Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-[400px] z-[9999]">
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update the role for <span className="font-semibold text-gray-900">{selectedMemberName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Role</label>
              <Select
                value={selectedNewRole || ""}
                onValueChange={(value) => setSelectedNewRole(value as "owner" | "partner" | "staff")}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>Owner</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="partner">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span>Partner</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="staff">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Staff</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-semibold">Note:</span> Changing a member's role will update their permissions across all books in this business.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
              disabled={isChangingRole}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleChangeConfirm}
              disabled={isChangingRole || !selectedNewRole}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isChangingRole ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Business Member Sheet */}
      <Sheet open={showAddMemberSheet} onOpenChange={setShowAddMemberSheet}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[420px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Add Business Member</SheetTitle>
            <SheetDescription>
              Invite a new member to your business. They'll receive an email invitation to join.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <AddBusinessMemberForm
              businessId={companyId}
              onClose={() => {
                setShowAddMemberSheet(false);
                refetchMembers();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Book Member Sheet */}
      <Sheet open={showAddBookMemberSheet} onOpenChange={setShowAddBookMemberSheet}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[420px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Add Member to Book</SheetTitle>
            <SheetDescription>
              Add a member to this book with specific permissions.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <AddMemberToBookForm
              bookId={selectedBookId || ""}
              companyId={companyId}
              onClose={() => {
                if (selectedBookId) {
                  fetchBookMembers(selectedBookId);
                }
                setShowAddBookMemberSheet(false);
                setSelectedBookId(null);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
      {/* Accountant Duration Modal */}
      <AccountantDurationModal
        open={!!accountantDurationState?.open}
        onOpenChange={(open) => !open && setAccountantDurationState(null)}
        onConfirm={onAccountantDurationConfirm}
        isLoading={isChangingMemberBookRole}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmationData} onOpenChange={(open) => !open && setDeleteConfirmationData(null)}>
        <DialogContent className="sm:max-w-[425px] z-[9999]">
          <DialogHeader>
            <DialogTitle>Delete Member Permanently?</DialogTitle>
            <DialogDescription>
              This will remove <span className="font-bold text-gray-900">{deleteConfirmationData?.memberName}</span> from the book.
              To confirm, please type <span className="font-bold text-red-600">DELETE PERMANENTLY</span> below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={deleteInputValue}
              onChange={(e) => setDeleteInputValue(e.target.value)}
              placeholder="DELETE PERMANENTLY"
              className="font-mono border-red-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmationData(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteInputValue !== "DELETE PERMANENTLY"}
              onClick={() => {
                if (deleteConfirmationData) {
                  executeRemoveMember(deleteConfirmationData.bookId, deleteConfirmationData.userId);
                }
              }}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  if (isPage) {
    return (
      <>
        {panelBody}
        {panelDialogs}
      </>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="overflow-y-auto pb-4 w-full sm:min-w-[520px] lg:min-w-[500px] duration-75 transition-all p-0"
      >
        {panelBody}
      </SheetContent>
      {panelDialogs}
    </Sheet>
  );
};