import { Cashbook } from "./cashbook";

export interface IUserData {
    _id: string;
    email: string;
    firebaseUid: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    fcmTokens: string[];
    name: string;
    contact: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    status: string; // e.g., 'active'
    otp: string | null;
    otpExpiresAt: string | null;     // Date → string
    accessToken: string;
    refreshToken: string;
    createdAt: string;               // Date → string
    updatedAt: string;               // Date → string
    createdBy: string | null;        // ObjectId → string
    updatedBy: string | null;        // ObjectId → string
}


export type UserRoleByBusiness = 'owner' | 'partner' | 'staff';

export type UserRoleByBook = 'viewer' | 'data_operator' | 'admin' | 'accountant';





// Check Role response 

export interface CompanyMemberRole {
    _id: string;
    user: string; // User ID
    company: string; // Company ID
    companyRole: UserRoleByBusiness;
    invitedBy?: string; // User ID who invited this member
    isActive: boolean;
    joinedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CompanyMemberRoleResponse {
    status: number;
    message: string;
    source: string;
    data: CompanyMemberRole;
}





export interface CashbookMemberRole {
    _id: string;
    user: string; // User ID
    book: Cashbook; // Company ID
    BookRole: UserRoleByBook;
    invitedBy?: string; // User ID who invited this member
    isActive: boolean;
    joinedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    /** For accountant role: number of days of transaction access from today (e.g. 2 = today + yesterday) */
    dataAccessDurationDays?: number;
}

export interface CashbookMemberRoleResponse {
    status: number;
    message: string;
    source: string;
    data: CashbookMemberRole;
}
