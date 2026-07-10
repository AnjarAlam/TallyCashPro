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
import { PaymentMode } from "@/interface";
import { useUpdatePaymentMode } from "@/services/payment-mode.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  isDefault: z.boolean().optional(),
});

type EditPaymentModeFormProps = {
  paymentMode: PaymentMode;
  onSuccess?: () => void;
};

export function EditPaymentModeForm({
  paymentMode,
  onSuccess,
}: EditPaymentModeFormProps) {
  const { updatePaymentMode, isUpdatingPaymentMode } = useUpdatePaymentMode();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: paymentMode.name,
      description: paymentMode.description || "",
      status: paymentMode.status,
      isDefault: paymentMode.isDefault || false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updatePaymentMode(
      {
        id: paymentMode._id,
        payload: {
          businessId: paymentMode.businessId,
          name: values.name,
          description: values.description,
          status: values.status,
          isDefault: values.isDefault || false,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
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

        {/* Status Field (hidden) */}
        {/* <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        /> */}

        {/* Default Payment Mode Switch (hidden) */}
        {/* <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        /> */}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isUpdatingPaymentMode}
          className="w-full mt-2"
        >
          {isUpdatingPaymentMode ? "Updating..." : "Update Payment Mode"}
        </Button>
      </form>
    </Form>
  );
}
