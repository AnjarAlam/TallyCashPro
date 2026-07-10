import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Category, UpdateCategoryPayload } from "@/interface";
import { useUpdateCategory } from "@/services/category.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type EditCategoryFormProps = {
  category: Category;
  onSuccess?: () => void;
};

export function EditCategoryForm({
  category,
  onSuccess,
}: EditCategoryFormProps) {
  console.log("EditCategoryForm - Category data:", category);
  
  const { updateCategory, isUpdatingCategory } = useUpdateCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      color: category.color || "#3b82f6",
      isDefault: category.isDefault || false,
    },
  });
  
  console.log("Form default values:", form.getValues());

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    console.log("Category ID:", category._id);
    
    const payload: UpdateCategoryPayload = {
      categoryId: category._id,
      name: values.name,
      color: values.color,
      isDefault: values.isDefault || false,
    };
    
    console.log("Payload being sent:", payload);
    
    updateCategory(payload, {
      onSuccess: () => {
        console.log("Update successful");
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Update failed:", error);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
        {/* Category Name Field */}
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
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Category Name *
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Supplies, Sales, etc."
                    className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        {/* Color Picker Field */}
        <FormField
          control={form.control}
          name="color"
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
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                    Category Color
                  </FormLabel>
                </div>
                <FormControl>
                  <ColorPicker
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </div>
            </FormItem>
          )}
        />

        {/* Default Category Switch (hidden) */}
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isUpdatingCategory}
          className="w-full mt-2"
        >
          {isUpdatingCategory ? "Updating..." : "Update Category"}
        </Button>
      </form>
    </Form>
  );
}
