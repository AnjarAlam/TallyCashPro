// export Interface for Cashbook item
export interface Cashbook {
    totalIn: number;
    totalOut: number;
    _id: string;
    name: string;
    description: string;
    status: "active" | "inactive";
    currency: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    /** Per-user display order within the company (from company-member-book). */
    order?: number;
    bookRole?: string;
    /** Book role from member-books API (`getMemberBooks` uses `role`). */
    role?: string;
    deletedAt?: string;
    deletedBy?: string;
}

// Response interfaces
export interface CreateCashbookResponse {
    status: number;
    message: string;
    source: string;
    data: Cashbook;
}

export interface CashbookListResponse {
    status: number;
    message: string;
    source: string;
    data: Cashbook[];
}

// DTO for creating a cashbook
export interface CreateCashbookDto {
    companyId: string;

    name: string;
    description?: string;
    currency: string;
    status?: "active" | "inactive";
}


export interface UpdateCashbookDto {
    companyId: string;
    bookId: string;
    name: string;
    description?: string;
    currency: string;
}
export enum Currency {
    USD = 'USD', // United States Dollar ($)
    EUR = 'EUR', // Euro (€)
    GBP = 'GBP', // British Pound (£)
    JPY = 'JPY', // Japanese Yen (¥)
    AUD = 'AUD', // Australian Dollar (A$)
    CAD = 'CAD', // Canadian Dollar (C$)
    CHF = 'CHF', // Swiss Franc (CHF)
    CNY = 'CNY', // Chinese Yuan (¥)
    SEK = 'SEK', // Swedish Krona (kr)
    NZD = 'NZD', // New Zealand Dollar (NZ$)
    INR = 'INR', // Indian Rupee (₹)
    BRL = 'BRL', // Brazilian Real (R$)
    RUB = 'RUB', // Russian Ruble (₽)
    ZAR = 'ZAR', // South African Rand (R)
    MXN = 'MXN', // Mexican Peso (MX$)
    SGD = 'SGD', // Singapore Dollar (S$)
    HKD = 'HKD', // Hong Kong Dollar (HK$)
    NOK = 'NOK', // Norwegian Krone (kr)
    KRW = 'KRW', // South Korean Won (₩)
    TRY = 'TRY', // Turkish Lira (₺)
    AED = 'AED', // UAE Dirham (د.إ)
}


export interface BookTotalsData {
    totalInTransactions: number;
    totalIn: number;
    totalOut: number;
    balance: number;
}

export interface BookTotalsResponse {
    status: number;
    message: string;
    source: string;
    data: BookTotalsData;
}
