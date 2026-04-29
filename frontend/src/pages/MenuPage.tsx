import { useEffect, useState } from "react";
import { fetchMenuItems } from "../api/menu.api";
import type { MenuItem } from "../types";
import MenuItemCard from "../components/MenuItemCard";
import Cart from "../components/Cart";

const CATEGORIES = ["All", "Pizza", "Burgers", "Drinks", "Desserts", "Pasta", "Salads", "Sides"];

const MenuPage = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchMenuItems(
                    activeCategory === "All" ? undefined : activeCategory
                );
                setItems(data);
            } catch {
                setError("Failed to load menu. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-4">
                <h1 className="text-2xl font-bold text-orange-400">🍕 FoodRush</h1>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
                {/* Left: Menu */}
                <div className="flex-1">
                    {/* Category Filter */}
                    <div className="flex gap-3 mb-8 flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* States */}
                    {loading && (
                        <div className="text-center text-gray-400 py-20">Loading menu...</div>
                    )}
                    {error && (
                        <div className="text-center text-red-400 py-20">{error}</div>
                    )}

                    {/* Grid */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <MenuItemCard key={item._id} item={item} />
                            ))}
                            {items.length === 0 && (
                                <p className="text-gray-500 col-span-3 text-center py-20">
                                    No items in this category.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Cart */}
                <div className="w-80 shrink-0">
                    <Cart />
                </div>
            </div>
        </div>
    );
};

export default MenuPage;