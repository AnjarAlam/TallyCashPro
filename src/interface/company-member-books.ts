// types/company-member-books.ts
export interface CompanyMemberBook {
  id: string;
  user: string;
  company: string;
  book: {
    id: string;
    name: string;
    description: string;
    status: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
    v: number;
  };
  bookRole: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  v: number;
  dataAccessDurationDays?: number;
  userDetails?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

export interface BookMember {
  id: string;
  user: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bookRole: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  dataAccessDurationDays?: number;
}

export interface BookMembersResponse {
  status: number;
  message: string;
  source: string;
  data: BookMember[];
}

export interface MemberBookAccessResponse {
  status: number;
  message: string;
  source: string;
  data: CompanyMemberBook;
}

export interface AddMemberToBookDto {
  userId: string;
  companyId: string;
  bookId: string;
  role: string;
  dataAccessDurationDays?: number;

}

export interface ChangeMemberBookRoleDto {
  memberBookId: string;
  newRole: string;
  dataAccessDurationDays?: number;
}

export interface RemoveMemberFromBookDto {
  memberBookId?: string;
  companyId?: string;
  bookId?: string;
  userId?: string;
}

export interface ReorderBooksDto {
  companyId: string;
  books: Array<{
    bookId: string;
    order: number;
  }>;
}

export interface UserBook {
  id: string;
  name: string;
  description: string;
  status: string;
  currency: string;
  bookRole: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserBooksResponse {
  status: number;
  message: string;
  source: string;
  data: UserBook[];
}

export interface BaseResponse {
  status: number;
  message: string;
  source: string;
  data?: any;
}