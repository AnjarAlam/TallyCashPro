import { UserRoleByBook, UserRoleByBusiness } from "./user.type";

// Permission Types
export type Operation = 'C' | 'R' | 'U' | 'D'|'T' | 'M';


export interface UserRoles {
    businessRole?: UserRoleByBusiness | null;
    cashbookRole?: UserRoleByBook | null;
}

// Business Level Operations
export type BusinessOperation =
    | 'crud_business'
    | 'crud_business_member'
    | 'crud_cashbook'
    | 'view_audit_logs'
    | 'manage_transfers'
;

// Cashbook Level Operations
export type CashbookOperation =
    | 'crud_book_member'
    | 'crud_transaction'
    | 'crud_party'
    | 'crud_payment_mode'
    | 'crud_category'
    | 'view_transaction'
    | 'export_transaction'
    | 'view_audit_logs'
    | 'manage_transfers'
;

export type AllOperations = BusinessOperation | CashbookOperation;





// Helper function to check permissions




// // Check permissions
// console.log(hasPermission(user, 'crud_business', 'D')); // false (partner can't D)
// console.log(hasPermission(user, 'crud_transaction', 'U')); // true (data_operator can U)
// console.log(hasPermission(user, 'crud_category', 'R')); // true (data_operator can R)
// console.log(hasPermission(user, 'crud_party', 'D')); // false (data_operator can't D)