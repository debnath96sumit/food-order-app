import request from "supertest";
import mongoose, { Types } from "mongoose";
import app from "../app.setup";
import { MenuItemModel } from "../models/menu.model";
import connectDB from "../config/db";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await MenuItemModel.deleteMany({});
});

describe("Menu Endpoints", () => {
    describe("GET /api/menu", () => {
        it("should return empty array if no menu items exist", async () => {
            const res = await request(app).get("/api/menu");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual([]);
        });

        it("should return all menu items", async () => {
            await MenuItemModel.create([
                {
                    name: "Burger",
                    description: "A tasty burger",
                    price: 5.99,
                    image: "burger.jpg",
                    category: "Burgers",
                },
                {
                    name: "Pizza",
                    description: "A cheesy pizza",
                    price: 8.99,
                    image: "pizza.jpg",
                    category: "Pizza",
                },
            ]);

            const res = await request(app).get("/api/menu");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(2);
            expect(res.body.data[0].name).toBe("Burger");
            expect(res.body.data[1].name).toBe("Pizza");
        });

        it("should filter items by category", async () => {
            await MenuItemModel.create([
                {
                    name: "Burger",
                    description: "A tasty burger",
                    price: 5.99,
                    image: "burger.jpg",
                    category: "Burgers",
                },
                {
                    name: "Pizza",
                    description: "A cheesy pizza",
                    price: 8.99,
                    image: "pizza.jpg",
                    category: "Pizza",
                },
            ]);

            const res = await request(app).get("/api/menu?category=Pizza");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].name).toBe("Pizza");
        });
    });

    describe("GET /api/menu/:id", () => {
        it("should return a single menu item by ID", async () => {
            const item = await MenuItemModel.create({
                name: "Burger",
                description: "A tasty burger",
                price: 5.99,
                image: "burger.jpg",
                category: "Burgers",
            });

            const res = await request(app).get(`/api/menu/${item._id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Burger");
            expect(res.body.data._id).toBe(item._id.toString());
        });

        it("should return 404 for a non-existent valid ObjectId", async () => {
            const fakeId = new Types.ObjectId().toString();
            const res = await request(app).get(`/api/menu/${fakeId}`);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Menu item not found");
        });

        it("should return 400 for an invalid ObjectId format", async () => {
            const res = await request(app).get("/api/menu/not-an-id");
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Invalid menu item ID");
        });
    });
});
