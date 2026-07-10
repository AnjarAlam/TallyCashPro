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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateBusiness } from "@/services";
import { BusinessCategory } from "@/interface";
import { BusinessCategoryCard } from "@/components/cards";

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
}

export default function AddBusinessForm({ onClose }: BusinessFormProps) {
  const {
    createBusiness,
    isCreatingBusiness,
    isCreateBusinessError,
    createBusinessError,
  } = useCreateBusiness();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: BusinessCategory.RETAIL_STORE,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createBusiness(values, {
      onSuccess: (data) => {
        console.log("Business created:", data);
        onClose();
      },
      onError: (err) => {
        console.error("Error creating business:", err);
      },
    });
  }

  return (
    <Card className="w-full mx-auto border-none shadow-none rounded-none flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Business Details</CardTitle>
        <CardDescription>
          Enter the title and description for your business.
        </CardDescription>
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
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
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
                              form.setValue("category", category);
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
            <div className="flex justify-end space-x-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isCreatingBusiness}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-1/2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingBusiness}
                className="bg-gray-900 hover:bg-gray-800 w-1/2"
              >
                {isCreatingBusiness ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
