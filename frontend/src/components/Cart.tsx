import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

const Cart = () => {
    const { cart, totalAmount, totalItems } = useCart();
    const navigate = useNavigate();

    return (
        <div className="sticky top-24 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col">
            <h2 className="text-white font-semibold text-lg mb-4">
                Your Cart{" "}
                {totalItems > 0 && (
                    <span className="text-orange-400 text-sm font-normal">
                        ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                )}
            </h2>

            {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-10">
                    <p className="text-gray-500 text-sm text-center">
                        Your cart is empty. <br /> Add something delicious!
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto max-h-96">
                        {cart.map((item) => (
                            <CartItem key={item.menuItemId} item={item} />
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex justify-between text-white font-semibold mb-4">
                            <span>Total</span>
                            <span className="text-orange-400">₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;