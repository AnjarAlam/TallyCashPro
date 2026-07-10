"use client";

import { FieldConfig } from "@/interface";
import { FieldVisibility, TransactionFormValues } from "@/schemes";
import { createContext, useContext, useState } from "react";

interface TransactionFormContextType {
  visibleFields: Record<
    string,
    {
      visible: boolean;
      config: FieldConfig;
    }
  >;
  setVisibleFields: (
    fields: Record<
      string,
      {
        visible: boolean;
        config: FieldConfig;
      }
    >
  ) => void;
  defaultValues: Partial<TransactionFormValues>;
}

const TransactionFormContext = createContext<
  TransactionFormContextType | undefined
>(undefined);

export function TransactionFormProvider({
  children,
  defaultVisibleFields,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultVisibleFields: Record<
    string,
    {
      visible: boolean;
      config: FieldConfig;
    }
  >;
  defaultValues?: Partial<TransactionFormValues>;
}) {
  const [visibleFields, setVisibleFields] = useState<
    Record<
      string,
      {
        visible: boolean;
        config: FieldConfig;
      }
    >
  >(defaultVisibleFields);

  return (
    <TransactionFormContext.Provider
      value={{ visibleFields, setVisibleFields, defaultValues }}
    >
      {children}
    </TransactionFormContext.Provider>
  );
}

export function useTransactionForm() {
  const context = useContext(TransactionFormContext);
  if (!context) {
    throw new Error(
      "useTransactionForm must be used within a TransactionFormProvider"
    );
  }
  return context;
}
