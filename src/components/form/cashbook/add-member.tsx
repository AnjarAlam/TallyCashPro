"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Mail, BookOpen, User, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCompanyMembers } from "@/services/team.service";
import { useAddMemberToBook } from "@/services/company.member.books.service";
import { toast } from "sonner";
import {
  AccountantDurationModal,
  AccountantDurationResult,
} from "@/components/modals/accountant-duration-modal";
import { APIS } from "@/constants/api";

// Form validation schema
const formSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["viewer", "editor", "admin", "accountant"]),
  companyId: z.string().optional(),
  bookId: z.string().optional(),
});

interface User {
  _id: string;
  email: string;
  name?: string;
}

export function AddMemberToBookForm({
  companyId,
  bookId,
  onClose,
}: {
  companyId: string;
  bookId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { addMemberToBook, isAddingMemberToBook } = useAddMemberToBook();
  const [showAccountantDuration, setShowAccountantDuration] = useState(false);

  const { data: members } = useCompanyMembers(companyId);

  const refetchBookMembers = () => {
    queryClient.refetchQueries({
      queryKey: [APIS.Cashbook.members.Id, companyId, bookId],
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      role: "viewer",
    },
  });

  useEffect(() => {
    form.reset({
      userId: "",
      role: "viewer",
    });
  }, [companyId, bookId, form]);

  const submitWithPayload = (payload: {
    userId: string;
    role: string;
    companyId: string;
    bookId: string;
    dataAccessDurationDays?: number;
  }) => {
    addMemberToBook(payload as any, {
      onSuccess: () => {
        toast.success("Member added successfully!");
        refetchBookMembers();
        onClose();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to add member");
      },
    });
  };

  const onAccountantDurationConfirm = (result: AccountantDurationResult) => {
    const values = form.getValues();
    submitWithPayload({
      userId: values.userId,
      role: "accountant",
      companyId,
      bookId,
      dataAccessDurationDays: result.dataAccessDurationDays,
    });
  };

  const onManualSubmit = async (e?: any) => {
    if (e) e.preventDefault();
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please select a member and role.");
      return;
    }
    const values = form.getValues();
    if (!companyId || !bookId) {
      toast.error(`Missing IDs: Company(${companyId}) Book(${bookId})`);
      return;
    }
    if (values.role === "accountant") {
      setShowAccountantDuration(true);
      return;
    }
    submitWithPayload({
      userId: values.userId,
      role: values.role,
      companyId,
      bookId,
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-4 px-4">
        {/* User Selection Field */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <User className="h-4 w-4" />
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Select Member *
                  </FormLabel>
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members?.data.map((member) => (
                        <SelectItem key={member._id} value={member.user._id}>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{member.user.name || member.user.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        {/* Role Selection Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Book Role *
                  </FormLabel>
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          <span>Viewer (Can only view)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="data_operator">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          <span>Data Operator (Can edit content)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                          <span>Admin (Full control)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="accountant">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                          <span>Accountant (Can view & add transactions)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        <AccountantDurationModal
          open={showAccountantDuration}
          onOpenChange={setShowAccountantDuration}
          onConfirm={onAccountantDurationConfirm}
          isLoading={isAddingMemberToBook}
        />

        {/* Submit Button */}
        <Button
          type="button"
          disabled={isAddingMemberToBook}
          className="w-full mt-2"
          onClick={onManualSubmit}
        >
          {isAddingMemberToBook ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding Member...
            </>
          ) : (
            "Add Member to Book"
          )}
        </Button>
      </div>
    </Form>
  );
}
