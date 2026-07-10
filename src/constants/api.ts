import { de } from "date-fns/locale";
import { file, string } from "zod";

export const AUTH_API = {
    ID: `_allAuth`,
    REQUEST_OTP: {
        ID: `_requestOTP`,
        URL: `/auth/request-otp`,
    },
    VERIFY_OTP: {
        ID: `_verifyOTP`,
        URL: `/auth/verify-otp`,
    },
    REFRESH_TOKEN: {
        ID: `_refreshToken`,
        URL: `/auth/refresh-token`,
    },
    LOGOUT: {
        ID: `_logout`,
        URL: `/auth/logout`,
    },
    UPDATE: {
        ID: '_updateProfile',
        URL: `/users/user`
    },
    DELETE_ACCOUNT: {
        ID: '_deleteAccount',
        URL: (id: string) => `/users/hard-delete-by-user/${id}`
    },
    SESSIONS: {
        ID: '_getAuthSessions',
        URL: `/auth/sessions`,
    },
    LOGOUT_SESSION: {
        ID: '_logoutAuthSession',
        URL: (sessionId: string) => `/auth/sessions/${sessionId}`,
    },
    LOGOUT_ALL_OTHER_SESSIONS: {
        ID: '_logoutAllOtherAuthSessions',
        URL: `/auth/sessions/all`,
    },
    UPDATE_SESSION_NICKNAME: {
        ID: '_updateAuthSessionNickname',
        URL: (sessionId: string) => `/auth/sessions/${sessionId}/nickname`,
    },
};

export const FCM_API = {
    REGISTER_TOKEN: {
        ID: '_registerFcmToken',
        URL: `/fcm/register-token`,
    },
    UNREGISTER_TOKEN: {
        ID: '_unregisterFcmToken',
        URL: `/fcm/unregister-token`,
    },
    SEND_NOTIFICATION: {
        ID: '_sendFcmNotification',
        URL: `/fcm/send-notification`,
    },
    SUBSCRIBE_TOPIC: {
        ID: '_subscribeFcmTopic',
        URL: (topic: string) => `/fcm/subscribe/${topic}`,
    },
    UNSUBSCRIBE_TOPIC: {
        ID: '_unsubscribeFcmTopic',
        URL: (topic: string) => `/fcm/unsubscribe/${topic}`,
    },
};

export const NOTIFICATIONS_API = {
    LIST: {
        ID: '_getNotifications',
        URL: `/notifications`,
    },
    UNREAD_COUNT: {
        ID: '_getNotificationsUnreadCount',
        URL: `/notifications/unread-count`,
    },
    READ_ALL: {
        ID: '_markAllNotificationsRead',
        URL: `/notifications/read-all`,
    },
    READ_ONE: {
        ID: '_markNotificationRead',
        URL: (id: string) => `/notifications/${id}/read`,
    },
    DELETE_ALL: {
        ID: '_deleteAllNotifications',
        URL: `/notifications`,
    },
    DELETE_ONE: {
        ID: '_deleteNotification',
        URL: (id: string) => `/notifications/${id}`,
    },
};

