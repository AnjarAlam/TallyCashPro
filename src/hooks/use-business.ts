

import { BusinessContext } from "@/providers/business-provider";
import { useContext } from "react";

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error("useBusiness must be used within a BusinessProvider");
    }
    return context;
};