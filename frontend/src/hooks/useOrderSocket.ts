import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { OrderStatus } from "../types";

let socket: Socket | null = null;

const getSocket = (): Socket => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
            transports: ["websocket"],
        });
    }
    return socket;
};

export const useOrderSocket = (orderId: string) => {
    const [status, setStatus] = useState<OrderStatus | null>(null);

    useEffect(() => {
        if (!orderId) return;

        const s = getSocket();

        s.emit("join:order", orderId);

        s.on("order:status_update", (data: { orderId: string; status: OrderStatus }) => {
            if (data.orderId === orderId) {
                setStatus(data.status);
            }
        });

        return () => {
            s.off("order:status_update");
        };
    }, [orderId]);

    return { status };
};