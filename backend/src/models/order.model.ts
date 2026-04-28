import { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from "../interfaces/order.interface";

const orderSchema = new Schema<IOrder>(
  {
    items: [
      {
        menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    deliveryDetails: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.ORDER_RECEIVED,
    },
  },
  { timestamps: true, versionKey: false }
);

export const OrderModel = model<IOrder>("Order", orderSchema);