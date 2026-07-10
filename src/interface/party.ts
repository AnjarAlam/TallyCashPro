export interface Party {
    _id: string;
    name: string;
    type: 'Customer' | 'Supplier';
    status: 'active' | 'inactive';
    userId?: string;
    bookId?: string;
    email: string
    mobile: string,

    createdAt: string,
    updatedAt: string,
}

export interface PartiesResponse {
    data: Party[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
}


export interface CreatePartyPayload {
    name: string;
    type: 'Customer' | 'Supplier' | string; // Can be more specific if you have fixed types
    mobile: string;
    email?: string; // Optional since not all parties might have email
    status?: 'active' | 'inactive'; // Optional with default
    // Add any other fields your API expects
}

export interface UpdatePartyByBookPayload {
    name: string;
    type: string;
    mobile: string;
    email?: string | null;
    status: string;
}

/** @deprecated Use UpdatePartyByBookPayload */
export interface UpdatePartyPayloadDDto extends UpdatePartyByBookPayload {
    userId?: string;
}