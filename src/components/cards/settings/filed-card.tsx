"use client";
import { IconBox } from "@/components/buttons";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LucideIcon,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FieldCardProps {
  title: string;
  subtitle: string;
  isActive: boolean;
  icon: LucideIcon;
  pathname: string;
  slug: string;
  onToggle?: (newState: boolean) => void;
  color?: string; // Added color prop
}

export const FieldCard = ({
  title,
  subtitle,
  isActive: initialActive,
  icon,
  pathname,
  slug,
  onToggle,
  color = "bg-gray-100 text-gray-600", // Default color if none provided
}: FieldCardProps) => {
  return (
    <Link href={`${pathname}/${slug}`} className="block group">
      <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-150 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <IconBox
              icon={icon}
              containerClass={`p-2 ${color.split(" ")[0]}`} // Apply background color
              iconClass={`w-6 h-6 ${color.split(" ")[1]}`} // Apply text color
            />
            <div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 group-hover:opacity-100 opacity-0 transition-opacity">
            <ArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
};
