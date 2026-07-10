"use client";

import { ArrowDown, ArrowUp, Edit2, Trash2 } from "lucide-react";
import { Category } from "@/interface";
import { Badge } from "@/components/ui/badge";
import { SheetLayoutComp } from "@/components/modals";
import { useAuth, useSheetControls } from "@/hooks";
import { EditCategoryForm } from "@/components/form";
import { useDeleteCategory } from "@/services/category.service";
import { toast } from "sonner";
import { DeleteConfirmation } from "@/components/form/delete-form";
import ModalLayout from "@/components/modals/modal-layout";
import { Card, CardFooter } from "@/components/ui/card";

interface CategoryListCardProps {
  category: Category;
  onDelete: () => void;
  onEdit: () => void;
}

export default function CategoryCard({
  category,
  onDelete,
}: CategoryListCardProps) {
  return (
    <div className="p-4 rounded-lg border flex items-center justify-between bg-white hover:cursor-pointer hover:shadow-md gap-4">
      <div className="flex items-center gap-2 flex-1">
        <div
          className="p-2 rounded-md"
          style={{
            backgroundColor: `${category.color}20`,
            color: category.color,
          }}
        >
          {category.type === "cash_in" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </div>
        <h2 className="font-medium">{category.name}</h2>
      </div>
      {!category.isDefault && (
        <SheetLayoutComp
          sheetTitle="Edit Party"
          triggerContent={
            <div className="text-blue-500 hover:text-blue-700">
              <Edit2 className="h-4 w-4" />
            </div>
          }
        >
          <EditCategorySheetContent {...category} />
        </SheetLayoutComp>
      )}
      {category.isDefault ? (
        <Badge className="p-2 rounded bg-gray-100 font-extrabold text-gray-600 hover:cursor-not-allowed">
          DEFAULT
        </Badge>
      ) : (
        <ModalLayout
          trigger={
            <div className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </div>
          }
        >
          <Card>
            <CardFooter>
              <DeleteConfirmation
                onClose={() => {}}
                id={category._id}
                itemName={"Category"}
                type={"category"}
              />
            </CardFooter>
          </Card>
        </ModalLayout>
      )}
    </div>
  );
}

// Separate component to use the hook
function EditCategorySheetContent(category: Category) {
  const { user } = useAuth();
  const { setOpen } = useSheetControls();
  if (user)
    return (
      <EditCategoryForm category={category} onSuccess={() => setOpen(false)} />
    );
}
