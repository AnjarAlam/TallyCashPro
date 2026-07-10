import { IconBox } from "@/components/buttons";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  text?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  iconPosition?: "left" | "right";
  iconContainerClass?: string;
  iconClass?: string;
  disabled?: boolean;
}

const variantClasses = {
  primary: "bg-blue-50/50 border-blue-200 text-blue-800",
  secondary: "bg-gray-50/50 border-gray-200 text-gray-800",
  success: "bg-green-50/50 border-green-200 text-green-800",
  warning: "bg-yellow-50/50 border-yellow-200 text-yellow-800",
  danger: "bg-red-50/50 border-red-200 text-red-800",
  info: "bg-cyan-50/50 border-cyan-200 text-cyan-800",
};

const sizeClasses = {
  sm: "text-sm p-1",
  md: "text-base p-2",
  lg: "text-lg p-3",
};

export const IconButton = ({
  text,
  icon,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  iconPosition = "right",
  iconContainerClass = "",
  iconClass = "",
  disabled = false,
}: IconButtonProps) => {
  const baseClasses = cn(
    "flex items-center gap-2 border font-medium rounded-md hover:cursor-pointer hover:shadow-md transition-all",
    variantClasses[variant],
    sizeClasses[size],
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className
  );

  const iconVariantClasses = {
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className={baseClasses} onClick={disabled ? undefined : onClick}>
      {iconPosition === "left" && icon && (
        <IconBox
          icon={icon}
          containerClass={cn(
            iconVariantClasses[variant],
            "hover:shadow-none",
            iconContainerClass
          )}
          iconClass={iconClass}
        />
      )}
      {text && <span>{text}</span>}
      {iconPosition === "right" && icon && (
        <IconBox
          icon={icon}
          containerClass={cn(
            iconVariantClasses[variant],
            "hover:shadow-none",
            iconContainerClass
          )}
          iconClass={iconClass}
        />
      )}
    </div>
  );
};
