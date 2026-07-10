"use client";
import { Cashbook, CompanyInfo } from "@/interface";
import React, { createContext, useContext, useState } from "react";

// Context type
interface BusinessContextType {
  cashbook: Cashbook | null;
  companyInfo: CompanyInfo | null;
  setCashbook: (cashbook: Cashbook) => void;
  setCompanyInfo: (info: CompanyInfo) => void;
  updateCashbook: (updates: Partial<Cashbook>) => void;
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => void;
}

// Create context
const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

// Provider component
export const BusinessProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cashbook, setCashbook] = useState<Cashbook | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  // Update partial cashbook data
  const updateCashbook = (updates: Partial<Cashbook>) => {
    if (cashbook) {
      setCashbook({
        ...cashbook,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Update partial company info
  const updateCompanyInfo = (updates: Partial<CompanyInfo>) => {
    if (companyInfo) {
      setCompanyInfo({
        ...companyInfo,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        cashbook,
        companyInfo,
        setCashbook,
        setCompanyInfo,
        updateCashbook,
        updateCompanyInfo,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

// Hook for easy consumption
export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
};
