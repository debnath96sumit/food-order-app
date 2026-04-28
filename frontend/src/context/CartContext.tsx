import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, MenuItem } from "../types";

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (menuItemId: string) => void;
    updateQuantity: (menuItemId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem("cart");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.menuItemId === item._id);
            if (existing) {
                return prev.map((c) =>
                    c.menuItemId === item._id
                        ? { ...c, quantity: c.quantity + 1 }
                        : c
                );
            }
            return [
                ...prev,
                {
                    menuItemId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    image: item.image,
                },
            ];
        });
    };

    const removeFromCart = (menuItemId: string) => {
        setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
    };

    const updateQuantity = (menuItemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(menuItemId);
            return;
        }
        setCart((prev) =>
            prev.map((c) =>
                c.menuItemId === menuItemId ? { ...c, quantity } : c
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalAmount,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};