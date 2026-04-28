import { z } from "zod";
import { isValidObjectId } from "../utils/objectId";

const orderItemSchema = z.object({
  menuItemId: z
    .string({ required_error: "menuItem ID is required" })
    .refine(isValidObjectId, { message: "menuItemId must be a valid MongoDB ObjectId" }),
  name: z
    .string({ required_error: "Item name is required" })
    .trim()
    .min(1, "Item name cannot be empty"),
  price: z
    .number({ required_error: "Item price is required" })
    .positive("Item price must be greater than 0"),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(50, "Quantity cannot exceed 50"),
});

const deliveryDetailsSchema = z.object({
  name: z
    .string({ required_error: "Recipient name is required" })
    .trim()
    .min(1, "Recipient name cannot be empty")
    .max(100, "Recipient name must be 100 characters or less"),
  address: z
    .string({ required_error: "Delivery address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address must be 300 characters or less"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(
      /^\+?[0-9\s\-().]{7,20}$/,
      "Phone number must be a valid format (7–20 digits)"
    ),
});

export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema, { required_error: "Order items are required" })
    .min(1, "Order must contain at least one item"),
  deliveryDetails: deliveryDetailsSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type DeliveryDetailsInput = z.infer<typeof deliveryDetailsSchema>;
