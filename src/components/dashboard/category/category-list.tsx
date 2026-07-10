"use client";
import { IconBox } from "@/components/buttons";
import { CategoryCard } from "@/components/cards";
import { CategorySheet } from "@/components/sheets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/interface";
import { useGetCategoriesByBook } from "@/services";
import { Plus, RefreshCw, Copy } from "lucide-react";
import { useState } from "react";
import { CopyCategoryDialog } from "@/components/dashboard/category/copy-category-dialog";

interface CategoryListCardProps {
  businessId: string;
  cashbookId?: string;
  onEdit?: (category: Category) => void;
  onCreate?: () => void;
}

export default function CategoryListCard({
  businessId,
  cashbookId,
  onEdit,
  onCreate,
}: CategoryListCardProps) {
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const {
    categories,
    isCategoriesPending,
    isCategoriesError,
    categoriesError,
    refetchCategories,
  } = useGetCategoriesByBook({
    bookId: cashbookId || "",
    sortBy: "date",
    sortOrder: "asc",
  });

  if (isCategoriesError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-red-500">Error loading categories</p>
        <Button
          variant="outline"
          onClick={() => refetchCategories()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          All Categories
        </h2>
        <div className="flex gap-2">
          {cashbookId && (
            <Button
              variant="outline"
              onClick={() => setShowCopyDialog(true)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Category
            </Button>
          )}
          <CategorySheet businessId={businessId} cashbookId={cashbookId} />
        </div>
      </div>

      {cashbookId && (
        <CopyCategoryDialog
          open={showCopyDialog}
          onOpenChange={setShowCopyDialog}
          businessId={businessId}
          targetBookId={cashbookId}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isCategoriesPending
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))
          : categories
              .sort(
                (a: Category, b: Category) =>
                  new Date(b.createdAt || "").getTime() -
                  new Date(a.createdAt || "").getTime()
              )
              .map((category: Category, idx: number) => (
                <div key={idx} className="col-span-2 sm:col-span-1">
                  <CategoryCard
                    category={category}
                    onEdit={() => onEdit?.(category)}
                    onDelete={() => {}}
                  />
                </div>
              ))}
      </div>
    </div>
  );
}