export const APIS = {
    Business: {
        one: {
            Id: "_getBusinessOne",
            Url: (businessId: string) => `/companies/company/${businessId}`
        },
        update: {
            Id: "_updateBusiness",
            Url: (businessId: string) => `/companies/company/${businessId}`
        }
        ,
        create: {
            Id: "_createBusiness",
            Url: `/companies/company-by-user`
        },
        listByUser: {
            Id: '_getBusinessId',
            Url: `/company-members/user-company`
        },
        addMember: {
            Id: '_addMemberByBusiness',
            Url: `/company-members/add-member-to-company`
        },
        members: {
            Id: '_getAllMemberByBusiness',
            Url: (companyId: string) => `/company-members/company/${companyId}`
        },
        delete: {
            Id: '_deleteBusinessById',
            Url: (id: string) => `/companies/hard-delete-by-owner/${id}`
        },
        changeMemberRole: {
            Id: '_changeMemberRoleByBusinessId',
            Url: `/company-members/change-member-role`
        },
        removeMember: {
            Id: '_removeMemberByBusiness',
            Url: (companyId: string, memberId: string) => `/company-members/remove-member-from-company/${companyId}/${memberId}`
        },
         reorder: {
            Id: '_reorderBusinesses',
            Url: `/company-members/reorder-companies`
        },
            auditLogs: {
      Id: 'business-audit-logs',
      Url: (id: string) => `/companies/company/${id}/logs`,
    },
     Books: {
    logs: {
      Url: (companyId: string) => `/companies/${companyId}/books/logs/company`,
    },
  },
  
    },
    Cashbook: {

        createByBusiness: {
            Id: "_createCashbookByBusiness",
            Url: (companyId: string) => `/companies/${companyId}/books/accounting-book-by-user`

        },

        updateById: {
            Id: "_createCashbookById",
            Url: (companyId: string, bookId: string) => `/companies/${companyId}/books/accounting-book/${bookId}`

        },
listByBusiness: {
            Id: '_getListCashbooksByBusinessId',
            Url: (companyId: string, searchText?: string) => {
                const baseUrl = `/company-member-books/user-books?companyId=${companyId}`;
                if (searchText && searchText.trim()) {
                    return `${baseUrl}&textSearch=${encodeURIComponent(searchText.trim())}`;
                }
                return baseUrl;
            }
        },
        transactionCounts: {
            Id: `_getCashbookTransactionCouunt`,
            Url: (bookId: string) => `/transactions/book-totals/${bookId}`
        },
        addMember: {
            Id: `_addMemberByCashbookId`,
            Url: `/company-member-books/add-member`
        },
        members: {
            Id: `_getMemberByCashbook`,
            Url: (companyId: string, bookId: string) => `/company-member-books/book-members/${companyId}/${bookId}`
        },
        delete: {
            Id: `_deleteCashbookById`,
            Url: (companyId: string, bookId: string) => `/companies/${companyId}/books/delete-accounting-book-by-user/${bookId}`,
        },
        softDelete: {
            Id: `_softDeleteCashbookById`,
            Url: (companyId: string, bookId: string) => `/companies/${companyId}/books/soft-delete/${bookId}`,
        },
        recycleBin: {
            Id: `_getCashbookRecycleBin`,
            Url: (companyId: string) => `/companies/${companyId}/books/recycle-bin`,
        },
        restore: {
            Id: `_restoreCashbookById`,
            Url: (companyId: string, bookId: string) => `/companies/${companyId}/books/restore/${bookId}`,
        },
        changeMemberRole: {
            Id: `_changeMemberRoleByCashbookId`,
            Url: `/company-member-books/change-member-book-role`
        }, removeMember: {
            Id: '_removeMemberByCashbook',
            Url: `/company-member-books/remove-member`
        },
        transferBook: {
      Id: "transfer-cashbook",
      Url: (targetCompanyId: string) => `/companies/${targetCompanyId}/books/transfer`,
    },
    enhancedAnalytics: {
      Id: "enhancedAnalytics",
      Url: (bookId: string) => `/transactions/analytics/enhanced/${bookId}`,
    },
    },

    category: {
        new: {
            Id: `_getNewBusinessCategories`,
            Url: `/categories/category-by-business`
        },
        list:
        {
            Id: `_getBusinessCategories`,
            Url: `/categories/category-by-business`

        },
        newByBook: {
            Id: `_createCategoryByBook`,
            Url: (bookId: string) => `/categories/category-by-book/${bookId}`
        },
        listByBook:
        {
            Id: `_getCategoriesByBook`,
            Url: `/categories/category-by-book`
        },
        update: {
            Id: `_getBusinessCategoriesUpdate`,
            Url: (id: string) => `/categories/update-category/${id}`

        },
        delete: {
            Id: `_getBusinessCategoriesUpdate`,
            Url: (id: string) => `/categories/delete-category/${id}`
        },
        copyCategories: {
            Id: `_copyCategoriesBetweenBooks`,
            Url: `/categories/copy-categories`
        }
    },

    paymentMode: {
        new: {
            Id: `_getNewBusinessPaymentModes`,
            Url: `/payment-modes/app`
        },
        list:
        {
            Id: `_getBusinessPaymentModes`,
            Url: (businessId: string) => `/payment-modes/app/by-business/${businessId}`

        },
        newByBook: {
            Id: `_createPaymentModeByBook`,
            Url: (bookId: string) => `/payment-modes/payment-mode-by-book/${bookId}`
        },
        listByBook: {
            Id: `_getPaymentModesByBook`,
            Url: `/payment-modes/payment-mode-by-book`
        },
        update: {
            Id: `_editPaymentModeById`,
            Url: (id: string) => `/payment-modes/app/${id}`
        },
        delete: {
            Id: `_deletePaymentModeById`,
            Url: (id: string) => `/payment-modes/app/${id}`
        },
        copyPaymentModes: {
            Id: `_copyPaymentModesBetweenBooks`,
            Url: `/payment-modes/copy-payment-modes`
        }


    },
    party: {
        new: {
            Id: `_createPartyByBook`,
            Url: `/parties/create-party-by-book`,
        },
        list: {
            Id: `_getPartiesByBook`,
            Url: (bookId: string) => `/parties/book/${bookId}`,
        },
        update: {
            Id: `_updatePartyByBook`,
            Url: (id: string) => `/parties/update-party-by-book/${id}`,
        },
        delete: {
            Id: `_deletePartyByBook`,
            Url: (id: string) => `/parties/delete-party-by-book/${id}`,
        },
    },

    transaction: {
        view: {
            Id: `_getTransactionById`,
            Url: (id: string) => `/transactions/transaction/${id}`
        },
        new: {
            Id: `_getNewBookTransaction`,
            Url: `/transactions/create-transaction-by-user`
        },
        list:
        {
            Id: `_getAllBookTransactions`,
            Url: (bookId: string) => `/transactions/by-book/${bookId}`

        },
        update: {
            Id: `_editTransactionById`,
            Url: (id: string) => `/transactions/update-transaction-by-user/${id}`
        },
        delete: {
            Id: `_deleteTransactionById`,
            Url: (id: string) => `/transactions/transaction/${id}`
        },
        bin: {
            softDelete: {
                Id: `_softDeleteTransaction`,
                Url: (id: string) => `/transactions/bin/${id}`,
            },
            restore: {
                Id: `_restoreTransaction`,
                Url: (id: string) => `/transactions/bin/restore/${id}`,
            },
            list: {
                Id: `_getTransactionBin`,
                Url: `/transactions/bin`,
            },
            deletedByBook: {
                Id: `_getDeletedTransactionsByBook`,
                Url: (bookId: string) => `/transactions/deleted/by-book/${bookId}`,
            },
        },
        verify: {
            Id: `_verifyTransaction`,
            Url: (id: string) => `/transactions/transaction/${id}/verify`
        }
    },
    fileUpload: {
        new: {
            Id: `_getNewFileUpload`,
            Url: '/s3/upload'
        }
    },

    export: {
        pdf: {
            Id: `_exportPDF`,
            Url: `/transactions/report/pdf`
        },
        excel: {
            Id: `_exportExcel`,
            Url: `/transactions/daily/excel`
        },
        categoryMonthPdf: {
            Id: `_exportCategoryMonthPdf`,
            Url: (bookId: string, year: string) => `/transactions/report/category-month/pdf/${bookId}/${year}`
        },
        categoryMonthExcel: {
            Id: `_exportCategoryMonthExcel`,
            Url: (bookId: string, year: string) => `/transactions/report/category-month/excel/${bookId}/${year}`
        }
    },
     AuditLogs: {
    listByBook: {
      Id: "audit-logs-list-by-book",
      Url: (bookId: string) => `/audit-logs/book/${bookId}`
    },
    getById: {
      Id: "audit-logs-get-by-id",
      Url: (logId: string) => `/audit-logs/${logId}`
    },
    export: {
      Id: "audit-logs-export",
      Url: (businessId: string, bookId: string) => 
        `/v1/api/business/${businessId}/cashbook/${bookId}/audit-logs/export`
    },
    stats: {
      Id: "audit-logs-stats",
      Url: (bookId: string) => `/audit-logs/book/${bookId}/stats`
    },
    clear: {
      Id: "audit-logs-clear",
      Url: (bookId: string) => `/audit-logs/book/${bookId}/clear`
    },
       listByTransaction: {
     Id: "audit-logs-list-by-transaction",
     Url: (transactionId: string) => `/audit-logs/transaction/${transactionId}`
   },

  },

transfer: {
  create: {
    Id: "_createTransfer",
    Url: `/transactions/transfer`
  },
  approve: {
    Id: "_approveTransfer",
    Url: (transferId: string) => `/transactions/transfer/${transferId}/approve`
  },
  reject: {
    Id: "_rejectTransfer",
    Url: (transferId: string) => `/transactions/transfer/${transferId}/reject`
  }
},
 CompanyMemberBooks: {
    getBookMembers: {
      Id: 'company-member-books/book-members',
      Url: (companyId: string, bookId: string) => 
        `/company-member-books/book-members/${companyId}/${bookId}`
    },
    getMemberBookRole: {
      Id: 'company-member-books/member-book-role',
      Url: (bookId: string, memberId: string) => 
        `/company-member-books/books/${bookId}/members/${memberId}`
    },
    addMemberToBook: {
      Id: 'company-member-books/add-member',
      Url: () => '/company-member-books/add-member'
    },
    changeMemberBookRole: {
      Id: 'company-member-books/change-member-book-role',
      Url: () => '/company-member-books/change-member-book-role'
    },
    removeMemberFromBook: {
      Id: 'company-member-books/remove-member',
      Url: () => '/company-member-books/remove-member'
    },
    reorderBooks: {
      Id: 'company-member-books/reorder-books',
      Url: () => '/company-member-books/reorder-books'
    },
    getUserBooks: {
      Id: 'company-member-books/user-books',
      Url: () => '/company-member-books/user-books'
    },
    getMemberBooks: {
      Id: 'company-member-books/member-books',
      Url: (companyId: string) =>
        `/company-member-books/member-books/${companyId}`,
    },
  },
};