import * as z from "zod";

export const paymentModes = [] as string[];
export const categories = [] as string[];

export const transactionFormSchema = z.object({
    amount: z.number().min(1, "Amount must be positive"),
    category: z.string().optional(),
    partyName: z.string().optional(),
    otherDetail: z.string().optional(),
    paymentMode: z.string().optional(),
    date: z.date().optional(),
    remark: z.string().optional(),
    attachments: // For S3 metadata
        z.array(z.object({
            url: z.string(),
            key: z.string(),
            fileType: z.string(),
            mimeType: z.string(),
            size: z.number(),

            // ... other fields
        })).optional(),
    description: z.string().optional()
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type FieldVisibility = Record<keyof TransactionFormValues, boolean>;