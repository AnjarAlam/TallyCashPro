import { permissions } from "@/config";
import { AllOperations, BusinessOperation, CashbookOperation, Operation, UserRoles } from "@/interface";

// Example Usage:
// const user: UserRoles = {
//     businessRole: 'partner',
//     cashbookRole: 'data_operator'
// };
export function hasPermission(
    userRoles: UserRoles,
    operation: AllOperations,
    action: Operation
): boolean {
    // First check if it's a business operation
    if (userRoles.businessRole && operation.startsWith('crud_') &&
        ['crud_business', 'crud_business_member', 'crud_cashbook','view_audit_logs', 'manage_transfers'].includes(operation)) {
        const rolePermissions = permissions.business[userRoles.businessRole];
        return rolePermissions[operation as BusinessOperation]?.includes(action) ?? false;
    }

    // Then check if it's a cashbook operation (and user has cashbook role)
    if (userRoles.cashbookRole && [
        'crud_book_member', 'crud_transaction', 'crud_party',
        'crud_payment_mode', 'crud_category', 'view_audit_logs',
        'view_transaction', 'export_transaction', 'manage_transfers'
    ].includes(operation)) {
        const rolePermissions = permissions.cashbook[userRoles.cashbookRole];
        const allowed = rolePermissions[operation as CashbookOperation];
        return Array.isArray(allowed) && (allowed as Operation[]).includes(action);
    }

    return false;
}