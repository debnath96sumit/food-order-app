import { Document, Types } from "mongoose";

export enum OrderStatus {
  ORDER_RECEIVED = "Order Received",
  PREPARING = "Preparing",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
}

export interface IOrderItem {
  menuItemId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IDeliveryDetails {
  name: string;
  address: string;
  phone: string;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  deliveryDetails: IDeliveryDetails;
  totalAmount: number;
  status: OrderStatus;
}