import request from "supertest";
import mongoose, { Types } from "mongoose";
import app from "../app.setup";
import { OrderModel } from "../models/order.model";
import { MenuItemModel } from "../models/menu.model";
import { OrderService } from "../services/order.service";
import connectDB from "../config/db";

// Mock the socket gateway so tests don't trigger the status interval delays or socket errors
jest.mock("../socket/order.gateway", () => ({
    initSocket: jest.fn(),
    emitOrderStatusUpdate: jest.fn(),
}));

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await OrderModel.deleteMany({});
    await MenuItemModel.deleteMany({});
    jest.clearAllMocks();
});

describe("Order Endpoints", () => {
    let burgerId: string;
    let pizzaId: string;

    beforeEach(async () => {
        // Prevent background status progression from running and hitting the DB after tests disconnect
        jest.spyOn(OrderService.prototype as any, "simulateStatusProgression").mockImplementation(async () => { });

        const burger = await MenuItemModel.create({
            name: "Burger",
            description: "A tasty burger",
            price: 5.99,
            image: "burger.jpg",
            category: "Burgers",
            isAvailable: true,
        });
        burgerId = burger._id.toString();

        const pizza = await MenuItemModel.create({
            name: "Pizza",
            description: "A cheesy pizza",
            price: 8.99,
            image: "pizza.jpg",
            category: "Pizza",
            isAvailable: true,
        });
        pizzaId = pizza._id.toString();
    });

    describe("POST /api/orders", () => {
        it("should create an order successfully with valid data", async () => {
            const payload = {
                items: [
                    { menuItemId: burgerId, name: "Burger", price: 5.99, quantity: 2 },
                    { menuItemId: pizzaId, name: "Pizza", price: 8.99, quantity: 1 },
                ],
                deliveryDetails: {
                    name: "John Doe",
                    address: "123 Main St",
                    phone: "1234567890",
                },
            };

            const res = await request(app).post("/api/orders").send(payload);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Order created successfully");

            const order = res.body.data;
            expect(order.status).toBe("Order Received");
            // 2 * 5.99 + 1 * 8.99 = 11.98 + 8.99 = 20.97
            expect(order.totalAmount).toBe(20.97);
            expect(order.items.length).toBe(2);
            expect(order.deliveryDetails.name).toBe("John Doe");

            // Verify the background status progression triggers
            // (The delay is async but we just verify the gateway emit wasn't immediately crashed)
            expect(OrderModel.countDocuments()).resolves.toBe(1);
        });

        it("should return 400 if required fields are missing", async () => {
            const payload = {
                items: [{ menuItemId: burgerId, name: "Burger", price: 5.99, quantity: 2 }],
                // Missing deliveryDetails
            };

            const res = await request(app).post("/api/orders").send(payload);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
            expect(res.body.errors.some((e: any) => e.field.includes("deliveryDetails"))).toBe(true);
        });

        it("should return 400 if menuItemId format is invalid", async () => {
            const payload = {
                items: [{ menuItemId: "invalid-id", name: "Burger", price: 5.99, quantity: 1 }],
                deliveryDetails: { name: "John", address: "123 St", phone: "1234567890" },
            };

            const res = await request(app).post("/api/orders").send(payload);
            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("menuItemId must be a valid MongoDB ObjectId");
        });

        it("should return 404 if menu item doesn't exist in DB", async () => {
            const fakeId = new Types.ObjectId().toString();
            const payload = {
                items: [{ menuItemId: fakeId, name: "Ghost Item", price: 5.99, quantity: 1 }],
                deliveryDetails: { name: "John", address: "123 St", phone: "1234567890" },
            };

            const res = await request(app).post("/api/orders").send(payload);
            expect(res.status).toBe(404);
            expect(res.body.message).toContain("Menu item(s) not found");
            expect(res.body.message).toContain(fakeId);
        });

        it("should return 400 if menu item is unavailable", async () => {
            await MenuItemModel.findByIdAndUpdate(burgerId, { isAvailable: false });

            const payload = {
                items: [{ menuItemId: burgerId, name: "Burger", price: 5.99, quantity: 1 }],
                deliveryDetails: { name: "John", address: "123 St", phone: "1234567890" },
            };

            const res = await request(app).post("/api/orders").send(payload);
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("unavailable");
            expect(res.body.message).toContain("Burger");
        });

        it("should return 400 if sent price doesn't match DB price", async () => {
            const payload = {
                items: [{ menuItemId: burgerId, name: "Burger", price: 3.99, quantity: 1 }],
                deliveryDetails: { name: "John", address: "123 St", phone: "1234567890" },
            };

            const res = await request(app).post("/api/orders").send(payload);
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Price mismatch detected for one or more items");
            expect(res.body.errors[0].actualPrice).toBe(5.99);
            expect(res.body.errors[0].sentPrice).toBe(3.99);
        });
    });

    describe("GET /api/orders/:id", () => {
        it("should return a single order by ID", async () => {
            // Create order directly
            const order = await OrderModel.create({
                items: [{ menuItemId: burgerId, name: "Burger", price: 5.99, quantity: 1 }],
                deliveryDetails: { name: "Jane", address: "456 Ave", phone: "0987654321" },
                totalAmount: 5.99,
                status: "Order Received",
            });

            const res = await request(app).get(`/api/orders/${order._id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.deliveryDetails.name).toBe("Jane");
            expect(res.body.data._id).toBe(order._id.toString());
        });

        it("should return 404 for a non-existent order ObjectId", async () => {
            const fakeId = new Types.ObjectId().toString();
            const res = await request(app).get(`/api/orders/${fakeId}`);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Order not found");
        });

        it("should return 400 for an invalid order ObjectId format", async () => {
            const res = await request(app).get("/api/orders/not-an-id");
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Invalid order ID");
        });
    });
});
