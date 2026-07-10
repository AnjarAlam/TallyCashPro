import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const COLOR_PALETTE = [
  "#02A1F7", // Primary blue
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Amber
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f97316", // Orange
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#64748b", // Slate
  "#14b8a6", // Teal
  "#d946ef", // Fuchsia
  "#a855f7", // Purple
  "#eab308", // Yellow
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Current color preview */}
      {/* <div
        className="w-full h-10 rounded-md border shadow-sm"
        style={{ backgroundColor: value }}
      /> */}

      {/* Color palette grid */}
      <div className="grid grid-cols-8 gap-2">
        {COLOR_PALETTE.map((color) => (
          <Button
            key={color}
            type="button"
            className={cn(
              "w-6 h-6 rounded border shadow-sm hover:scale-110 transition-transform",
              value === color ? "ring-2 ring-offset-1 ring-primary" : ""
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
