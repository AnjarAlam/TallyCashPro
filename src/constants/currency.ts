// src/constants/currency.ts

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  AUD = "AUD",
  CAD = "CAD",
  CHF = "CHF",
  CNY = "CNY",
  SEK = "SEK",
  NZD = "NZD",
  INR = "INR",
  BRL = "BRL",
  RUB = "RUB",
  ZAR = "ZAR",
  MXN = "MXN",
  SGD = "SGD",
  HKD = "HKD",
  NOK = "NOK",
  KRW = "KRW",
  TRY = "TRY",
  AED = "AED",
}

export type CurrencyCode = Currency | string;

export interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  locale: string;
  country: string;
  flag: string;
  iconName: string;
  color: string;
}

export const CURRENCY_DATA: Record<Currency, CurrencyInfo> = {
  [Currency.USD]: {
    code: Currency.USD,
    name: "US Dollar",
    symbol: "$",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-US",
    country: "United States",
    flag: "🇺🇸",
    iconName: "DollarSign",
    color: "text-green-600",
  },
  [Currency.EUR]: {
    code: Currency.EUR,
    name: "Euro",
    symbol: "€",
    symbolNative: "€",
    decimalDigits: 2,
    rounding: 0,
    locale: "de-DE",
    country: "Eurozone",
    flag: "🇪🇺",
    iconName: "Euro",
    color: "text-blue-600",
  },
  [Currency.GBP]: {
    code: Currency.GBP,
    name: "British Pound",
    symbol: "£",
    symbolNative: "£",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-GB",
    country: "United Kingdom",
    flag: "🇬🇧",
    iconName: "PoundSterling",
    color: "text-purple-600",
  },
  [Currency.JPY]: {
    code: Currency.JPY,
    name: "Japanese Yen",
    symbol: "¥",
    symbolNative: "¥",
    decimalDigits: 0,
    rounding: 0,
    locale: "ja-JP",
    country: "Japan",
    flag: "🇯🇵",
    iconName: "Yen",
    color: "text-red-600",
  },
  [Currency.AUD]: {
    code: Currency.AUD,
    name: "Australian Dollar",
    symbol: "A$",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-AU",
    country: "Australia",
    flag: "🇦🇺",
    iconName: "DollarSign",
    color: "text-green-500",
  },
  [Currency.CAD]: {
    code: Currency.CAD,
    name: "Canadian Dollar",
    symbol: "C$",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-CA",
    country: "Canada",
    flag: "🇨🇦",
    iconName: "DollarSign",
    color: "text-red-600",
  },
  [Currency.CHF]: {
    code: Currency.CHF,
    name: "Swiss Franc",
    symbol: "CHF",
    symbolNative: "CHF",
    decimalDigits: 2,
    rounding: 0,
    locale: "de-CH",
    country: "Switzerland",
    flag: "🇨🇭",
    iconName: "Franc",
    color: "text-red-700",
  },
  [Currency.CNY]: {
    code: Currency.CNY,
    name: "Chinese Yuan",
    symbol: "CN¥",
    symbolNative: "¥",
    decimalDigits: 2,
    rounding: 0,
    locale: "zh-CN",
    country: "China",
    flag: "🇨🇳",
    iconName: "Yen",
    color: "text-red-600",
  },
  [Currency.SEK]: {
    code: Currency.SEK,
    name: "Swedish Krona",
    symbol: "SEK",
    symbolNative: "kr",
    decimalDigits: 2,
    rounding: 0,
    locale: "sv-SE",
    country: "Sweden",
    flag: "🇸🇪",
    iconName: "Krona",
    color: "text-blue-500",
  },
  [Currency.NZD]: {
    code: Currency.NZD,
    name: "New Zealand Dollar",
    symbol: "NZ$",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-NZ",
    country: "New Zealand",
    flag: "🇳🇿",
    iconName: "DollarSign",
    color: "text-blue-400",
  },
  [Currency.INR]: {
    code: Currency.INR,
    name: "Indian Rupee",
    symbol: "₹",
    symbolNative: "₹",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-IN",
    country: "India",
    flag: "🇮🇳",
    iconName: "IndianRupee",
    color: "text-orange-600",
  },
  [Currency.BRL]: {
    code: Currency.BRL,
    name: "Brazilian Real",
    symbol: "R$",
    symbolNative: "R$",
    decimalDigits: 2,
    rounding: 0,
    locale: "pt-BR",
    country: "Brazil",
    flag: "🇧🇷",
    iconName: "Real",
    color: "text-green-700",
  },
  [Currency.RUB]: {
    code: Currency.RUB,
    name: "Russian Ruble",
    symbol: "RUB",
    symbolNative: "₽",
    decimalDigits: 2,
    rounding: 0,
    locale: "ru-RU",
    country: "Russia",
    flag: "🇷🇺",
    iconName: "Ruble",
    color: "text-blue-700",
  },
  [Currency.ZAR]: {
    code: Currency.ZAR,
    name: "South African Rand",
    symbol: "R",
    symbolNative: "R",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-ZA",
    country: "South Africa",
    flag: "🇿🇦",
    iconName: "Rand",
    color: "text-green-800",
  },
  [Currency.MXN]: {
    code: Currency.MXN,
    name: "Mexican Peso",
    symbol: "MX$",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    locale: "es-MX",
    country: "Mexico",
    flag: "🇲🇽",
    iconName: "Peso",
    color: "text-green-600",
  },
  [Currency.SGD]: {
    code: Currency.SGD,
    name: "Singapore Dollar",
    symbol: "S$",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    locale: "en-SG",
    country: "Singapore",
    flag: "🇸🇬",
    iconName: "DollarSign",
    color: "text-red-600",
  },
  [Currency.HKD]: {
    code: Currency.HKD,
    name: "Hong Kong Dollar",
    symbol: "HK$",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    locale: "zh-HK",
    country: "Hong Kong",
    flag: "🇭🇰",
    iconName: "DollarSign",
    color: "text-red-500",
  },
  [Currency.NOK]: {
    code: Currency.NOK,
    name: "Norwegian Krone",
    symbol: "NOK",
    symbolNative: "kr",
    decimalDigits: 2,
    rounding: 0,
    locale: "nb-NO",
    country: "Norway",
    flag: "🇳🇴",
    iconName: "Krone",
    color: "text-blue-600",
  },
  [Currency.KRW]: {
    code: Currency.KRW,
    name: "South Korean Won",
    symbol: "₩",
    symbolNative: "₩",
    decimalDigits: 0,
    rounding: 0,
    locale: "ko-KR",
    country: "South Korea",
    flag: "🇰🇷",
    iconName: "Won",
    color: "text-blue-800",
  },
  [Currency.TRY]: {
    code: Currency.TRY,
    name: "Turkish Lira",
    symbol: "₺",
    symbolNative: "₺",
    decimalDigits: 2,
    rounding: 0,
    locale: "tr-TR",
    country: "Turkey",
    flag: "🇹🇷",
    iconName: "Lira",
    color: "text-red-800",
  },
  [Currency.AED]: {
    code: Currency.AED,
    name: "UAE Dirham",
    symbol: "AED",
    symbolNative: "AED",
    decimalDigits: 2,
    rounding: 0,
    locale: "ar-AE",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    iconName: "Dirham",
    color: "text-green-800",
  },
};

