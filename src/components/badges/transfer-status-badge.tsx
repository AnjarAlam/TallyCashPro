// components/badges/transfer-status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface TransferStatusBadgeProps {
  status: "pending" | "approved" | "rejected";
  size?: "sm" | "md" | "lg";
}

export function TransferStatusBadge({ status, size = "md" }: TransferStatusBadgeProps) {
  const getConfig = () => {
    switch (status) {
      case "pending":
        return {
          variant: "outline" as const,
          className: "border-amber-200 bg-amber-50 text-amber-700",
          icon: Clock,
          text: "Pending",
        };
      case "approved":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
          icon: CheckCircle,
          text: "Approved",
        };
      case "rejected":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 hover:bg-red-100",
          icon: XCircle,
          text: "Rejected",
        };
      default:
        return {
          variant: "outline" as const,
          className: "",
          icon: Clock,
          text: status,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} font-medium flex items-center gap-1.5`}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}