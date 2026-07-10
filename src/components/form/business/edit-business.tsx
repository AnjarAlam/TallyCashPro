"use client";

import { BusinessCategoryCard } from "@/components/cards"; // Assuming this component exists
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { BusinessCategory, type CompanyInfo } from "@/interface"; // Assuming these interfaces exist
import { useUpdateBusiness } from "@/services"; // Assuming this hook exists
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { HomeIcon, FileTextIcon, BookOpenIcon } from "lucide-react"; // Import Lucide icons

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a business category.",
  }),
});

interface BusinessFormProps {
  onClose: () => void;
  business: CompanyInfo; // Optional, for editing existing business
}

export default function EditBusinessForm({
  onClose,
  business,
}: BusinessFormProps) {
  const {
    updateBusiness,
    isUpdatingBusiness,
    isUpdateBusinessError,
    updateBusinessError,
  } = useUpdateBusiness();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: business?.name || "",
      description: business?.description || "",
      category: business?.category || BusinessCategory.RETAIL_STORE,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form with values:", values);
    if (business && !business._id) {
      console.error("Business ID is missing");
      form.setError("root.serverError", {
        message: "Business ID is missing. Cannot update.",
      });
      return;
    }
    try {
      await updateBusiness(
        { businessId: business?._id || "", payload: values },
        {
          onSuccess: (data) => {
            console.log("Business updated:", data);
            onClose();
          },
          onError: (err) => {
            console.error("Error updating business:", err);
            form.setError("root.serverError", {
              message: `Failed to update business: ${
                err.message || "Unknown error"
              }`,
            });
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      form.setError("root.serverError", {
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }

  return (
    <Card className="w-full mx-auto border-none shadow-none rounded-none flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Business</CardTitle>
        <CardDescription>Update your business details</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Business Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <HomeIcon className="w-4 h-4" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Business Title *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="e.g., My Awesome Startup"
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
                        <FileTextIcon className="w-4 h-4" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Business Description *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business in a few sentences..."
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <BookOpenIcon className="w-4 h-4" />
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Business Category *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {Object.values(BusinessCategory).map((category) => (
                          <BusinessCategoryCard
                            key={category}
                            category={category}
                            isSelected={field.value === category}
                            onToggle={() => {
                              form.setValue("category", category); // Update form value directly
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Display general form errors */}
            {form.formState.errors.root?.serverError && (
              <p className="text-xs text-red-600 text-center">
                {form.formState.errors.root.serverError.message}
              </p>
            )}

            <div className="flex justify-end space-x-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdatingBusiness}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-1/2 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingBusiness}
                className="bg-gray-900 hover:bg-gray-800 w-1/2"
              >
                {isUpdatingBusiness ? "Saving..." : "Update Details"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
