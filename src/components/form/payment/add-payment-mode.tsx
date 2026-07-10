import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreatePaymentMode, useCreatePaymentModeByBook } from "@/services/payment-mode.service";
import { Badge } from "@/components/ui/badge";
import { useSheetControls } from "@/hooks";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  isDefault: z.boolean().optional(),
});

type AddPaymentModeFormProps = {
  businessId: string;
  cashbookId?: string;
  onSuccess?: () => void;
};

export function AddPaymentModeForm({
  businessId,
  cashbookId,
  onSuccess,
}: AddPaymentModeFormProps) {
  const { createPaymentMode: createPaymentModeOld, isCreatingPaymentMode: isCreatingPaymentModeOld } = useCreatePaymentMode();
  const { createPaymentModeByBook, isCreatingPaymentModeByBook } = useCreatePaymentModeByBook();
  
  const isCreatingPaymentMode = cashbookId ? isCreatingPaymentModeByBook : isCreatingPaymentModeOld;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      isDefault: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (cashbookId) {
      createPaymentModeByBook(
        {
          bookId: cashbookId,
          payload: {
            businessId,
            name: values.name,
            description: values.description,
            status: values.status,
            isDefault: values.isDefault || false,
          },
        },
        {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        }
      );
    } else {
      createPaymentModeOld(
        {
          payload: {
            businessId,
            name: values.name,
            description: values.description,
            status: values.status,
            isDefault: values.isDefault || false,
          },
        },
        {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
        {/* Payment Mode Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 10h20" />
                      <path d="M6 10v4" />
                      <path d="M10 10v4" />
                    </svg>
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Payment Mode Name *
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Cash, Credit Card, Bank Transfer"
                    className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Description
                  </FormLabel>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Optional description about this payment mode"
                    className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        {/* Status Field */}
        {/* <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Status *
                  </FormLabel>
                </div>
                <FormControl>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => field.onChange("active")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors flex-1 ${
                        field.value === "active"
                          ? "bg-green-50 border-green-300 text-green-800 shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-800"
                      } hover:shadow-sm hover:cursor-pointer`}
                    >
                      <Badge
                        variant="outline"
                        className={`px-2 py-0.5 ${
                          field.value === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        Active
                      </Badge>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("inactive")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors flex-1 ${
                        field.value === "inactive"
                          ? "bg-red-50 border-red-300 text-red-800 shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-800"
                      } hover:shadow-sm hover:cursor-pointer`}
                    >
                      <Badge
                        variant="outline"
                        className={`px-2 py-0.5 ${
                          field.value === "inactive"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        Inactive
                      </Badge>
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        /> */}

        {/* Default Payment Mode Switch */}
        {/* <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between p-4 border border-gray-300 bg-white rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Set as default payment mode
                    </FormLabel>
                    <p className="text-xs text-gray-500">
                      This will be selected by default for new transactions
                    </p>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        /> */}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isCreatingPaymentMode}
          className="w-full mt-2"
        >
          {isCreatingPaymentMode ? "Creating..." : "Create Payment Mode"}
        </Button>
      </form>
    </Form>
  );
}
