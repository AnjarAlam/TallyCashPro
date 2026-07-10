// JWT Storage Key
export const JWT_STORAGE_KEY = "accessToken"

// API Routes
export const API_ENDPOINTS = {
    AUTH: {
        GOOGLE_LOGIN: "/auth/gmail/login",
        GOOGLE_SUCCESS: "/auth/gmail/login/success",
        GOOGLE_LOGOUT: "/auth/gmail/logout",
        SEND_OTP: "/auth/send-otp",
        VERIFY_OTP: "/auth/verify-otp",
        REGISTER: "/auth/register",
    },

} as const

