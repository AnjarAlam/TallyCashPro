import { DEFAULT_COUNTRY_CODE } from "@/constants/country-codes";
import { buildFullMobile, isValidInternationalPhone } from "@/lib/phone-number";
import { z } from "zod";

export const partyFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["Customer", "Supplier"]),
    countryCode: z.string().min(2, "Country code is required"),
    phoneNumber: z
      .string()
      .min(6, "Enter a valid mobile number")
      .regex(/^\d+$/, "Mobile number should contain digits only"),
    email: z.email("Invalid email").optional().or(z.literal("")),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .superRefine((values, ctx) => {
    const mobile = buildFullMobile(values.countryCode, values.phoneNumber);
    if (!isValidInternationalPhone(mobile)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid phone number with country code",
        path: ["phoneNumber"],
      });
    }
  });

export type PartyFormValues = z.infer<typeof partyFormSchema>;

export function getPartyFormDefaults(
  overrides?: Partial<PartyFormValues>,
): PartyFormValues {
  return {
    name: "",
    type: "Customer",
    countryCode: DEFAULT_COUNTRY_CODE,
    phoneNumber: "",
    email: "",
    status: "active",
    ...overrides,
  };
}

export function toPartyMobilePayload(values: Pick<PartyFormValues, "countryCode" | "phoneNumber">) {
  return buildFullMobile(values.countryCode, values.phoneNumber);
}
