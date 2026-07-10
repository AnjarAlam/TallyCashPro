export interface PaymentMode {
    _id: string;
    businessId: string;
    name: string;
    description: string;
    isDefault: boolean;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PaymentModesResponse {
    status: number;
    message: string;
    source: string;
    data: PaymentMode[];
}




export type UpdatePaymentModePayload = {
    businessId: string;
    name: string;
    description?: string;
    status: "active" | "inactive";
    isDefault?: boolean;
};
