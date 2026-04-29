import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/order.api";
import { checkoutSchema, type CheckoutFormData } from "../validations/checkout.validation";
import toast from "react-hot-toast";

const CheckoutPage = () => {
    const { cart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState<CheckoutFormData>({
        name: "",
        address: "",
        phone: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Partial<CheckoutFormData>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (fieldErrors[name as keyof CheckoutFormData]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const result = checkoutSchema.safeParse(form);
        if (!result.success) {
            const errors: Partial<CheckoutFormData> = {};
            result.error.flatten().fieldErrors;
            Object.entries(result.error.flatten().fieldErrors).forEach(([field, messages]) => {
                if (messages?.[0]) {
                    errors[field as keyof CheckoutFormData] = messages[0];
                }
            });
            setFieldErrors(errors);
            toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            setLoading(true);

            const order = await placeOrder({
                items: cart.map(({ menuItemId, name, price, quantity }) => ({
                    menuItemId,
                    name,
                    price,
                    quantity,
                })),
                deliveryDetails: result.data,
            });

            clearCart();
            toast.success("Order placed successfully!");
            navigate(`/order/${order._id}`);
        } catch (err: any) {
            if (err.errors && Array.isArray(err.errors)) {
                err.errors.forEach(({ message }: { message: string }) => {
                    toast.error(message);
                });
            } else {
                toast.error(err.message || "Failed to place order. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Your cart is empty.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="text-orange-400 underline"
                    >
                        Go back to menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-4">
                <h1 className="text-2xl font-bold text-orange-400">🍕 FoodRush</h1>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${fieldErrors.name
                                    ? "border-red-500"
                                    : "border-gray-700 focus:border-orange-500"
                                    }`}
                            />
                            {fieldErrors.name && (
                                <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="123 Main St, City"
                                rows={3}
                                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none transition-colors ${fieldErrors.address
                                    ? "border-red-500"
                                    : "border-gray-700 focus:border-orange-500"
                                    }`}
                            />
                            {fieldErrors.address && (
                                <p className="text-red-400 text-xs mt-1">{fieldErrors.address}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${fieldErrors.phone
                                    ? "border-red-500"
                                    : "border-gray-700 focus:border-orange-500"
                                    }`}
                            />
                            {fieldErrors.phone && (
                                <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            {loading ? "Placing Order..." : `Place Order • ₹${totalAmount.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                    <div className="bg-gray-900 rounded-xl p-5 flex flex-col gap-3">
                        {cart.map((item) => (
                            <div key={item.menuItemId} className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                    {item.name} × {item.quantity}
                                </span>
                                <span className="text-white font-medium">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-orange-400">₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;