"use client";
import { FieldCard } from "@/components/cards";
import { ChartBarStacked, CreditCard, UserRoundSearch } from "lucide-react";
import { usePathname } from "next/navigation";

const FieldsSection = () => {
  const pathname = usePathname();
  return (
    <div className="">
      {/* <h1 className="text-xl font-bold mb-6">Manage Fields</h1> */}

      <FieldCard
        title="Party Field"
        subtitle="Rename, delete, reorder, add new or hide"
        isActive={true}
        icon={UserRoundSearch}
        pathname={pathname}
        slug={"parties"}
        color="bg-blue-100 text-blue-600" // Added color
      />

      <FieldCard
        title="Category Fields"
        subtitle="Manage category related fields"
        isActive={true}
        icon={ChartBarStacked}
        pathname={pathname}
        slug={"category"}
        color="bg-green-100 text-green-600" // Added color
      />

      <FieldCard
        title="Payment Mode Fields"
        subtitle="Configure payment mode options"
        isActive={false}
        icon={CreditCard}
        pathname={pathname}
        slug={"payment-mode"}
        color="bg-purple-100 text-purple-600" // Added color
      />
    </div>
  );
};

export default FieldsSection;
