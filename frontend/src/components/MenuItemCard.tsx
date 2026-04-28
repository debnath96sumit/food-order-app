import type { MenuItem } from "../types";
import { useCart } from "../context/CartContext";

interface Props {
    item: MenuItem;
}

const MenuItemCard = ({ item }: Props) => {
    const { cart, addToCart, updateQuantity } = useCart();
    const cartItem = cart.find((c) => c.menuItemId === item._id);

    return (
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/40 transition-colors flex flex-col">
            <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
                <div className="flex-1">
                    <span className="text-xs text-orange-400 font-medium uppercase tracking-wide">
                        {item.category}
                    </span>
                    <h3 className="text-white font-semibold mt-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {item.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-white font-bold text-lg">
                        ₹{item.price.toFixed(2)}
                    </span>

                    {!cartItem ? (
                        <button
                            onClick={() => addToCart(item)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => updateQuantity(cartItem.menuItemId, cartItem.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
                            >
                                −
                            </button>
                            <span className="text-white font-semibold w-4 text-center">
                                {cartItem.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(cartItem.menuItemId, cartItem.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;