import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/constants/country-codes";

export function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "").replace(/^0+/, "");
}

export function buildFullMobile(countryCode: string, phoneNumber: string) {
  const digits = normalizePhoneDigits(phoneNumber);
  if (!digits) return "";
  return `${countryCode}${digits}`;
}

export function isValidInternationalPhone(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

export function parsePhoneNumber(mobile?: string | null) {
  const value = mobile?.trim() ?? "";
  if (!value) {
    return { countryCode: DEFAULT_COUNTRY_CODE, phoneNumber: "" };
  }

  if (value.startsWith("+")) {
    const sortedCodes = [...COUNTRY_CODES].sort(
      (a, b) => b.code.length - a.code.length,
    );

    for (const option of sortedCodes) {
      if (value.startsWith(option.code)) {
        return {
          countryCode: option.code,
          phoneNumber: normalizePhoneDigits(value.slice(option.code.length)),
        };
      }
    }
  }

  return {
    countryCode: DEFAULT_COUNTRY_CODE,
    phoneNumber: normalizePhoneDigits(value),
  };
}