// Helper function to get currency info with fallback
export function getCurrencyInfo(currencyCode: CurrencyCode): CurrencyInfo {
  // Check if it's a valid enum value
  const code = currencyCode.toUpperCase();
  if (CURRENCY_DATA[code as Currency]) {
    return CURRENCY_DATA[code as Currency];
  }
  
  // Fallback for unknown currencies
  return {
    code: Currency.USD,
    name: currencyCode,
    symbol: currencyCode,
    symbolNative: currencyCode,
    decimalDigits: 2,
    rounding: 0,
    locale: "en-US",
    country: "",
    flag: "🏳️",
    iconName: "Currency",
    color: "text-gray-600",
  };
}

// Helper function to format amount with currency
export function formatCurrencyAmount(
  amount: number,
  currencyCode: CurrencyCode,
  options?: Intl.NumberFormatOptions
): string {
  const currencyInfo = getCurrencyInfo(currencyCode);
  const codeUpper = String(currencyInfo.code).toUpperCase();

  // AED: use ISO code "AED" instead of Arabic dirham symbol (د.إ) from Intl + ar-AE locale
  if (codeUpper === Currency.AED) {
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: currencyInfo.decimalDigits,
      maximumFractionDigits: currencyInfo.decimalDigits,
      ...options,
    }).format(amount);
    return `AED ${formatted}`;
  }

  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: currencyInfo.code,
      minimumFractionDigits: currencyInfo.decimalDigits,
      maximumFractionDigits: currencyInfo.decimalDigits,
      ...options,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currencyInfo.symbol}${amount.toLocaleString(currencyInfo.locale, {
      minimumFractionDigits: currencyInfo.decimalDigits,
      maximumFractionDigits: currencyInfo.decimalDigits,
    })}`;
  }
}

// Helper to get currency symbol
export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return getCurrencyInfo(currencyCode).symbol;
}

// Get all currencies as array
export const ALL_CURRENCIES = Object.values(CURRENCY_DATA);