// types/category.ts
export interface Category {
    _id: string;
    businessId: string;
    name: string;
    type: 'cash_in' | 'cash_out';
    color?: string;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCategoryPayload {
    businessId: string;
    name: string;
    type: 'cash_in' | 'cash_out';
    color?: string;
    isDefault?: boolean;
}

export interface UpdateCategoryPayload {
    categoryId: string,
    name?: string;
    type?: 'cash_in' | 'cash_out';
    color?: string;
    isDefault?: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    nameFilter?: string;
}

export interface CategoryResponse {
    data: Category[];
    total: number;
    page: number;
    limit: number;
}