import z from "zod";

export const sendOtp = z.object({
    email: z.email({
        message: "Please enter a valid email address.",
    })
});

export const otpSchema = z.object({
    email: z.email({
        message: "Please enter a valid email address.",
    }),
    otp: z
        .string()
        .min(6, {
            message: "OTP must be 6 characters.",
        })
        .max(6, {
            message: "OTP must be 6 characters.",
        }),
})
