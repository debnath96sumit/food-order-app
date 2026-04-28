import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";

let io: SocketServer;

export const initSocket = (httpServer: HttpServer): void => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Client joins a room specific to their order
    socket.on("join:order", (orderId: string) => {
      socket.join(orderId);
      console.log(`📦 Socket ${socket.id} joined order room: ${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

// Emit status update only to clients watching this specific order
export const emitOrderStatusUpdate = (
  orderId: string,
  status: string
): void => {
  if (!io) return;
  io.to(orderId).emit("order:status_update", { orderId, status });
};