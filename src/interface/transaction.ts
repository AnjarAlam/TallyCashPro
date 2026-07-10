
export interface CreateTransactionDto {
    book: string;
    type: "cash_in" | "cash_out";
    amount: number;
    party: string;
    partyType: string;
    category: string;
    paymentMode: string;
    remark: string;
    date: string;
    time: string;
    description: string;
    attachments: Array<{
        key: string;
        url: string;
        fileType: string;
        mimeType: string;
        size: number;
    }>;
}

export interface CreateTransactionResponse {
    status: number;
    message: string;
    source: string;
    data: {
        user: string;
        book: string;
        type: string;
        amount: number;
        party: string;
        category: string;
        paymentMode: string;
        remark: string;
        date: string;
        time: string;
        description: string;
        attachments: Array<{
            key: string;
            url: string;
            fileType: string;
            mimeType: string;
            size: number;
            uploadedAt: string;
            _id: string;
            createdAt: string;
            updatedAt: string;
            id: string;
        }>;
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        signedAmount: number;
        id: string;
    };
}


export interface TransactionUserRef {
    _id: string;
    name?: string;
    email?: string;
    photoURL?: string;
}

export interface Transaction {
    targetBookId: string;
    status: string;
    subType: string;
    _id: string;
    user: string;
    book: string;
    runningBalance?: number;
    isVerified?: boolean;
    verifiedBy?: TransactionUserRef | string;
    verifiedAt?: string;
    createdBy?: TransactionUserRef | string;
    bookDetails?: {
        _id: string;
        name: string;
        currency: string;
    };
    type: "cash_in" | "cash_out";
    amount: number;
    party: string;
    partyType: "customer" | "supplier"
    category: string;
    paymentMode: string;
    remark?: string;
    date: string;
    time?: string;
    description?: string;
    attachments: Array<{
        key: string;
        url: string;
        fileType: string;
        mimeType: string;
        size: number;
        uploadedAt: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
    }>;
    categoryDetails?: {
        _id: string;
        name: string;
        color?: string;
    };
    paymentModeDetails?: {
        _id: string;
        name: string;
    };
    linkedTransactionDetails?: {
        _id: string;
        amount: number;
        type: "cash_in" | "cash_out";
        book?: string;
    };
    targetBookDetails?: {
        _id: string;
        name: string;
        currency: string;
    };
    createdAt: string;
    updatedAt: string;
    deleted?: boolean;
    deletedAt?: string;
    deletedBy?: string;
    categoryName?: string;
    paymentModeName?: string;
    partyName?: string;
    partyDetails?: {
        _id: string;
        name: string;
    };
}

export interface TransactionsByBookResponse {
    status: number;
    message: string;
    source: string;
    data: {
        globalAnalytics: {
            totalTransactions: number;
            totalCashIn: number;
            totalCashOut: number;
            currentBalance: number;
        };
        transactions: Transaction[];
        totalPages: number;
        totalTransactions: number;
        pageSize: number;
        pageNumber: number;
    };
}

export interface GetTransactionsParams {
    bookId: string;
    pageNumber?: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    paymentMode?: string;
    user?: string;
}
export type SortByField = "date" | "amount" | "createdAt";
export type SortOrder = "asc" | "desc";



export interface UpdateTransactionDto {
    book: string;
    type: "cash_in" | "cash_out";
    amount: number;
    party: string;
    partyType: string;
    category: string;
    paymentMode: string;
    remark: string;
    date: string;
    time: string;
    description: string;
    attachments: Array<{
        key: string;
        url: string;
        fileType: string;
        mimeType: string;
        size: number;
    }>;
}

export interface UpdateTransactionResponse {
    success: boolean;
    message: string;
    data: {
        transaction: any; // Replace with your actual transaction type
    };
}