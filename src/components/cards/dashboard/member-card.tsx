"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown, Mail, Trash2, User, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { useChangeMemberRole } from "@/services/team.service";
import ModalLayout from "@/components/modals/modal-layout";
import { Card, CardFooter } from "@/components/ui/card";
import { DeleteConfirmation } from "@/components/form/delete-form";
import { useAuth } from "@/hooks";

interface MemberCardProps {
  member: {
    _id: string;
    user: {
      _id: string;
      email: string;
      name?: string;
      photoURL?: string;
    };
    company: string;
    companyRole: "owner" | "partner" | "staff";
    isActive: boolean;
    joinedAt: string;
  };
  onRemove: () => void;
  onRoleChange?: (newRole: "owner" | "partner" | "staff") => void;
}

export function MemberCard({
  member,
  onRemove,
  onRoleChange,
}: MemberCardProps) {
  const user = useAuth();
  const { mutate: changeMemberRole, isPending } = useChangeMemberRole();

  const handleRoleChange = (newRole: "owner" | "partner" | "staff") => {
    if (member.companyRole === newRole) return;

    changeMemberRole(
      { memberId: member._id, newRole },
      {
        onSuccess: (res) => {
          onRoleChange?.(newRole);
          toast.success(res.message || "Role updated successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update role");
        },
      }
    );
  };

  return (
    <div className="p-3 sm:p-4 rounded-lg border flex flex-row items-start justify-between gap-3 bg-white hover:cursor-pointer hover:shadow-md">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarFallback
            className={cn(
              "font-bold capitalize",
              member.companyRole === "owner"
                ? "bg-purple-100 text-purple-600"
                : member.companyRole === "partner"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            )}
          >
            {member.user.name?.[0] || member.user.email[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1">
          <h2 className="font-medium text-sm sm:text-base truncate capitalize">
            {member.user.name || member.user.email}
          </h2>
          <p className="text-xs text-gray-500 flex flex-wrap items-center gap-1">
            {member.companyRole === "owner" ? (
              <>
                <Crown className="h-3 w-3 flex-shrink-0" /> Owner
              </>
            ) : member.companyRole === "partner" ? (
              <>
                <Users className="h-3 w-3 flex-shrink-0" /> Partner
              </>
            ) : (
              <>
                <User className="h-3 w-3 flex-shrink-0" /> Staff
              </>
            )}
            <span className="hidden sm:inline"> • </span>
            <span className="sm:hidden block w-full"></span>
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{member.user.email}</span>
            </span>
          </p>
        </div>
      </div>
      {member.isActive && (
        <div className="flex items-center justify-end sm:justify-normal gap-2 w-full sm:w-auto">
          {member.companyRole !== "owner" &&
            user.user?._id !== member.user._id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs sm:text-sm"
                    disabled={isPending}
                  >
                    Change Role
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleRoleChange("partner")}
                    disabled={member.companyRole === "partner" || isPending}
                  >
                    <Users className="h-3 w-3 mr-2" />
                    Partner
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleChange("staff")}
                    disabled={member.companyRole === "staff" || isPending}
                  >
                    <User className="h-3 w-3 mr-2" />
                    Staff
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          {user.user?._id !== member.user._id &&
            member.companyRole !== "owner" && (
              <ModalLayout
                trigger={
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                }
              >
                <Card>
                  <CardFooter>
                    <DeleteConfirmation
                      id={member._id}
                      type="business-member"
                      itemName="Business Member"
                      onClose={() => {}}
                      companyId={member.company}
                    />
                  </CardFooter>
                </Card>
              </ModalLayout>
            )}
        </div>
      )}
    </div>
  );
}
