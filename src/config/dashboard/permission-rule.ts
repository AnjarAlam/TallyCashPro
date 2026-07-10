// Permission Structure
export const permissions = {
    // Business Level Permissions
    business: {
        owner: {
            crud_business: ['C', 'R', 'U', 'D','T'],
            crud_business_member: ['C', 'R', 'U', 'D','T'],
            crud_cashbook: ['C', 'R', 'U', 'D','T'],
            view_audit_logs: ['R'],
            manage_transfers: ['M'],
        },
        partner: {
            crud_business: ['C', 'R', 'U'],
            crud_business_member: ['C', 'R', 'U'],
            crud_cashbook: ['C', 'R', 'U'],
            view_audit_logs: ['R'],
            manage_transfers: ['M'],
        },
        staff: {
            crud_business: ['R'],
            crud_business_member: ['R'],
            crud_cashbook: ['R'],
            view_audit_logs: ['R'],
            manage_transfers: ['M'],
        },
    },

    // Cashbook Level Permissions
    cashbook: {
        admin: {
            crud_book_member: ['C', 'R', 'U', 'D','T'],
            crud_transaction: ['C', 'R', 'U', 'D','T'],
            crud_party: ['C', 'R', 'U', 'D','T'],
            crud_payment_mode: ['C', 'R', 'U', 'D','T'],
            crud_category: ['C', 'R', 'U', 'D','T'],
            view_audit_logs: ['R'],
            view_transaction: ['R'],
            export_transaction: ['R'], 
            manage_transfers: ['M'],
        },
        data_operator: {
            crud_book_member: ['C', 'R', 'U'],
            crud_transaction: ['C', 'R', 'U'],
            crud_party: ['C', 'R', 'U'],
            crud_payment_mode: ['C', 'R', 'U'],
            crud_category: ['C', 'R', 'U'],
            view_audit_logs: ['R'],
            view_transaction: ['R'],
            export_transaction: ['R'], 
            manage_transfers: ['M'],
        },
        viewer: {
            crud_book_member: ['R'],
            crud_transaction: ['R'],
            crud_party: ['R'],
            crud_payment_mode: ['R'],
            crud_category: ['R'],
            view_audit_logs: ['R'],
            view_transaction: ['R'],
            export_transaction: ['R'], 
            manage_transfers: ['M'],
        },
        accountant: {
            crud_book_member: ['R'],
            crud_transaction: ['C', 'R', 'U', 'D'],
            crud_party: ['R'],
            crud_payment_mode: ['R'],
            crud_category: ['R'],
            view_audit_logs: [],
            view_transaction: ['R'],
            export_transaction: [],
            manage_transfers: undefined,
        }
    },
};