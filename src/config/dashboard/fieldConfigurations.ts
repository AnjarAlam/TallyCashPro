
// Add this to your types or constants file
import { FieldConfig } from "@/interface";
import { Calendar as CalendarIcon, CreditCard, DollarSign, FileText, Info, Paperclip, Tag, User } from "lucide-react";


export const fieldConfigurations: Record<string, FieldConfig> = {
    amount: {
        label: "Amount",
        icon: DollarSign,
        description: "Transaction amount in INR",
        required: true
    },
    category: {
        label: "Category",
        icon: Tag,
        description: "Select a transaction category",
        required: true
    },
    partyName: {
        label: "Party Name",
        icon: User,
        description: "Name of the person/organization",
        required: true
    },
    otherDetail: {
        label: "Other Details",
        icon: FileText,
        description: "Additional information about the transaction"
    },
    paymentMode: {
        label: "Payment Mode",
        icon: CreditCard,
        description: "How the payment was made",
        required: true
    },
    date: {
        label: "Date",
        icon: CalendarIcon,
        description: "Transaction date",
        required: true
    },
    remark: {
        label: "Remarks",
        icon: Info,
        description: "Any additional notes"
    },
    attachments: {
        label: "Attachments",
        icon: Paperclip,
        description: "Upload supporting documents"
    }
};