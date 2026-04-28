export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isAvailable: boolean;
}

export interface CartItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface DeliveryDetails {
    name: string;
    address: string;
    phone: string;
}

export interface Order {
    _id: string;
    items: Omit<CartItem, "image">[];
    deliveryDetails: DeliveryDetails;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
}

export type OrderStatus =
    | "Order Received"
    | "Preparing"
    | "Out for Delivery"
    | "Delivered";