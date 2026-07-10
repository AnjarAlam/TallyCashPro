"use client";

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

import { Mail, UserRound, Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddCompanyMember } from "@/services/team.service";

// Form validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  companyId: z.string().min(1, "Company ID is required"),
  companyRole: z.enum(["partner", "staff"]),
});

interface CashbookFormProps {
  onClose: () => void;
  businessId: string;
}

export function AddBusinessMemberForm({
  businessId: companyId,
  onClose,
}: CashbookFormProps) {
  const { addCompanyMember, isAddingMember } = useAddCompanyMember();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      companyId: companyId, // Pre-fill the companyId from props
      companyRole: "staff", // Default role
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCompanyMember(values, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <Mail className="h-4 w-4" />
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Member Email *
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="user@example.com"
                    className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        {/* Company ID Field (hidden since we're passing it from props) */}
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Role Selection Field */}
        <FormField
          control={form.control}
          name="companyRole"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Member Role *
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
                      <SelectItem value="staff">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>Staff</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="partner">
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4" />
                          <span>Partner</span>
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

        {/* Submit Button */}
        <Button type="submit" disabled={isAddingMember} className="w-full mt-2">
          {isAddingMember ? (
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
            "Add Member"
          )}
        </Button>
      </form>
    </Form>
  );
}
