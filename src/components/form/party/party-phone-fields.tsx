"use client";

import {
  FormControl,
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
import { COUNTRY_CODES } from "@/constants/country-codes";
import { Phone } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface PartyPhoneFieldsProps<T extends FieldValues> {
  control: Control<T>;
  countryCodeName: FieldPath<T>;
  phoneNumberName: FieldPath<T>;
}

export function PartyPhoneFields<T extends FieldValues>({
  control,
  countryCodeName,
  phoneNumberName,
}: PartyPhoneFieldsProps<T>) {
  return (
    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-100">
          <Phone className="h-4 w-4" />
        </div>
        <FormLabel className="text-sm font-medium text-gray-700 flex-1">
          Mobile Number *
        </FormLabel>
      </div>

      <div className="flex gap-2">
        <FormField
          control={control}
          name={countryCodeName}
          render={({ field }) => (
            <FormItem className="w-[140px] shrink-0">
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRY_CODES.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={phoneNumberName}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="7415005000"
                  inputMode="numeric"
                  className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                  {...field}
                  onChange={(event) => {
                    field.onChange(event.target.value.replace(/[^\d]/g, ""));
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
