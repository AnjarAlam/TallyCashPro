import { LucideIcon } from "lucide-react";

export interface FieldConfig {
    label: string;
    icon: LucideIcon;
    description: string;
    required?: boolean;
}

export interface FieldCardProps {
    title: string;
    subtitle: string;
    isActive: boolean;
    icon: React.ReactNode;
}


export type FieldType = "input" | "select" | "textarea" | "date" | "file" | "currency";
