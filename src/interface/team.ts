import { IUserData, UserRoleByBook, UserRoleByBusiness } from "./user.type";

export interface AddMemberPayload {
    email: string;
    companyId: string;
    companyRole: UserRoleByBusiness
}


// Type definitions for the API response
export interface CompanyMember {
    _id: string;
    user: IUserData;
    company: string;
    companyRole: 'owner' | 'partner' | 'staff';
    isActive: boolean;
    joinedAt: string;
    createdAt: string;
    updatedAt: string;
    invitedBy?: string;
}


export interface CompanyMembersResponse {
    status: number;
    message: string;
    source: string;
    data: CompanyMember[];
}



// Cashbook Members
export interface AddMemberToBookPayload {
    userId: string;
    companyId: string;
    bookId: string;
    role: string;
}



export interface BookMember {
    id: string;
    user: IUserData;
    role: UserRoleByBook;
    createdAt: string;
    updatedAt: string;
}

export interface BookMembersResponse {
    status: number;
    message: string;
    source: string;
    data: BookMember[];
}



export type RemoveMemberFromBooksPayload = {
    userId: string;
    companyId: string;
    bookId: string;
};