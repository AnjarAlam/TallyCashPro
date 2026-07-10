import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, ArrowRight, Plus } from "lucide-react";

export interface BusinessACardProps {
  title: string;
  totalBusiness: number;
  categories: string[];
  recentBusiness: {
    name: string;
    date: string;
  }[];
}

export default function BusinessACard(businessData: BusinessACardProps) {
  const { title, totalBusiness, categories, recentBusiness } = businessData;

  return (
    <Card className="group -bg-linear-240 from-primary/5 dark:bg-gray-800 text-gray-900 dark:text-white border border-primary shadow-none">
      {/* Header with Icon and Title */}
      <CardHeader>
        <CardTitle className="flex justify-start items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
            <Building2 className="w-6 h-6 text-primary dark:text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">{title || "Your Business"}</h2>
        </CardTitle>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex sm:flex-row  flex-col gap-6">
        <div className="sm:w-1/2 w-full space-y-4">
          {/* Total Business */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Business
            </p>
            <p className="text-3xl font-bold">{totalBusiness}</p>
          </div>
          {/* Category Chips */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full",
                    index % 2 === 0
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                  )}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="sm:w-1/2 w-full">
          {/* Recent Added Business */}
          {recentBusiness.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Recently Added
              </p>
              <div className="space-y-2">
                {recentBusiness.map((business, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <p className="text-sm font-medium">{business.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(business.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer with View All Button */}
      <CardFooter className="w-full flex justify-between items-center">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-primary dark:text-white dark:hover:text-white/80 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>

        <Button
          variant={"outline"}
          size={"default"}
          className="rounded-full text-accent-foreground font-bold capitalize px-4 "
        >
          View All <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
