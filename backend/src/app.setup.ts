import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import menuRoutes from "./routes/menu.routes";
import orderRoutes from "./routes/order.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    const swaggerOptions: swaggerJsdoc.Options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Food Order App API",
                version: "1.0.0",
                description: "REST API for the food order app",
            },
            servers: [
                {
                    url: `http://localhost:${PORT}`,
                    description: "Development server",
                },
            ],
            components: {
                schemas: {
                    MenuItem: {
                        type: "object",
                        properties: {
                            _id: { type: "string" },
                            name: { type: "string" },
                            description: { type: "string" },
                            price: { type: "number" },
                            image: { type: "string" },
                            category: { type: "string" },
                            isAvailable: { type: "boolean" },
                        },
                    },
                    OrderItem: {
                        type: "object",
                        properties: {
                            menuItemId: { type: "string" },
                            name: { type: "string" },
                            price: { type: "number" },
                            quantity: { type: "number" },
                        },
                    },
                    DeliveryDetails: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            address: { type: "string" },
                            phone: { type: "string" },
                        },
                    },
                    Order: {
                        type: "object",
                        properties: {
                            _id: { type: "string" },
                            items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/OrderItem" },
                            },
                            deliveryDetails: {
                                $ref: "#/components/schemas/DeliveryDetails",
                            },
                            totalAmount: { type: "number" },
                            status: {
                                type: "string",
                                enum: [
                                    "Order Received",
                                    "Preparing",
                                    "Out for Delivery",
                                    "Delivered",
                                ],
                            },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                },
            },
        },
        apis: ["./src/routes/*.routes.ts"],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.get("/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
});

app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
