"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateBusiness } from "@/services";
import { BusinessCategory } from "@/interface";
import { useRouter } from "next/navigation";
import {
    Utensils,
    CookingPot,
    Wrench,
    Telescope,
    Laptop,
    Briefcase,
    HeartPulse,
    Factory,
    GraduationCap,
    MoreHorizontal,
} from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Business name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    category: z.string().min(1, {
        message: "Please select a business category.",
    }),
});

interface BusinessFormProps {
    onClose: () => void;
}

const CATEGORIES = [
    {
        id: BusinessCategory.RETAIL_STORE,
        label: "Retail Store",
        icon: Utensils,
        color: "bg-[#EF4444]", // Red
    },
    {
        id: BusinessCategory.RESTAURANT,
        label: "Restaurant",
        icon: CookingPot,
        color: "bg-[#EC4899]", // Pink
    },
    {
        id: BusinessCategory.SERVICE_BUSINESS,
        label: "Service Business",
        icon: Wrench,
        color: "bg-[#8B5CF6]", // Purple
    },
    {
        id: BusinessCategory.FREELANCING,
        label: "Freelancing",
        icon: Telescope,
        color: "bg-[#06B6D4]", // Cyan
    },
    {
        id: BusinessCategory.ONLINE_BUSINESS,
        label: "Online Business",
        icon: Laptop,
        color: "bg-[#10B981]", // Emerald Green
    },
    {
        id: BusinessCategory.CONSULTING,
        label: "Consulting",
        icon: Briefcase,
        color: "bg-[#84CC16]", // Lime Green
    },
    {
        id: BusinessCategory.HEALTHCARE,
        label: "Healthcare",
        icon: HeartPulse,
        color: "bg-[#047857]", // Dark Green
    },
    {
        id: BusinessCategory.MANUFACTURING,
        label: "Manufacturing",
        icon: Factory,
        color: "bg-[#D946EF]", // Fuchsia
    },
    {
        id: BusinessCategory.EDUCATION,
        label: "Education",
        icon: GraduationCap,
        color: "bg-[#6366F1]", // Indigo
    },
    {
        id: BusinessCategory.OTHER,
        label: "Other",
        icon: MoreHorizontal,
        color: "bg-[#64748B]", // Slate
    },
];

export default function CreateBusinessForm({ onClose }: BusinessFormProps) {
    const router = useRouter();
    const {
        createBusiness,
        isCreatingBusiness,
    } = useCreateBusiness();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: BusinessCategory.RETAIL_STORE,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        createBusiness(values, {
            onSuccess: (res) => {
                console.log("Business created:", res);
                onClose();
                if (res?.data?._id) {
                    router.push(`/dashboard/business/${res.data._id}/book`);
                }
            },
            onError: (err) => {
                console.error("Error creating business:", err);
            },
        });
    }

    return (
        <div className="w-full bg-white font-sans">
            {/* Dialog Header Title matching mock: smaller, clean, no bottom border */}
            <div className="pb-2 mb-4 border-b">
                <h2 className="text-base font-bold text-slate-800">Add New Business</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Business Name and Description Field inline, with a single divider below */}
                    <div className="space-y-3.5 pb-4 border-b border-slate-300">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                                        <FormLabel className="text-xs font-semibold text-slate-500 sm:text-left">
                                            Business Title
                                        </FormLabel>
                                        <div className="hidden sm:block sm:col-span-1"> </div>
                                        <div className="sm:col-span-3">
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Here"
                                                    className="border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg h-9 text-xs placeholder:text-slate-300 placeholder:font-normal font-medium"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px] text-red-600 mt-1" />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-5 items-start gap-2 sm:gap-4">
                                        <FormLabel className="text-xs font-semibold text-slate-500 sm:text-left pt-2.5 sm:col-span-2">
                                            Business Description
                                        </FormLabel>
                                        <div className="sm:col-span-3">
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter Here"
                                                    className="border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg min-h-[70px] text-xs placeholder:text-slate-300 placeholder:font-normal font-medium resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px] text-red-600 mt-1" />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Category Field */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-xs font-semibold text-slate-500 block">
                                    Business Category
                                </FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                                        {CATEGORIES.map((cat) => {
                                            const Icon = cat.icon;
                                            const isSelected = field.value === cat.id;
                                            return (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => form.setValue("category", cat.id)}
                                                    className={`flex items-center gap-1 p-1 pr-2 rounded-full border transition-all cursor-pointer ${isSelected
                                                        ? "border-[#3b82f6] bg-blue-50/10 ring-[0.5px] ring-[#3b82f6]"
                                                        : "border-slate-200 hover:bg-slate-50/50 bg-white"
                                                        }`}
                                                >
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 ${cat.color}`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-slate-700 truncate">
                                                        {cat.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </FormControl>
                                <FormMessage className="text-[10px] text-red-600 mt-1" />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isCreatingBusiness}
                            className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold h-11 rounded-lg text-xs transition-all shadow-sm cursor-pointer"
                        >
                            {isCreatingBusiness ? "Saving..." : "Add"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
