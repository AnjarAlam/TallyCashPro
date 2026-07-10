"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Edit, Eye, Shield, Trash2, ChevronDown, Calculator } from "lucide-react";
import { IUserData } from "@/interface";
import { UserRoleByBook } from "@/interface/user.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useChangeMemberBookRole } from "@/services";
import { useAuth } from "@/hooks";
import ModalLayout from "@/components/modals/modal-layout";
import { DeleteConfirmation } from "@/components/form/delete-form";
import { Card, CardFooter } from "@/components/ui/card";
import {
  AccountantDurationModal,
  AccountantDurationResult,
} from "@/components/modals/accountant-duration-modal";

interface BookMemberCardProps {
  member: {
    id: string;
    user: IUserData;
    role: UserRoleByBook;
  };
  bookId: string;
  companyId: string;
  onRemove: () => void;
  onRoleChange?: (newRole: UserRoleByBook) => void;
}

export function BookMemberCard({
  member,
  onRemove,
  bookId,
  companyId,
  onRoleChange,
}: BookMemberCardProps) {
  const user = useAuth();
  const { changeMemberBookRole, isChangingMemberBookRole } =
    useChangeMemberBookRole();
  const [showAccountantDuration, setShowAccountantDuration] = useState(false);

  const roleIcons = {
    viewer: <Eye className="h-3 w-3" />,
    data_operator: <Edit className="h-3 w-3" />,
    admin: <Shield className="h-3 w-3" />,
    accountant: <Edit className="h-3 w-3" />,
  };

  const roleColors = {
    viewer: "bg-blue-100 text-blue-600",
    data_operator: "bg-green-100 text-green-600",
    admin: "bg-purple-100 text-purple-600",
    accountant: "bg-green-100 text-green-600",
  };

  const handleRoleChange = (newRole: UserRoleByBook) => {
    if (member.role === newRole) return;

    if (newRole === "accountant") {
      setShowAccountantDuration(true);
      return;
    }

    changeMemberBookRole(
      { memberBookId: member.id, newRole },
      {
        onSuccess: () => {
          onRoleChange?.(newRole);
          toast.success("Role updated successfully");
        },
        onError: (error) => {
          toast.error("Failed to update role");
        },
      }
    );
  };

  const onAccountantDurationConfirm = (result: AccountantDurationResult) => {
    changeMemberBookRole(
      {
        memberBookId: member.id,
        newRole: "accountant",
        dataAccessDurationDays: result.dataAccessDurationDays,
      },
      {
        onSuccess: () => {
          onRoleChange?.("accountant");
          toast.success("Role updated successfully");
          setShowAccountantDuration(false);
        },
        onError: (error) => {
          toast.error("Failed to update role");
        },
      }
    );
  };

  return (
    <div className="p-4 rounded-lg border flex items-center justify-between bg-white hover:cursor-pointer hover:shadow-md">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          {
            <AvatarFallback
              className={cn("font-bold", roleColors[member.role])}
            >
              {member.user.name?.[0] || member.user.email[0]}
            </AvatarFallback>
          }
        </Avatar>
        <div>
          <h2 className="font-medium">
            {member.user.name || member.user.email}
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {roleIcons[member.role]}
            {member.role}
            {" • "}
            {member.user.contact && `Contact: ${member.user.contact}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {member.user._id != user?.user?._id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={isChangingMemberBookRole}
              >
                Change Role
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleRoleChange("viewer")}
                disabled={member.role === "viewer" || isChangingMemberBookRole}
              >
                <Eye className="h-3 w-3 mr-2" />
                Viewer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("data_operator")}
                disabled={
                  member.role === "data_operator" || isChangingMemberBookRole
                }
              >
                <Edit className="h-3 w-3 mr-2" />
                Data Operator
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("admin")}
                disabled={member.role === "admin" || isChangingMemberBookRole}
              >
                <Shield className="h-3 w-3 mr-2" />
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("accountant")}
                disabled={member.role === "accountant" || isChangingMemberBookRole}
              >
                <Calculator className="h-3 w-3 mr-2" />
                Accountant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <AccountantDurationModal
          open={showAccountantDuration}
          onOpenChange={setShowAccountantDuration}
          onConfirm={onAccountantDurationConfirm}
          isLoading={isChangingMemberBookRole}
        />

        {user.user?._id !== member.user._id && (
          <ModalLayout
            trigger={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                disabled={isChangingMemberBookRole}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            }
          >
            <Card>
              <CardFooter>
                <DeleteConfirmation
                  id={member.id}
                  itemName="cashbook-member"
                  companyId={companyId}
                  bookId={bookId}
                  userId={member.user._id}
                  onClose={() => { }}
                  type={"cashbook-member"}
                />
              </CardFooter>
            </Card>
          </ModalLayout>
        )}
      </div>
    </div>
  );
}
