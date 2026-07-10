"use client";
import { useGetCompanyList } from "@/services";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { safeLocalStorage } from "@/lib/safe-storage";

interface BusinessInfo {
  id: string | null;
  name: string;
  category: string;
  description?: string;
}

interface BusinessContextType {
  businessInfo: BusinessInfo;
  updateBusinessInfo: (newInfo: Partial<BusinessInfo>) => void;
  clearBusinessInfo: () => void;
}

export const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const { companyList: businesses, isCompanyListPending } = useGetCompanyList();
  const LOCAL_STORAGE_KEY = "currentBusiness"
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    id: null,
    name: "",
    category: "",
    description: "",
  });
  useEffect(() => {
    if (!businessInfo.id && businesses?.length) {
      // Try to get from safeLocalStorage first
      const storedBusiness = safeLocalStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedBusiness) {
        try {
          const parsedBusiness = JSON.parse(storedBusiness);
          updateBusinessInfo(parsedBusiness);
        } catch (e) {
          console.error("Failed to parse stored business", e);
          // Fallback to first business if parsing fails
          setFirstBusinessAsDefault();
        }
      } else {
        // If nothing in safeLocalStorage, set first business as default
        setFirstBusinessAsDefault();
      }
    }
  }, [businesses]);

  
  const setFirstBusinessAsDefault = () => {
    if (businesses?.length) {
      const firstBusiness = businesses[0].company;
      handleUpdate(
        {
          id: firstBusiness._id,
          name: firstBusiness.name,
          category: firstBusiness.category,
          description: firstBusiness.description,
        },
        false
      );
    }
  };
   const handleUpdate = (
    business: {
      id: string;
      name: string;
      category: string;
      description?: string;
    },
    shouldNavigate: boolean = true
  ) => {
    updateBusinessInfo(business);
   
  };
  const updateBusinessInfo = (newInfo: Partial<BusinessInfo>) => {
    setBusinessInfo((prev) => ({
      ...prev,
      ...newInfo,
    }));
  };

  const clearBusinessInfo = () => {
    setBusinessInfo({
      id: null,
      name: "",
      category: "",
      description: "",
    });
  };

  return (
    <BusinessContext.Provider
      value={{ businessInfo, updateBusinessInfo, clearBusinessInfo }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
