"use client";

import { useTransactionForm } from "@/hooks/use-transaction-hook";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings } from "lucide-react";
import { useEffect } from "react";
import { FieldToggleCard } from "../cards";

const ALWAYS_VISIBLE_FIELDS = ["category", "paymentMode"] as const;

export function FormFieldSettings() {
  const { visibleFields, setVisibleFields } = useTransactionForm();

  useEffect(() => {
    // Keep required core fields visible even if stale state contains them as hidden.
    if (
      ALWAYS_VISIBLE_FIELDS.some(
        (field) => visibleFields[field] && !visibleFields[field].visible
      )
    ) {
      setVisibleFields({
        ...visibleFields,
        category: {
          ...visibleFields.category,
          visible: true,
        },
        paymentMode: {
          ...visibleFields.paymentMode,
          visible: true,
        },
      });
    }
  }, [visibleFields, setVisibleFields]);

  const toggleField = (field: string) => {
    if (ALWAYS_VISIBLE_FIELDS.includes(field as (typeof ALWAYS_VISIBLE_FIELDS)[number])) {
      return;
    }

    setVisibleFields({
      ...visibleFields,
      [field]: {
        ...visibleFields[field],
        visible: !visibleFields[field].visible,
      },
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full max-w-2xl px-2">
      <AccordionItem value="form-fields">
        <AccordionTrigger className="px-4 py-3 hover:no-underline bg-green-100/80 border-green-300 ">
          <div className="flex items-center gap-3">
            <div className="bg-green-200 text-green-700 p-2 rounded-md transition-colors ">
              <Settings className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-md font-semibold mr-2">
                Form Fields Visibility:
              </span>{" "}
              Toggle which fields should be visible in the transaction form
            </p>
          </div> 
        </AccordionTrigger>
        <AccordionContent className=" pt-4 pb-4 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(visibleFields).map(
              ([field, { visible }]) => (
                !ALWAYS_VISIBLE_FIELDS.includes(
                  field as (typeof ALWAYS_VISIBLE_FIELDS)[number]
                ) && (
                  <FieldToggleCard
                    key={field}
                    field={field}
                    isVisible={visible}
                    onToggle={() => toggleField(field)}
                  />
                )
              )
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
