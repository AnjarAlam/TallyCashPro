"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { paths } from "@/routes/path";
import { IconBox } from "@/components/buttons";
import { Settings } from "lucide-react";

type FieldType = "input" | "select" | "textarea" | "date" | "file" | "currency";

interface FormFieldConfig {
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  icon?: React.ReactNode;
  className?: string;
  description?: string;
  settingsLink?: {
    businessId: string;
    slug: string;
  };
}

interface FormFieldLayoutProps {
  control: any;
  config: FormFieldConfig;
  className?: string;
}

export function FormFieldLayout({
  control,
  config,
  className,
}: FormFieldLayoutProps) {
  const {
    type,
    name,
    label,
    placeholder,
    required,
    options,
    icon,
    description,
    settingsLink,
  } = config;

  const renderFieldControl = (field: any) => {
    switch (type) {
      case "input":
        return (
          <Input
            placeholder={placeholder}
            className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
            {...field}
            value={field.value ?? ""}
          />
        );
      case "currency":
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <Input
              type="number"
              placeholder="0"
              className="pl-8 border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? undefined : Number(value));
              }}
            />
          </div>
        );
      case "select":
        return (
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-gray-300 shadow-md">
              {options?.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="hover:bg-gray-100"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            className="min-h-[100px] border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
            {...field}
          />
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50 focus-visible:ring-1 focus-visible:ring-gray-400",
                    !field.value && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-300 shadow-md">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "file":
        return (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-gray-300 hover:bg-gray-50 focus-visible:ring-1 focus-visible:ring-gray-400"
              onClick={() =>
                document.getElementById(`file-upload-${name}`)?.click()
              }
            >
              {icon}
              <span>Add Files</span>
            </Button>
            <Input
              id={`file-upload-${name}`}
              type="file"
              multiple
              className="hidden"
              onChange={(e) =>
                field.onChange(e.target.files ? Array.from(e.target.files) : [])
              }
            />
            <span
              className={`text-sm ${
                field.value?.length ? "text-gray-700" : "text-gray-500"
              }`}
            >
              {field.value?.length
                ? `${field.value.length} file(s) selected`
                : "No files selected"}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("relative", className)}>
          <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
            <div className="flex items-center gap-3">
              {icon && <div className="p-2 rounded-md bg-gray-100">{icon}</div>}
              <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              {settingsLink && (
                <Link
                  href={`${paths.dashboard.business.root}/${settingsLink.businessId}/fields/${settingsLink.slug}`}
                >
                  <IconBox icon={Settings} />
                </Link>
              )}
            </div>
            {renderFieldControl(field)}
            {description && (
              <FormDescription className="text-xs text-gray-500">
                {description}
              </FormDescription>
            )}
            <FormMessage className="text-xs text-red-600" />
          </div>
        </FormItem>
      )}
    />
  );
}
