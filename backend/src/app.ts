import "dotenv/config";
import { createServer } from "http";
import connectDB from "./config/db";
import app from "./app.setup";
import { initSocket } from "./socket/order.gateway";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

initSocket(httpServer);

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV === "development") {
      console.log(`📚 Swagger docs at http://localhost:${PORT}/api/docs`);
    }
  });
};

start();