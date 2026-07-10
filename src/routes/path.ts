// ----------------------------------------------------------------------

const ROOTS = {
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
    HOME: '/'
};

// ----------------------------------------------------------------------

export const paths = {
    faqs: '/faqs',
    minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
    // AUTH
    auth: {
        amplify: {
            signIn: `${ROOTS.AUTH}/amplify/sign-in`,
            verify: `${ROOTS.AUTH}/amplify/verify`,
            signUp: `${ROOTS.AUTH}/amplify/sign-up`,
            updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
            resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
        },
        jwt: {
            signIn: `${ROOTS.AUTH}/jwt/sign-in`,
            signUp: `${ROOTS.AUTH}/jwt/sign-up`,
        },
        firebase: {
            signIn: `${ROOTS.AUTH}/firebase/sign-in`,
            verify: `${ROOTS.AUTH}/firebase/verify`,
            signUp: `${ROOTS.AUTH}/firebase/sign-up`,
            resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
        },
        auth0: {
            signIn: `${ROOTS.AUTH}/auth0/sign-in`,
        },
        supabase: {
            signIn: `${ROOTS.AUTH}/supabase/sign-in`,
            verify: `${ROOTS.AUTH}/supabase/verify`,
            signUp: `${ROOTS.AUTH}/supabase/sign-up`,
            updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
            resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
        },
        login: "/login"

    },
    // DASHBOARD
    dashboard: {
        root: ROOTS.DASHBOARD,
        business: {
            root: "/dashboard/business",
            new: "/dashboard/business/new",
            list: "/dashboard/business/list",
            edit: (id: string) => `/dashboard/business/${id}/edit`,
            changepassword: (id: string) => `/dashboard/business/${id}/changepassword`,
            view: (id: string) => `/dashboard/business/${id}`,
            // Cashbook detail route
            cashbookDetail: (businessId: string, cashbookId: string) =>
                `/dashboard/business/${businessId}/${cashbookId}`,
            addCashbook: `/dashboard/business`,
            book: `/dashboard/book`,
        },

        team: {
            root: `${ROOTS.DASHBOARD}/team`,
            new: `${ROOTS.DASHBOARD}/team/new`,
            list: `${ROOTS.DASHBOARD}/team/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/team/${id}/edit`,
            changepassword: (id: string) => `${ROOTS.DASHBOARD}/team/${id}/changepassword`,
            view: (id: string) => `${ROOTS.DASHBOARD}/team/${id}`,
        },
        two: `${ROOTS.DASHBOARD}/two`,
        three: `${ROOTS.DASHBOARD}/three`,
        staff: {
            root: `${ROOTS.DASHBOARD}/staff`,
            new: `${ROOTS.DASHBOARD}/staff/new`,
            list: `${ROOTS.DASHBOARD}/staff/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/staff/${id}/edit`,
            changepassword: (id: string) => `${ROOTS.DASHBOARD}/staff/${id}/changepassword`,
            view: (id: string) => `${ROOTS.DASHBOARD}/staff/${id}/view`,
        },
        projectmanagement: {
            root: `${ROOTS.DASHBOARD}/projectmanagement`,
            new: `${ROOTS.DASHBOARD}/projectmanagement/new`,
            list: `${ROOTS.DASHBOARD}/projectmanagement/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/projectmanagement/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/projectmanagement/${id}/view`,
        },
        propertymanagement: {
            root: `${ROOTS.DASHBOARD}/propertymanagement`,
            new: `${ROOTS.DASHBOARD}/propertymanagement/new`,
            list: `${ROOTS.DASHBOARD}/propertymanagement/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/propertymanagement/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/propertymanagement/${id}/view`,
        },
        requirementmanagement: {
            root: `${ROOTS.DASHBOARD}/requirementmanagement`,
            new: `${ROOTS.DASHBOARD}/requirementmanagement/new`,
            list: `${ROOTS.DASHBOARD}/requirementmanagement/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/requirementmanagement/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/requirementmanagement/${id}/view`,
        },
        coupon: {
            root: `${ROOTS.DASHBOARD}/coupon`,
            new: `${ROOTS.DASHBOARD}/coupon/new`,
            list: `${ROOTS.DASHBOARD}/coupon/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/coupon/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/coupon/${id}/view`,
        },
        agpointconfig: {
            root: `${ROOTS.DASHBOARD}/agpointconfig`,
            new: `${ROOTS.DASHBOARD}/agpointconfig/new`,
            list: `${ROOTS.DASHBOARD}/agpointconfig/list`,
            // edit: (id:string) => `${ROOTS.DASHBOARD}/agpointconfig/edit`,
            view: `${ROOTS.DASHBOARD}/agpointconfig/view`,
        },
        subscription: {
            root: `${ROOTS.DASHBOARD}/subscription`,
            new: `${ROOTS.DASHBOARD}/subscription/new`,
            list: `${ROOTS.DASHBOARD}/subscription/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/subscription/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/subscription/${id}/view`,
        },
        designation: {
            root: `${ROOTS.DASHBOARD}/staff/designation`,
            list: `${ROOTS.DASHBOARD}/staff/designation/list`,
            new: `${ROOTS.DASHBOARD}/staff/designation/new`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/staff/designation/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/staff/designation/${id}/view`,
        },
        propertytype: {
            root: `${ROOTS.DASHBOARD}/propertytype`,
            new: `${ROOTS.DASHBOARD}/propertytype/new`,
            list: `${ROOTS.DASHBOARD}/propertytype/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/propertytype/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/propertytype/${id}/view`,
        },
        amenities: {
            root: `${ROOTS.DASHBOARD}/amenities`,
            new: `${ROOTS.DASHBOARD}/amenities/new`,
            list: `${ROOTS.DASHBOARD}/amenities/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/amenities/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/amenities/${id}/view`,
        },
        city: {
            root: `${ROOTS.DASHBOARD}/city`,
            new: `${ROOTS.DASHBOARD}/city/new`,
            list: `${ROOTS.DASHBOARD}/city/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/city/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/city/${id}/view`,
        },
        state: {
            root: `${ROOTS.DASHBOARD}/state`,
            new: `${ROOTS.DASHBOARD}/state/new`,
            list: `${ROOTS.DASHBOARD}/state/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/state/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/state/${id}/view`,
        },
        country: {
            root: `${ROOTS.DASHBOARD}/country`,
            new: `${ROOTS.DASHBOARD}/country/new`,
            list: `${ROOTS.DASHBOARD}/country/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/country/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/country/${id}/view`,
        },
        testimonials: {
            root: `${ROOTS.DASHBOARD}/testimonials`,
            new: `${ROOTS.DASHBOARD}/testimonials/new`,
            list: `${ROOTS.DASHBOARD}/testimonials/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/testimonials/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/testimonials/${id}/view`,
        },
        post: {
            root: `${ROOTS.DASHBOARD}/post`,
            new: `${ROOTS.DASHBOARD}/post/new`,
            list: `${ROOTS.DASHBOARD}/post/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/post/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/post/${id}/view`,
        },
        banner: {
            root: `${ROOTS.DASHBOARD}/banner`,
            new: `${ROOTS.DASHBOARD}/banner/new`,
            list: `${ROOTS.DASHBOARD}/banner/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/banner/${id}/edit`,
            view: (id: string) => `${ROOTS.DASHBOARD}/banner/${id}/view`,
        },
        usermanagement: {
            root: `${ROOTS.DASHBOARD}/usermanagement`,
            list: `${ROOTS.DASHBOARD}/usermanagement/list`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/usermanagement/${id}/edit`,
            account: {
                general: (id: string) => `${ROOTS.DASHBOARD}/usermanagement/account/${id}/general`,
            },
        },
        subscriptionhistory: {
            root: `${ROOTS.DASHBOARD}/subscriptionhistory`,
            list: `${ROOTS.DASHBOARD}/subscriptionhistory/list`,
            view: (id: string) => `${ROOTS.DASHBOARD}/subscriptionhistory/${id}/view`,
        },
        promo: {
            root: `${ROOTS.DASHBOARD}/promo`,
            list: `${ROOTS.DASHBOARD}/promo/list`,
            view: (id: string) => `${ROOTS.DASHBOARD}/promo/${id}/view`,
        },
        group: {
            root: `${ROOTS.DASHBOARD}/group`,
            five: `${ROOTS.DASHBOARD}/group/five`,
            six: `${ROOTS.DASHBOARD}/group/six`,
        },
    },
};
