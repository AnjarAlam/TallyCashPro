// --- Request Payloads ---

export interface RequestOtpDto {
    email: string;
}

export interface VerifyOtpDto {
    email: string;
    otp: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}


// --- Response Payloads ---

export interface RequestOtpResponse {
    data: {
        message: string; // e.g. "OTP sent successfully"
    }
}

export interface VerifyOtpResponse {
    data: {
        name?: string
        _id: string,
        email: string,
        emailVerified: boolean,
        fcmTokens: string[],
        status: string,
        createdAt: string,
        updatedAt: string,
        accessToken: string;
        refreshToken: string;
        expiresIn: number; // optional, depending on your server response
    }
}

export interface RefreshTokenResponse {
    data: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }
}

export interface LogoutResponse {
    data: {
        message: string; // e.g. "Successfully logged out"
    }
}



export interface UpdateUserDto {
    email?: string;
    firebaseUid?: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
    fcmTokens?: string[];
    name?: string;
    contact?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    status?: string;
    otp?: string;
    otpExpiresAt?: string;
    accessToken?: string;
    refreshToken?: string;
    createdBy?: string;
    updatedBy?: string;

};

export interface UpdateUserResponse {
    // Define the expected response shape here
    // For example:
    success: boolean;
    message?: string;
    user?: UpdateUserDto;
};