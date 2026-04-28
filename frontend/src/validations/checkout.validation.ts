import { z } from "zod";

export const checkoutSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phone: z
        .string()
        .regex(/^\+?[\d\s\-]{7,20}$/, "Enter a valid phone number"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;