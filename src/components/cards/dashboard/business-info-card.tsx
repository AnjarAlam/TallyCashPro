"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyInfo } from "@/interface";
import { cn } from "@/lib/utils";
import { Building2, Calendar } from "lucide-react";

interface BusinessInfoCardProps {
  company: CompanyInfo;
  className?: string;
}

export function BusinessInfoCard({
  company,
  className,
}: BusinessInfoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className={cn("border-none shadow-none p-0", className)}>
      <CardHeader className="">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg sm:text-3xl flex items-center gap-2">
              <Building2 className="h-5 md:h-8 w-5 md:w-8 text-primary" />
              {company.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {company.category}
            </p>
          </div>
          <Badge
            variant={company.isActive ? "default" : "outline"}
            className={cn(
              company.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200"
                : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-200"
            )}
          >
            {company.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex items-end justify-between gap-4">
        {company.description && (
          <div className="space-y-2">
            <h4 className="text-sm md:text-lg font-medium text-muted-foreground">
              About
            </h4>
            <p className="text-sm">{company.description}</p>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Calendar className="h-4 w-4" />
          <span>Created on {formatDate(company.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
