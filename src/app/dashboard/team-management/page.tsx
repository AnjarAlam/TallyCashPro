"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
    Search,
    Users,
    BookOpen,
    UserPlus,
    Trash2,
    Shield,
    Edit,
    Eye,
    Activity,
    MoreVertical,
    CheckCircle,
    XCircle,
    Star,
    User,
    Briefcase,
    Loader2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Mail
} from "lucide-react";
import { toast } from "sonner";

import { DashboardSubLayout } from "@/layout";
import { useBusiness } from "@/hooks";
import {
    useGetUserBooks,
    useGetBookMembers,
    useChangeMemberBookRole,
    useRemoveMemberFromBook,
} from "@/services/company.member.books.service";
import { useCompanyMembers, useChangeMemberRole, useRemoveCompanyMember } from "@/services/team.service";
import { AddMemberToBookForm } from "@/components/form/cashbook/add-member";
import { AddBusinessMemberForm } from "@/components/form/business/add-member";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AccountantDurationModal,
    AccountantDurationResult,
} from "@/components/modals/accountant-duration-modal";

// Collapsible component for Business and Book roles & permissions (Accordion behaviour)
interface RulesAccordionsProps {
    initialSection?: "business" | "books" | "how-to";
}

function RulesAccordions({ initialSection = "books" }: RulesAccordionsProps) {
    const [openSection, setOpenSection] = useState<"business" | "books" | "how-to" | null>(initialSection);

    return (
        <div className="space-y-3">
            {/* Dropdown 1: Business Roles & Permissions */}
            <div className="border border-slate-200/60 rounded-xl bg-white overflow-hidden shadow-xs">
                <div
                    onClick={() => setOpenSection(openSection === "business" ? null : "business")}
                    className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all select-none border-l-2 ${
                        openSection === "business"
                            ? "bg-blue-50/40 hover:bg-blue-50/60 border-blue-500"
                            : "bg-slate-50 hover:bg-slate-100/50 border-transparent"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Users className={`h-4 w-4 ${openSection === "business" ? "text-blue-600" : "text-slate-500"}`} />
                        <span className={`text-xs font-bold ${openSection === "business" ? "text-blue-700" : "text-slate-700"}`}>Business Roles & Permissions</span>
                    </div>
                    {openSection === "business" ? (
                        <ChevronUp className="h-4 w-4 text-blue-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                </div>
                {openSection === "business" && (
                    <div className="p-2.5 bg-white border-t border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Owner Role Card */}
                        <Card className="border border-amber-100 bg-amber-50/40 shadow-none">
                            <CardContent className="p-2.5">
                                <div className="flex items-start gap-2">
                                    <div className="p-1 bg-white rounded-md shadow-xs border border-amber-200">
                                        <Star className="h-3.5 w-3.5 text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h4 className="text-xs font-bold text-amber-800">OWNER</h4>
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-amber-200 text-amber-700 bg-white font-medium">
                                                Business Level
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">
                                            Primary account holder. Full access and ownership of all books, logs, and business settings.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partner Role Card */}
                        <Card className="border border-blue-100 bg-blue-50/40 shadow-none">
                            <CardContent className="p-2.5">
                                <div className="flex items-start gap-2">
                                    <div className="p-1 bg-white rounded-md shadow-xs border border-blue-200">
                                        <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h4 className="text-xs font-bold text-blue-800">PARTNER</h4>
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-blue-200 text-blue-700 bg-white font-medium">
                                                Business Level
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">
                                            Full access to manage books, members, and business operations.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Staff Role Card */}
                        <Card className="border border-green-100 bg-green-50/40 shadow-none">
                            <CardContent className="p-2.5">
                                <div className="flex items-start gap-2">
                                    <div className="p-1 bg-white rounded-md shadow-xs border border-green-200">
                                        <User className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h4 className="text-xs font-bold text-green-800">STAFF</h4>
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-green-200 text-green-700 bg-white font-medium">
                                                Business Level
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">
                                            Team member with access based on assigned book permissions.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Dropdown 2: Book Access Levels */}
            <div className="border border-slate-200/60 rounded-xl bg-white overflow-hidden shadow-xs ">
                <div
                    onClick={() => setOpenSection(openSection === "books" ? null : "books")}
                    className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all select-none border-l-2 ${
                        openSection === "books"
                            ? "bg-purple-50/40 hover:bg-purple-50/60 border-purple-500"
                            : "bg-slate-50 hover:bg-slate-100/50 border-transparent"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className={`h-4 w-4 ${openSection === "books" ? "text-purple-600" : "text-slate-500"}`} />
                        <span className={`text-xs font-bold ${openSection === "books" ? "text-purple-700" : "text-slate-700"}`}>Book Access Levels</span>
                    </div>
                    {openSection === "books" ? (
                        <ChevronUp className="h-4 w-4 text-purple-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                </div>
                {openSection === "books" && (
                    <div className="p-2.5 bg-white border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Admin Card */}
                        <Card className="border border-purple-100 bg-purple-50/40 shadow-none">
                            <CardContent className="p-2.5">
                                <div className="flex items-start gap-2">
                                    <div className="p-1 bg-white rounded-md shadow-xs border border-purple-200">
                                        <Shield className="h-3.5 w-3.5 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-purple-800">ADMIN</h4>
                                        <ul className="text-[9px] text-gray-600 space-y-1 mt-1">
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Manage members</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Edit transactions</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Change settings</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Editor Card */}
                        <Card className="border border-blue-100 bg-blue-50/40 shadow-none">
                            <CardContent className="p-2.5">
                                <div className="flex items-start gap-2">
                                    <div className="p-1 bg-white rounded-md shadow-xs border border-blue-200">
                                        <Edit className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-blue-800">EDITOR</h4>
                                        <ul className="text-[9px] text-gray-600 space-y-1 mt-1">
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Add/edit entries</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Manage categories</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                                                <span className="truncate">No member edits</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Viewer Card */}
                        <Card className="border border-slate-200 bg-slate-50 shadow-none">
                            <CardContent className="p-2.5">
                                <div className="flex items-start gap-2">
                                    <div className="p-1 bg-white rounded-md shadow-xs border border-slate-200">
                                        <Eye className="h-3.5 w-3.5 text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-800">VIEWER</h4>
                                        <ul className="text-[9px] text-gray-600 space-y-1 mt-1">
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">View entries list</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Access summaries</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                                                <span className="truncate">Read-only access</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Accountant Card */}
                        <Card className="border border-green-100 bg-green-50/40 shadow-none">
                            <CardContent className="p-2.5">
                                <div className="flex items-start gap-2">
                                    <div className="p-1 bg-white rounded-md shadow-xs border border-green-100">
                                        <Activity className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-green-800">ACCOUNTANT</h4>
                                        <ul className="text-[9px] text-gray-600 space-y-1 mt-1">
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Custom date period</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Manage period data</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                                <span className="truncate">Export statements</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Dropdown 3: How to Add & Manage Members */}
            <div className="border border-slate-200/60 rounded-xl bg-white overflow-hidden shadow-xs">
                <div
                    onClick={() => setOpenSection(openSection === "how-to" ? null : "how-to")}
                    className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all select-none border-l-2 ${
                        openSection === "how-to"
                            ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-500"
                            : "bg-slate-50 hover:bg-slate-100/50 border-transparent"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <UserPlus className={`h-4 w-4 ${openSection === "how-to" ? "text-emerald-650" : "text-slate-500"}`} />
                        <span className={`text-xs font-bold ${openSection === "how-to" ? "text-emerald-800" : "text-slate-700"}`}>How to Add & Manage Members</span>
                    </div>
                    {openSection === "how-to" ? (
                        <ChevronUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                </div>
                {openSection === "how-to" && (
                    <div className="p-3 bg-white border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                            Follow these two steps to give a team member access to your business and cashbooks:
                        </p>
                        
                        <div className="relative pl-6 border-l border-slate-100 space-y-3">
                            {/* Step 1 */}
                            <div className="relative">
                                <span className="absolute -left-[31px] top-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
                                    1
                                </span>
                                <h5 className="text-xs font-bold text-gray-950">Step 1: Add to Business First</h5>
                                <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">
                                    Switch to the <span className="font-semibold text-blue-600">Business</span> tab, click <span className="font-semibold">Add Member +</span>, invite them by email, and set their general role (<span className="italic">Partner</span> or <span className="italic">Staff</span>).
                                </p>
                            </div>
                            
                            {/* Step 2 */}
                            <div className="relative">
                                <span className="absolute -left-[31px] top-0 flex items-center justify-center w-5 h-5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 text-[10px] font-bold">
                                    2
                                </span>
                                <h5 className="text-xs font-bold text-gray-950">Step 2: Assign to Specific Books</h5>
                                <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">
                                    Switch to the <span className="font-semibold text-purple-600">Books</span> tab, select a book from the left panel, click <span className="font-semibold">Add Member +</span>, and choose their book-specific role (<span className="italic">Admin, Editor, Viewer, or Accountant</span>).
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Render each individual member item in the left column list of Business Tab
function BusinessMemberRow({
    member,
    isSelected,
    onClick,
}: {
    member: any;
    isSelected: boolean;
    onClick: () => void;
}) {
    const memberName = member.user?.name || member.user?.email || "Unknown User";
    const memberEmail = member.user?.email || "No email";
    const memberRole = member.companyRole || "staff";

    const getAvatarInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeClass = (role?: string) => {
        if (!role) return "bg-slate-50 text-slate-700 border border-slate-200";
        switch (role.toLowerCase()) {
            case "owner":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            case "partner":
                return "bg-blue-50 text-blue-700 border border-blue-200";
            case "staff":
                return "bg-slate-50 text-slate-700 border border-slate-200";
            default:
                return "bg-slate-50 text-slate-700 border border-slate-200";
        }
    };

    return (
        <div
            onClick={onClick}
            className={`p-3.5 rounded-lg cursor-pointer transition-all border-b border-slate-50 last:border-b-0 flex items-center gap-3 ${isSelected
                    ? "bg-blue-50/60 border-l-[3px] border-l-blue-500"
                    : "hover:bg-slate-50/50"
                }`}
        >
            <Avatar className="h-8 w-8 shrink-0 bg-blue-50 border border-blue-100">
                <AvatarFallback className={memberRole === 'owner' ? 'bg-amber-50 text-amber-700 text-xs font-semibold' : 'bg-blue-50 text-blue-600 text-xs font-semibold'}>
                    {getAvatarInitials(memberName)}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-gray-900 truncate">
                        {memberName}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${getRoleBadgeClass(memberRole)}`}>
                        {memberRole.toUpperCase()}
                    </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 truncate block">
                    {memberEmail}
                </span>
            </div>
        </div>
    );
}

// Render each individual book item in the left column list
function BookRow({
    book,
    isSelected,
    onClick,
    companyId,
}: {
    book: any;
    isSelected: boolean;
    onClick: () => void;
    companyId: string;
}) {
    const bookId = book._id || book.id;
    const { bookMembers, isBookMembersPending } = useGetBookMembers(companyId, bookId);
    const count = bookMembers?.length || 0;
    const createdDate = book.createdAt ? format(new Date(book.createdAt), "MMM dd, yyyy") : "";

    return (
        <div
            onClick={onClick}
            className={`p-3.5 rounded-lg cursor-pointer transition-all border-b border-slate-50 last:border-b-0 ${isSelected
                    ? "bg-blue-50/60 border-l-[3px] border-l-blue-500"
                    : "hover:bg-slate-50/50"
                }`}
        >
            <div className="flex items-center justify-between">
                <h4 className="text-[12px] font-semibold text-gray-900 truncate flex-1 mr-2">
                    {book.name}
                </h4>
                <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0">
                    {isBookMembersPending ? "..." : `${count} Members`}
                </span>
            </div>
            {createdDate && (
                <span className="text-[10px] text-gray-400 mt-1 block">
                    Created on {createdDate}
                </span>
            )}
        </div>
    );
}

export default function TeamManagementPage() {
    const business = useBusiness();
    const companyId = business.businessInfo.id || "";
    const companyName = business.businessInfo.name || "Business";

    // Tab State
    const [activeTab, setActiveTab] = useState<"business" | "books">("business");

    // Search queries
    const [globalSearch, setGlobalSearch] = useState("");
    const [bookSearch, setBookSearch] = useState("");
    const [memberSearch, setMemberSearch] = useState("");

    // States
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [selectedBookName, setSelectedBookName] = useState<string | null>(null);
    const [selectedBusinessMemberId, setSelectedBusinessMemberId] = useState<string | null>(null);
    const [selectedBusinessMember, setSelectedBusinessMember] = useState<any | null>(null);
    const [removeBusinessMemberData, setRemoveBusinessMemberData] = useState<{
        memberId: string;
        memberName: string;
    } | null>(null);
    const [businessDeleteInputValue, setBusinessDeleteInputValue] = useState("");
    const [showAddBookMemberSheet, setShowAddBookMemberSheet] = useState(false);
    const [showAddBusinessMemberSheet, setShowAddBusinessMemberSheet] = useState(false);
    const [showRulesDialog, setShowRulesDialog] = useState(false);

    // Business level role change states
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
    const [selectedNewRole, setSelectedNewRole] = useState<"owner" | "partner" | "staff" | null>(null);

    // Accountant Duration modal state
    const [accountantDurationState, setAccountantDurationState] = useState<{
        open: boolean;
        bookId: string;
        memberBookId: string;
    } | null>(null);

    // Delete confirmation state
    const [deleteConfirmationData, setDeleteConfirmationData] = useState<{
        bookId: string;
        userId: string;
        memberName: string;
    } | null>(null);
    const [deleteInputValue, setDeleteInputValue] = useState("");

    // API Call: get all user books
    const { userBooks = [], isUserBooksPending, refetchUserBooks } = useGetUserBooks(
        { companyId },
        !!companyId
    );

    // API Call: get book members for selected book
    const {
        bookMembers = [],
        isBookMembersPending,
        refetchBookMembers,
    } = useGetBookMembers(companyId, selectedBookId || "", !!selectedBookId);

    // API Call: get company members (Business level)
    const {
        data: membersData,
        isLoading: isMembersLoading,
        refetch: refetchMembers,
    } = useCompanyMembers(companyId);

    // Mutations
    const { changeMemberBookRole, isChangingMemberBookRole } = useChangeMemberBookRole();
    const { removeMemberFromBook } = useRemoveMemberFromBook();
    const { mutate: changeMemberRole, isPending: isChangingRole } = useChangeMemberRole();

    // Extract business members from API data
    const businessMembers = membersData?.data || [];

    // Filter business members based on globalSearch
    const filteredBusinessMembers = useMemo(() => {
        return businessMembers.filter((member: any) => {
            const name = member.user?.name || "";
            const email = member.user?.email || "";
            const role = member.companyRole || "";
            return (
                name.toLowerCase().includes(globalSearch.toLowerCase()) ||
                email.toLowerCase().includes(globalSearch.toLowerCase()) ||
                role.toLowerCase().includes(globalSearch.toLowerCase())
            );
        });
    }, [businessMembers, globalSearch]);

    // Filter books locally by bookSearch
    const filteredBooks = useMemo(() => {
        return userBooks.filter((book: any) =>
            book.name.toLowerCase().includes(bookSearch.toLowerCase())
        );
    }, [userBooks, bookSearch]);

    // Filter book members locally by memberSearch
    const filteredMembers = useMemo(() => {
        return bookMembers.filter((member: any) => {
            const name = `${member.firstName || ""} ${member.lastName || ""}`.trim() || member.user?.name || "";
            const email = member.email || member.user?.email || "";
            return (
                name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                email.toLowerCase().includes(memberSearch.toLowerCase())
            );
        });
    }, [bookMembers, memberSearch]);

    // Get initials for avatar fallback
    const getAvatarInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Helper: map book role string to Tailwind badge classes
    const getBookRoleBadge = (role: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "bg-purple-50 text-purple-600 border border-purple-100";
            case "data_operator":
            case "editor":
                return "bg-blue-50 text-blue-600 border border-blue-100";
            case "viewer":
                return "bg-slate-50 text-slate-600 border border-slate-100";
            case "accountant":
                return "bg-green-50 text-green-600 border border-green-100";
            default:
                return "bg-slate-50 text-slate-600 border border-slate-100";
        }
    };

    // Helper: map business role string to Tailwind badge classes
    const getRoleBadge = (role?: string) => {
        if (!role) return "bg-gray-100 text-gray-800 border-gray-200 text-xs";
        switch (role.toLowerCase()) {
            case "owner":
                return "bg-amber-50 text-amber-700 border-amber-200 text-xs";
            case "partner":
                return "bg-blue-50 text-blue-700 border-blue-200 text-xs";
            case "staff":
                return "bg-slate-50 text-slate-700 border-slate-200 text-xs";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200 text-xs";
        }
    };

    // Helper: get display label for book role
    const getBookRoleLabel = (role: string) => {
        if (role?.toLowerCase() === "data_operator") return "Editor";
        return role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "";
    };

    // Helper: get role icon for business roles
    const getRoleIcon = (role?: string) => {
        if (!role) return <User className="h-3.5 w-3.5 text-gray-500" />;
        switch (role.toLowerCase()) {
            case "owner":
                return <Star className="h-3.5 w-3.5 text-amber-500" />;
            case "partner":
                return <Briefcase className="h-3.5 w-3.5 text-blue-500" />;
            case "staff":
                return <User className="h-3.5 w-3.5 text-gray-500" />;
            default:
                return <User className="h-3.5 w-3.5 text-gray-500" />;
        }
    };

    // Handle business level role change confirmation dialog open
    const handleOpenRoleDialog = (memberId: string, memberName: string, currentRole: string) => {
        setSelectedMemberId(memberId);
        setSelectedMemberName(memberName);
        setSelectedNewRole(currentRole as "owner" | "partner" | "staff");
        setShowRoleDialog(true);
    };

    // Confirm business level role change
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
                    toast.success("Role updated successfully");
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to change role");
                }
            }
        );
    };

    // Handle book role change
    const handleBookRoleChange = (bookId: string, memberBookId: string, newRole: string) => {
        if (newRole === "accountant") {
            setAccountantDurationState({ open: true, bookId, memberBookId });
            return;
        }
        changeMemberBookRole(
            {
                memberBookId,
                newRole: newRole as "admin" | "editor" | "viewer" | "accountant",
            },
            {
                onSuccess: () => {
                    toast.success("Role updated successfully");
                    refetchBookMembers();
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to update role");
                },
            }
        );
    };

    // Confirm Accountant custom duration
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
                    refetchBookMembers();
                    setAccountantDurationState(null);
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to update role");
                },
            }
        );
    };

    // Remove member action
    const handleRemoveMemberFromBook = (bookId: string, userId: string, memberName: string) => {
        setDeleteConfirmationData({ bookId, userId, memberName });
        setDeleteInputValue("");
    };

    const executeRemoveMember = () => {
        if (!deleteConfirmationData) return;
        const { bookId, userId } = deleteConfirmationData;
        removeMemberFromBook(
            {
                companyId,
                bookId,
                userId,
            },
            {
                onSuccess: () => {
                    toast.success("Member removed successfully");
                    refetchBookMembers();
                    setDeleteConfirmationData(null);
                    setDeleteInputValue("");
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to remove member");
                },
            }
        );
    };

    const { removeCompanyMember, isRemovingMember: isRemovingCompanyMember } = useRemoveCompanyMember();

    const handleRemoveBusinessMember = (memberId: string, memberName: string) => {
        setRemoveBusinessMemberData({ memberId, memberName });
        setBusinessDeleteInputValue("");
    };

    const executeRemoveBusinessMember = () => {
        if (!removeBusinessMemberData) return;
        const { memberId } = removeBusinessMemberData;
        removeCompanyMember(
            {
                companyId,
                memberId,
            },
            {
                onSuccess: () => {
                    toast.success("Member removed from business successfully");
                    setSelectedBusinessMemberId(null);
                    setSelectedBusinessMember(null);
                    setRemoveBusinessMemberData(null);
                    setBusinessDeleteInputValue("");
                    refetchMembers();
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to remove member");
                },
            }
        );
    };

    return (
        <DashboardSubLayout headerTitle="Team Management" showTitle={false}>
            {/* Top Header Section */}
            <div className="mb-5 space-y-3">

                {/* Tab Switcher */}
                <div className="flex gap-1.5 bg-slate-100/60 p-1 rounded-xl w-fit border border-slate-200/50 shadow-inner">
                    <button
                        onClick={() => setActiveTab("business")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer select-none ${activeTab === "business"
                                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50 font-bold"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        Business
                    </button>
                    <button
                        onClick={() => setActiveTab("books")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer select-none ${activeTab === "books"
                                ? "bg-white text-purple-600 shadow-sm border border-slate-200/50 font-bold"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                            }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        Books
                    </button>
                </div>
            </div>

            {activeTab === "business" ? (
                // BUSINESS TAB LAYOUT (Dual Pane Layout)
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-210px)] min-h-[640px]">

                    {/* Left Column: Business Members list */}
                    <div className="w-full md:w-[300px] lg:w-[340px] border-r border-slate-200/80 flex flex-col shrink-0 bg-white">
                        <div className="px-5 py-3.5 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-gray-900">Business Members</h3>
                        </div>

                        <div className="px-5 py-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search Members"
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs focus-visible:ring-1 focus-visible:ring-blue-200 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="px-5 pb-2">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                {filteredBusinessMembers.length} Members Found
                            </span>
                        </div>

                        <div className="flex-1 px-3 space-y-0.5 pb-4">
                            {isMembersLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                                </div>
                            ) : filteredBusinessMembers.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 text-xs">
                                    No Members Found
                                </div>
                            ) : (
                                filteredBusinessMembers.map((member: any) => (
                                    <BusinessMemberRow
                                        key={member._id}
                                        member={member}
                                        isSelected={selectedBusinessMemberId === member._id}
                                        onClick={() => {
                                            if (selectedBusinessMemberId === member._id) {
                                                setSelectedBusinessMemberId(null);
                                                setSelectedBusinessMember(null);
                                            } else {
                                                setSelectedBusinessMemberId(member._id);
                                                setSelectedBusinessMember(member);
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Member details & Role configurations */}
                    <div className="flex-1 flex flex-col bg-slate-50/10 min-w-0">

                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
                            <h3 className="text-sm font-bold text-gray-900">Member Settings</h3>
                            <Button
                                onClick={() => setShowAddBusinessMemberSheet(true)}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full px-4 py-1 text-[11px] font-semibold flex items-center gap-1 shadow-sm h-7 cursor-pointer border-none shrink-0"
                            >
                                Add Member +
                            </Button>
                        </div>

                        {selectedBusinessMemberId && selectedBusinessMember ? (
                            // Render Member Details card view
                            <div className="flex-1 flex flex-col p-6 space-y-6 bg-white">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-150 rounded-xl bg-slate-50/30">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 bg-blue-50 border border-blue-150 shadow-sm">
                                            <AvatarFallback className="text-blue-600 font-bold text-sm">
                                                {getAvatarInitials(selectedBusinessMember.user?.name || selectedBusinessMember.user?.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-bold text-slate-800 truncate">
                                                {selectedBusinessMember.user?.name || selectedBusinessMember.user?.email || "Unknown User"}
                                            </h4>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">
                                                {selectedBusinessMember.user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                            Business Role:
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${getRoleBadge(selectedBusinessMember.companyRole)}`}>
                                            {selectedBusinessMember.companyRole?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-650 uppercase tracking-wider">
                                        Update Role & Permissions
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Card className="border border-slate-200 shadow-none hover:border-slate-300 transition-all">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-slate-100 rounded-md">
                                                        <Shield className="h-4 w-4 text-slate-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-800">Change Business Role</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                                    Assign Partner or Staff permissions. Note: owners can only be changed by transferring the company ownership.
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={selectedBusinessMember.companyRole === "owner"}
                                                    className="w-full text-[11px] h-8 rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                                                    onClick={() => handleOpenRoleDialog(
                                                        selectedBusinessMember._id,
                                                        selectedBusinessMember.user?.name || selectedBusinessMember.user?.email,
                                                        selectedBusinessMember.companyRole
                                                    )}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Change Role
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border border-red-150 bg-red-50/10 shadow-none hover:bg-red-50/20 transition-all">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-red-50 rounded-md">
                                                        <Trash2 className="h-4 w-4 text-red-550" />
                                                    </div>
                                                    <span className="text-xs font-bold text-red-700">Danger Zone</span>
                                                </div>
                                                <p className="text-[10px] text-red-650/70 leading-relaxed">
                                                    Permanently remove this member from the business space and retract all book permissions.
                                                </p>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={selectedBusinessMember.companyRole === "owner"}
                                                    className="w-full text-[11px] h-8 rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 text-white border-none flex items-center justify-center gap-1.5"
                                                    onClick={() => handleRemoveBusinessMember(
                                                        selectedBusinessMember._id,
                                                        selectedBusinessMember.user?.name || selectedBusinessMember.user?.email
                                                    )}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Remove Member
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Empty state: No Member Selected notice + Accordions details
                            <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-0 bg-white">
                                <div className="lg:col-span-5 flex flex-col justify-center items-center p-8 text-center bg-white min-h-[300px]">
                                    <div className="mb-4 p-4 bg-slate-50 rounded-full text-slate-400">
                                        <Users className="h-10 w-10" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                                        No Member Selected
                                    </h4>
                                    <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                                        Select a member from the left panel to configure their business-level access role.
                                    </p>
                                </div>

                                <div className="lg:col-span-7 p-6 flex flex-col overflow-y-auto bg-slate-50/30">
                                    <h4 className="text-xs font-bold text-slate-650 uppercase tracking-wider mb-4">
                                        Business Roles Guide & Rules
                                    </h4>

                                    <RulesAccordions initialSection="business" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // BOOKS TAB LAYOUT (Dual Pane Layout)
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-210px)] min-h-[640px]">

                    {/* Left Column: Books list */}
                    <div className="w-full md:w-[300px] lg:w-[340px] border-r border-slate-200/80 flex flex-col shrink-0 bg-white">
                        <div className="px-5 py-3.5 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-gray-900">Books</h3>
                        </div>

                        <div className="px-5 py-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search Books"
                                    value={bookSearch}
                                    onChange={(e) => setBookSearch(e.target.value)}
                                    className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs focus-visible:ring-1 focus-visible:ring-blue-200 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="px-5 pb-2">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                {filteredBooks.length} Books Found
                            </span>
                        </div>

                        <div className="flex-1 px-3 space-y-0.5 pb-4">
                            {isUserBooksPending ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                                </div>
                            ) : filteredBooks.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 text-xs">
                                    No Books Found
                                </div>
                            ) : (
                                filteredBooks.map((book: any) => (
                                    <BookRow
                                        key={book._id || book.id}
                                        book={book}
                                        isSelected={selectedBookId === (book._id || book.id)}
                                        onClick={() => {
                                            const id = book._id || book.id;
                                            if (selectedBookId === id) {
                                                setSelectedBookId(null);
                                                setSelectedBookName(null);
                                            } else {
                                                setSelectedBookId(id);
                                                setSelectedBookName(book.name);
                                            }
                                        }}
                                        companyId={companyId}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Members list & Role configurations */}
                    <div className="flex-1 flex flex-col bg-slate-50/10 min-w-0">

                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
                            <h3 className="text-sm font-bold text-gray-900">Members List</h3>
                            <Button
                                disabled={!selectedBookId}
                                onClick={() => setShowAddBookMemberSheet(true)}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full px-4 py-1 text-[11px] font-semibold flex items-center gap-1 shadow-sm h-7 cursor-pointer border-none shrink-0"
                            >
                                Add Member +
                            </Button>
                        </div>

                        {selectedBookId ? (
                            <div className="flex-1 flex flex-col">

                                {/* Search Bar */}
                                <div className="px-5 py-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search Members"
                                            value={memberSearch}
                                            onChange={(e) => setMemberSearch(e.target.value)}
                                            className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs focus-visible:ring-1 focus-visible:ring-blue-200 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Warning/Alert Banner */}
                                <div className="mx-5 mb-3 px-3 py-2.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg flex items-center justify-between text-[11px] font-medium">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                        <span>Want to know Book Access Level?</span>
                                    </div>
                                    <button
                                        onClick={() => setShowRulesDialog(true)}
                                        className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer shrink-0"
                                    >
                                        Know More
                                    </button>
                                </div>

                                <div className="px-5 pb-2">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                        {filteredMembers.length} Members Found
                                    </span>
                                </div>

                                {/* Members Stream */}
                                <div className="flex-1 px-5 space-y-2.5 pb-6">
                                    {isBookMembersPending ? (
                                        <div className="flex justify-center items-center py-12">
                                            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                        </div>
                                    ) : filteredMembers.length === 0 ? (
                                        <div className="text-center py-12 text-slate-400 text-xs">
                                            No Members found in this book
                                        </div>
                                    ) : (
                                        filteredMembers.map((member: any) => {
                                            const memberName = `${member.firstName || ""} ${member.lastName || ""}`.trim() || member.user?.name || "Unknown User";
                                            const memberEmail = member.email || member.user?.email || "";
                                            const memberRole = member.bookRole || member.role || "viewer";

                                            return (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all gap-4"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <Avatar className="h-9 w-9 shrink-0 bg-blue-50 border border-blue-100">
                                                            <AvatarFallback className="text-blue-600 font-semibold text-xs flex items-center justify-center">
                                                                {getAvatarInitials(memberName)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-xs font-semibold text-gray-900 truncate block">
                                                                {memberName}
                                                            </span>
                                                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                                                {memberEmail}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Actions: Inline select and delete button next to each other */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Select
                                                            value={memberRole === "data_operator" ? "data_operator" : memberRole}
                                                            onValueChange={(val) => handleBookRoleChange(selectedBookId, member.id, val)}
                                                        >
                                                            <SelectTrigger className={`h-7 px-2.5 rounded-lg border-none text-[10px] font-bold tracking-wide cursor-pointer focus:ring-0 focus:ring-offset-0 shadow-none flex items-center gap-1.5 w-24 justify-between transition-all ${getBookRoleBadge(memberRole)}`}>
                                                                <SelectValue>
                                                                    <span>{getBookRoleLabel(memberRole)}</span>
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent align="end" className="z-[9999]">
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                                <SelectItem value="data_operator">Editor</SelectItem>
                                                                <SelectItem value="viewer">Viewer</SelectItem>
                                                                <SelectItem value="accountant">Accountant</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-500 hover:text-red-650 hover:bg-red-50 rounded-lg cursor-pointer transition-all border border-red-100/60 bg-red-55/10 shrink-0"
                                                            onClick={() => handleRemoveMemberFromBook(selectedBookId, member.user?._id || member.user?.id, memberName)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                            </div>
                        ) : (
                            // Split layout empty state: "No Books Selected" message + Accordions details
                            <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-0 bg-white">

                                {/* Empty state notice */}
                                <div className="lg:col-span-5 flex flex-col justify-center items-center p-8 text-center bg-white min-h-[300px]">
                                    <div className="mb-4 p-4 bg-slate-50 rounded-full text-slate-400">
                                        <BookOpen className="h-10 w-10" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                                        No Book Selected
                                    </h4>
                                    <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                                        Select a book from the left panel to manage its members and access roles.
                                    </p>
                                </div>

                                {/* Rules references with beautiful accordions */}
                                <div className="lg:col-span-7 p-6 flex flex-col bg-slate-50/30">
                                    <h4 className="text-xs font-bold text-slate-650 uppercase tracking-wider mb-4">
                                        Access Levels & Rules
                                    </h4>

                                    <RulesAccordions initialSection="books" />
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* Business Level Role Change Dialog */}
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
                            <label className="text-xs font-semibold text-gray-700">New Role</label>
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

                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
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
                            className="h-9 text-xs rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRoleChangeConfirm}
                            disabled={isChangingRole || !selectedNewRole}
                            className="bg-gray-900 hover:bg-gray-800 h-9 text-xs rounded-xl text-white border-none cursor-pointer"
                        >
                            {isChangingRole ? "Updating..." : "Update Role"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Book Rules Dialog (from banner Know More click) */}
            <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
                <DialogContent className="sm:max-w-[540px] z-[9999]">
                    <DialogHeader>
                        <DialogTitle>Access Levels & Rules</DialogTitle>
                        <DialogDescription>
                            Understand what actions different roles can perform across Business settings and Book cashbooks.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 max-h-[65vh] overflow-y-auto pr-1">
                        <RulesAccordions initialSection="books" />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRulesDialog(false)} className="rounded-xl h-9 text-xs">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Book Member Drawer/Sheet */}
            <Sheet open={showAddBookMemberSheet} onOpenChange={setShowAddBookMemberSheet}>
                <SheetContent side="right" className="w-full sm:max-w-[420px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Add Member to Book</SheetTitle>
                        <SheetDescription>
                            Assign a role to a business member for the cashbook{" "}
                            <span className="font-semibold text-slate-900">{selectedBookName}</span>.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <AddMemberToBookForm
                            bookId={selectedBookId || ""}
                            companyId={companyId}
                            onClose={() => {
                                refetchBookMembers();
                                setShowAddBookMemberSheet(false);
                            }}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Add Business Member Sheet */}
            <Sheet open={showAddBusinessMemberSheet} onOpenChange={setShowAddBusinessMemberSheet}>
                <SheetContent side="right" className="w-full sm:max-w-[420px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Add Business Member</SheetTitle>
                        <SheetDescription>
                            Invite a member to your business settings space.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <AddBusinessMemberForm
                            businessId={companyId}
                            onClose={() => {
                                refetchMembers();
                                setShowAddBusinessMemberSheet(false);
                            }}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Accountant Custom Duration Input Modal */}
            <AccountantDurationModal
                open={!!accountantDurationState?.open}
                onOpenChange={(open) => !open && setAccountantDurationState(null)}
                onConfirm={onAccountantDurationConfirm}
                isLoading={isChangingMemberBookRole}
            />

            {/* Member Deletion Confirmation Dialog */}
            <Dialog open={!!deleteConfirmationData} onOpenChange={(open) => !open && setDeleteConfirmationData(null)}>
                <DialogContent className="sm:max-w-[400px] z-[9999]">
                    <DialogHeader>
                        <DialogTitle>Delete Member Permanently?</DialogTitle>
                        <DialogDescription>
                            This will remove <span className="font-bold text-gray-900">{deleteConfirmationData?.memberName}</span> from the book.
                            To confirm, please type <span className="font-bold text-red-600">DELETE PERMANENTLY</span> below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-3">
                        <Input
                            value={deleteInputValue}
                            onChange={(e) => setDeleteInputValue(e.target.value)}
                            placeholder="DELETE PERMANENTLY"
                            className="font-mono text-xs border-red-200 focus:border-red-500 focus:ring-red-500 h-9 rounded-xl"
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteConfirmationData(null)} className="h-9 text-xs rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteInputValue !== "DELETE PERMANENTLY"}
                            onClick={executeRemoveMember}
                            className="h-9 text-xs rounded-xl"
                        >
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Business Member Deletion Confirmation Dialog */}
            <Dialog open={!!removeBusinessMemberData} onOpenChange={(open) => !open && setRemoveBusinessMemberData(null)}>
                <DialogContent className="sm:max-w-[400px] z-[9999]">
                    <DialogHeader>
                        <DialogTitle>Remove Business Member?</DialogTitle>
                        <DialogDescription>
                            This will permanently remove <span className="font-bold text-gray-900">{removeBusinessMemberData?.memberName}</span> from this business and revoke their access to all books.
                            To confirm, please type <span className="font-bold text-red-600">DELETE PERMANENTLY</span> below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-3">
                        <Input
                            value={businessDeleteInputValue}
                            onChange={(e) => setBusinessDeleteInputValue(e.target.value)}
                            placeholder="DELETE PERMANENTLY"
                            className="font-mono text-xs border-red-200 focus:border-red-500 focus:ring-red-500 h-9 rounded-xl"
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setRemoveBusinessMemberData(null)} className="h-9 text-xs rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={businessDeleteInputValue !== "DELETE PERMANENTLY" || isRemovingCompanyMember}
                            onClick={executeRemoveBusinessMember}
                            className="h-9 text-xs rounded-xl"
                        >
                            {isRemovingCompanyMember ? "Removing..." : "Remove Member"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardSubLayout>
    );
}
