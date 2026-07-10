// src/components/ui/currency-icon.tsx
"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { getCurrencyInfo, Currency } from "@/constants/currency"
import {
  DollarSign,
  Euro,
  PoundSterling,

  Currency as CurrencyIconLucide,
  IndianRupee,

  SwissFranc,

  RussianRuble,

  LucideIcon,
  JapaneseYen,
} from "lucide-react"

// Map Lucide icons for currencies
const CURRENCY_ICONS: Record<string, LucideIcon> = {
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,

  SwissFranc,

  Currency: CurrencyIconLucide,
}

interface CurrencyIconProps {
  currencyCode: string | Currency
  size?: number
  className?: string
  showSymbol?: boolean
  showFlag?: boolean
  showCode?: boolean
  showName?: boolean
}

export function CurrencyIcon({
  currencyCode,
  size = 20,
  className,
  showSymbol = false,
  showFlag = false,
  showCode = false,
  showName = false,
}: CurrencyIconProps) {
  const currencyInfo = getCurrencyInfo(currencyCode)
  
  // Determine which icon to use
  let IconComponent: LucideIcon
  
  if (currencyInfo.iconName && CURRENCY_ICONS[currencyInfo.iconName]) {
    IconComponent = CURRENCY_ICONS[currencyInfo.iconName]
  } else {
    // Fallback based on currency code
    if (currencyInfo.code === Currency.USD || 
        currencyInfo.code === Currency.AUD || 
        currencyInfo.code === Currency.CAD ||
        currencyInfo.code === Currency.NZD ||
        currencyInfo.code === Currency.SGD ||
        currencyInfo.code === Currency.HKD) {
      IconComponent = DollarSign
    } else if (currencyInfo.code === Currency.EUR) {
      IconComponent = Euro
    } else if (currencyInfo.code === Currency.GBP) {
      IconComponent = PoundSterling
    } else if (currencyInfo.code === Currency.JPY) {
      IconComponent = JapaneseYen
    } else if (currencyInfo.code === Currency.INR) {
      IconComponent = IndianRupee
    } else if (currencyInfo.code === Currency.CHF) {
      IconComponent = SwissFranc
    } else if (currencyInfo.code === Currency.BRL) {
      IconComponent = CurrencyIconLucide
    } else if (currencyInfo.code === Currency.RUB) {
      IconComponent = CurrencyIconLucide
    } else {
      IconComponent = CurrencyIconLucide
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showFlag && currencyInfo.flag && (
        <span className="text-lg" title={currencyInfo.country}>
          {currencyInfo.flag}
        </span>
      )}
      
      <IconComponent 
        size={size} 
        className={cn(
          currencyInfo.color || "text-muted-foreground",
          "shrink-0"
        )}
      />
      
      {showSymbol && (
        <span className="font-medium" title={currencyInfo.name}>
          {currencyInfo.symbol}
        </span>
      )}
      
      {showCode && (
        <span className="text-sm font-mono font-medium">
          {currencyInfo.code}
        </span>
      )}
      
      {showName && (
        <span className="text-sm truncate">
          {currencyInfo.name}
        </span>
      )}
    </div>
  )
}

// Simple version with just the icon
export function SimpleCurrencyIcon({ 
  currencyCode, 
  size = 16,
  className 
}: { 
  currencyCode: string | Currency; 
  size?: number; 
  className?: string 
}) {
  return (
    <CurrencyIcon 
      currencyCode={currencyCode} 
      size={size} 
      className={className} 
    />
  )
}

// Export as default
export default CurrencyIcon;