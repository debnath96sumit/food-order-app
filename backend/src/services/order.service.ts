import { IOrder, OrderStatus } from "../interfaces/order.interface";
import { OrderRepository } from "../repositories/order.repository";
import { emitOrderStatusUpdate } from "../socket/order.gateway";

const STATUS_PROGRESSION: OrderStatus[] = [
  OrderStatus.ORDER_RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];

const STATUS_DELAYS: number[] = [15000, 20000, 30000];

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(data: Partial<IOrder>): Promise<IOrder | null> {
    const order = await this.orderRepository.save(data);
    if (!order) return null;
    this.simulateStatusProgression(order._id.toString());
    return order;
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    const order = await this.orderRepository.getById(id);
    if (!order) return null;
    return order;
  }

  private async simulateStatusProgression(orderId: string): Promise<void> {
    for (let i = 1; i < STATUS_PROGRESSION.length; i++) {
      await this.delay(STATUS_DELAYS[i - 1]);
      const nextStatus = STATUS_PROGRESSION[i];

      await this.orderRepository.updateStatus(orderId, nextStatus);
      emitOrderStatusUpdate(orderId, nextStatus);
      console.log(`Order ${orderId} → ${nextStatus}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}