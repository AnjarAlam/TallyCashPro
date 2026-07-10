// src/components/ui/currency-badge.tsx
"use client"

import { cn } from "@/lib/utils"
import { CurrencyIcon } from "./currency-icon" // Changed import
import { getCurrencyInfo, Currency } from "@/constants/currency"

interface CurrencyBadgeProps {
  currencyCode: string | Currency
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "secondary"
  className?: string
  showFlag?: boolean
  showCode?: boolean
  showName?: boolean
}

export function CurrencyBadge({
  currencyCode,
  size = "md",
  variant = "default",
  className,
  showFlag = true,
  showCode = true,
  showName = false,
}: CurrencyBadgeProps) {
  const currencyInfo = getCurrencyInfo(currencyCode)
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }
  
  const variantClasses = {
    default: "bg-primary/10 text-primary border border-primary/20",
    outline: "bg-transparent text-primary border border-primary/30",
    secondary: "bg-secondary text-secondary-foreground border border-border",
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <CurrencyIcon 
        currencyCode={currencyCode} 
        size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
        showSymbol={false}
        showFlag={showFlag}
      />
      
      {showCode && (
        <span className="font-mono font-semibold">
          {currencyInfo.code}
        </span>
      )}
      
      {showName && (
        <span className="truncate max-w-[120px]">
          {currencyInfo.name}
        </span>
      )}
    </div>
  )
}

// Optional: Export as default if you prefer
export default CurrencyBadge;