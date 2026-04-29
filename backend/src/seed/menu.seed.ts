import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { MenuItemModel } from "../models/menu.model";

const menuItems = [
    // Burgers
    {
        name: "Classic Cheeseburger",
        description:
            "Juicy beef patty with cheddar cheese, lettuce, tomato, pickles, and house sauce in a toasted brioche bun.",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        category: "Burgers",
        isAvailable: true,
    },
    {
        name: "BBQ Bacon Burger",
        description:
            "Double beef patty topped with crispy bacon, smoky BBQ sauce, caramelised onions, and aged cheddar.",
        price: 12.49,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
        category: "Burgers",
        isAvailable: true,
    },
    {
        name: "Veggie Mushroom Burger",
        description:
            "Portobello mushroom patty with avocado, Swiss cheese, arugula, and garlic aioli on a whole-wheat bun.",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400",
        category: "Burgers",
        isAvailable: true,
    },

    // Pizza
    {
        name: "Margherita Pizza",
        description:
            "Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil leaves.",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
        category: "Pizza",
        isAvailable: true,
    },
    {
        name: "Pepperoni Pizza",
        description:
            "Loaded with premium pepperoni slices, mozzarella, and zesty tomato sauce on a hand-tossed crust.",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
        category: "Pizza",
        isAvailable: true,
    },
    {
        name: "BBQ Chicken Pizza",
        description:
            "Grilled chicken, red onions, corn, and jalapeños on a smoky BBQ base with mozzarella.",
        price: 14.49,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
        category: "Pizza",
        isAvailable: true,
    },

    // Pasta
    {
        name: "Spaghetti Bolognese",
        description:
            "Al dente spaghetti tossed in a slow-cooked beef and tomato ragù, finished with Parmesan shavings.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400",
        category: "Pasta",
        isAvailable: true,
    },
    {
        name: "Penne Arrabiata",
        description:
            "Penne pasta in a fiery garlic and chilli tomato sauce, garnished with fresh parsley.",
        price: 10.49,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        category: "Pasta",
        isAvailable: true,
    },
    {
        name: "Creamy Fettuccine Alfredo",
        description:
            "Fettuccine in a rich Parmesan cream sauce with a hint of nutmeg, served with garlic bread.",
        price: 11.49,
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400",
        category: "Pasta",
        isAvailable: true,
    },

    // Salads
    {
        name: "Caesar Salad",
        description:
            "Crisp romaine lettuce, house-made Caesar dressing, shaved Parmesan, croutons, and anchovies.",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
        category: "Salads",
        isAvailable: true,
    },
    {
        name: "Greek Salad",
        description:
            "Tomatoes, cucumbers, olives, red onion, and feta cheese dressed in extra-virgin olive oil and oregano.",
        price: 8.49,
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
        category: "Salads",
        isAvailable: true,
    },

    // Sides
    {
        name: "Crispy French Fries",
        description:
            "Golden, hand-cut fries seasoned with sea salt, served with your choice of dipping sauce.",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
        category: "Sides",
        isAvailable: true,
    },
    {
        name: "Onion Rings",
        description:
            "Beer-battered onion rings fried to a perfect golden crisp, served with smoky chipotle mayo.",
        price: 4.49,
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400",
        category: "Sides",
        isAvailable: true,
    },
    {
        name: "Garlic Bread",
        description:
            "Toasted sourdough slices brushed with herb-infused garlic butter, served warm.",
        price: 3.49,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        category: "Sides",
        isAvailable: true,
    },

    // Drinks
    {
        name: "Fresh Lemonade",
        description:
            "Freshly squeezed lemonade served over ice with a sprig of mint.",
        price: 2.99,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400",
        category: "Drinks",
        isAvailable: true,
    },
    {
        name: "Chocolate Milkshake",
        description:
            "Thick and creamy milkshake blended with rich Belgian chocolate ice cream, topped with whipped cream.",
        price: 5.49,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",
        category: "Drinks",
        isAvailable: true,
    },
    {
        name: "Iced Coffee",
        description:
            "Cold-brewed coffee served over ice with milk and a drizzle of caramel syrup.",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
        category: "Drinks",
        isAvailable: true,
    },

    // Desserts
    {
        name: "New York Cheesecake",
        description:
            "Dense, creamy cheesecake on a buttery Graham cracker crust, topped with fresh strawberry compote.",
        price: 6.49,
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
        category: "Desserts",
        isAvailable: true,
    },
    {
        name: "Warm Chocolate Brownie",
        description:
            "Rich, fudgy chocolate brownie served warm with a scoop of vanilla bean ice cream.",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
        category: "Desserts",
        isAvailable: true,
    },
    {
        name: "Tiramisu",
        description:
            "Classic Italian dessert with espresso-soaked ladyfingers layered in mascarpone cream and dusted with cocoa.",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        category: "Desserts",
        isAvailable: false,
    },
];

const seedMenus = async (): Promise<void> => {
    try {
        await connectDB();

        // Clear existing menu items
        await MenuItemModel.deleteMany({});
        console.log("Cleared existing menu items");

        // Insert seed data
        const inserted = await MenuItemModel.insertMany(menuItems);
        console.log(`Seeded ${inserted.length} menu items successfully`);

        const categories = [...new Set(menuItems.map((item) => item.category))];
        console.log(`Categories: ${categories.join(", ")}`);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

seedMenus();
