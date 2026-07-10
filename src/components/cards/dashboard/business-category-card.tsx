import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Building,
  Utensils,
  ShoppingCart,
  Laptop,
  Briefcase,
  Users,
  Factory,
  HeartPulse,
  GraduationCap,
  CircleHelp,
} from "lucide-react";

const businessCategoryIcons = {
  "Retail Store": ShoppingCart,
  Restaurant: Utensils,
  "Service Business": Briefcase,
  "Online Business": Laptop,
  Freelancing: Users,
  Consulting: Briefcase,
  Manufacturing: Factory,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Other: CircleHelp,
};

export default function BusinessCategoryCard({
  category,
  isSelected,
  onToggle,
}: {
  category: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const Icon =
    businessCategoryIcons[category as keyof typeof businessCategoryIcons] ||
    CircleHelp;

  return (
    <Label
      htmlFor={`category-${category}`}
      className={`flex flex-col items-center justify-between p-4 rounded-lg border gap-2 cursor-pointer transition-all
        ${
          isSelected
            ? "bg-green-100/80 border-green-300 shadow-sm hover:shadow-md hover:border-green-400"
            : "bg-gray-100/70 border-gray-200 hover:bg-gray-200/50 hover:border-gray-300"
        }
        hover:shadow-sm hover:translate-y-[-1px] active:translate-y-0`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1 flex-1 w-full">
          <h2 className="font-medium flex items-center">{category}</h2>
        </div>
        <div>
          <div
            className={cn(
              `p-2 rounded-md transition-colors hidden`,
              isSelected
                ? "bg-green-200 text-green-700"
                : "bg-gray-200 text-gray-600"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <Switch
            id={`category-${category}`}
            checked={isSelected}
            onCheckedChange={onToggle}
            className={cn(
              "hidden",
              `${isSelected ? "data-[state=checked]:bg-green-600" : ""}`
            )}
          />
        </div>
      </div>
    </Label>
  );
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "Retail Store": "Physical store selling products directly to consumers",
    Restaurant: "Business serving prepared meals to customers",
    "Service Business": "Business providing services rather than products",
    "Online Business": "Primarily operates through internet channels",
    Freelancing: "Independent professional offering services",
    Consulting: "Provides expert advice in a specific field",
    Manufacturing: "Produces goods from raw materials",
    Healthcare: "Provides medical services or products",
    Education: "Provides learning services or materials",
    Other: "Other type of business not listed",
  };

  return descriptions[category] || "Business category";
}
