import type { CartItem as CartItemType } from "../types";
import { useCart } from "../context/CartContext";

interface Props {
    item: CartItemType;
}

const CartItem = ({ item }: Props) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
            <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                <p className="text-orange-400 text-sm">₹{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition-colors"
                >
                    −
                </button>
                <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors"
                >
                    +
                </button>
                <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm font-bold transition-colors ml-1"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default CartItem;