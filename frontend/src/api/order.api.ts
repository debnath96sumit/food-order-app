import axiosInstance from "./axios";
import type { CartItem, DeliveryDetails, Order } from "../types";

export interface PlaceOrderPayload {
    items: Omit<CartItem, "image">[];
    deliveryDetails: DeliveryDetails;
}

export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
    const res = await axiosInstance.post("/orders", payload);
    return res.data.data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data.data;
};