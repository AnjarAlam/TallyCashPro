import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateParty } from "@/services/party.service";
import { User, Mail, BadgeCheck } from "lucide-react";
import { PartyPhoneFields } from "./party-phone-fields";
import {
  getPartyFormDefaults,
  partyFormSchema,
  toPartyMobilePayload,
  type PartyFormValues,
} from "./party-form-schema";

type AddPartyFormProps = {
  bookId: string;
  onSuccess?: () => void;
};

export function AddPartyForm({ bookId, onSuccess }: AddPartyFormProps) {
  const { createParty, isCreatingParty } = useCreateParty();

  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partyFormSchema as any),
    defaultValues: getPartyFormDefaults(),
  });

  function onSubmit(values: PartyFormValues) {
    createParty(
      {
        bookId,
        payload: {
          name: values.name,
          type: values.type,
          mobile: toPartyMobilePayload(values),
          email: values.email || undefined,
          status: values.status,
        },
      },
      {
        onSuccess: () => {
          form.reset(getPartyFormDefaults());
          onSuccess?.();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <User className="h-4 w-4" />
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Party Name *
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. John Doe, ABC Suppliers"
                    className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Party Type *
                  </FormLabel>
                </div>
                <FormControl>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => field.onChange("Customer")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors flex-1 ${
                        field.value === "Customer"
                          ? "bg-blue-50 border-blue-300 text-blue-800 shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-800"
                      } hover:shadow-sm hover:cursor-pointer`}
                    >
                      <span>Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("Supplier")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors flex-1 ${
                        field.value === "Supplier"
                          ? "bg-purple-50 border-purple-300 text-purple-800 shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-800"
                      } hover:shadow-sm hover:cursor-pointer`}
                    >
                      <span>Supplier</span>
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        <PartyPhoneFields
          control={form.control}
          countryCodeName="countryCode"
          phoneNumberName="phoneNumber"
        />

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
                    Email (Optional)
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isCreatingParty}
          className="w-full mt-2"
        >
          {isCreatingParty ? "Creating..." : "Create Party"}
        </Button>
      </form>
    </Form>
  );
}
