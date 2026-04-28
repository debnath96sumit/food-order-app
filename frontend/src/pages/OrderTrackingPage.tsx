import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById } from "../api/order.api";
import type { Order } from "../types";
import { useOrderSocket } from "../hooks/useOrderSocket";
import OrderStatusStepper from "../components/OrderStatusStepper";

const OrderTrackingPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { status: liveStatus } = useOrderSocket(id || "");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchOrderById(id!);
                setOrder(data);
            } catch {
                setError("Could not load order details.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // Merge live socket status into order state
    const currentStatus = liveStatus || order?.status;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="text-gray-400">Loading order...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="text-red-400">{error || "Order not found."}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-4">
                <h1 className="text-2xl font-bold text-orange-400">🍕 FoodRush</h1>
            </header>

            <div className="max-w-2xl mx-auto px-6 py-10">
                <h2 className="text-xl font-semibold mb-2">Order Confirmed 🎉</h2>
                <p className="text-gray-400 text-sm mb-8">Order ID: {order._id}</p>

                {/* Status Stepper */}
                {currentStatus && (
                    <OrderStatusStepper currentStatus={currentStatus} />
                )}

                {/* Order Summary */}
                <div className="bg-gray-900 rounded-xl p-5 mt-8">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="flex flex-col gap-2">
                        {order.items.map((item) => (
                            <div key={item.menuItemId} className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                    {item.name} × {item.quantity}
                                </span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-orange-400">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-gray-900 rounded-xl p-5 mt-4">
                    <h3 className="font-semibold mb-3">Delivery To</h3>
                    <p className="text-gray-300 text-sm">{order.deliveryDetails.name}</p>
                    <p className="text-gray-400 text-sm">{order.deliveryDetails.address}</p>
                    <p className="text-gray-400 text-sm">{order.deliveryDetails.phone}</p>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="mt-8 w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
};

export default OrderTrackingPage;