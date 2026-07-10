// types/company-user.ts

export enum CompanyRole {
    OWNER = 'owner',
    PARTNER = 'partner',
    STAFF = 'staff',
}

export interface CompanyUser {
    _id?: string;                  // Optional MongoDB ObjectId
    user: string;                  // Reference ID for User
    company: CompanyListOneProp;               // Reference ID for Company
    role?: string | null;          // Reference ID for Role (optional)
    companyRole?: CompanyRole;     // Optional enum value
    joinedAt: string;              // ISO string (Date)
    invitedBy?: string | null;     // Optional reference ID for User
    isActive: boolean;
    updatedAt: string
}


export interface CompanyListOneProp {
    _id: string;
    name: string;
    description: string;
    createdAt: string; // ISO date string
    updatedAt: string;
    isActive: boolean;
    category: string;
    __v: number;

}




export interface GetCompanyListResponse {
    data: CompanyUser[];
}


export interface CompanyInfo {
    isActive: boolean;
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    category: string;
}