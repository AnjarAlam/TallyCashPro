"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCashbook } from "@/services";
import { useUpdateCashbook } from "@/services/cashbook.service";
import { UpdateCashbookDto } from "@/interface";

enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  AUD = "AUD",
  CAD = "CAD",
  CHF = "CHF",
  CNY = "CNY",
  SEK = "SEK",
  NZD = "NZD",
  INR = "INR",
  BRL = "BRL",
  RUB = "RUB",
  ZAR = "ZAR",
  MXN = "MXN",
  SGD = "SGD",
  HKD = "HKD",
  NOK = "NOK",
  KRW = "KRW",
  TRY = "TRY",
  AED = "AED",
}

const formSchema = z.object({
  companyId: z.string().min(1, {
    message: "Business ID is required.",
  }),
  name: z.string().min(2, {
    message: "Cashbook name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  currency: z.nativeEnum(Currency, {
    message: "Please select a valid currency.",
  }),
  status: z.enum(["active", "inactive"]).default("active"),
});

interface CashbookFormProps {
  onClose: () => void;
  businessId: string;
  cashbook: Cashbook;
}

export interface Cashbook {
  totalIn: number;
  totalOut: number;
  _id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  currency: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function EditCashbookForm({
  onClose,
  businessId,
  cashbook,
}: CashbookFormProps) {
  const {
    updateCashbook,
    isUpdatingCashbook,
    isUpdateCashbookError,
    updateCashbookError,
  } = useUpdateCashbook();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      companyId: businessId,
      name: cashbook.name,
      description: cashbook.description,
      currency: cashbook.currency as Currency,
      status: cashbook.status,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const Payload: UpdateCashbookDto = {
      bookId: cashbook._id,
      ...values,
    };

    updateCashbook(Payload, {
      onSuccess: (data) => {
        console.log("Cashbook updated:", data);
        onClose();
      },
      onError: (err) => {
        console.error("Error updating cashbook:", err);
      },
    });
  }

  return (
    <Card className="w-full mx-auto border-none shadow-none rounded-none flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Cashbook</CardTitle>
        <CardDescription>Update your cashbook details.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Cashbook Name *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="e.g., Main Cashbook"
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
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Description (Optional)
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose of this cashbook..."
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 min-h-[100px]"
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
              name="currency"
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
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Currency *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-1 focus:ring-gray-400">
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Currency).map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
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
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdatingCashbook}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingCashbook}
                onClick={form.handleSubmit(onSubmit)}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {isUpdatingCashbook ? "Updating..." : "Update Cashbook"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
