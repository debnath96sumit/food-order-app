import { IOrder, OrderStatus } from "../interfaces/order.interface";
import { OrderModel } from "../models/order.model";
import { BaseRepository } from "./base.repository";

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }

  async findByStatus(status: OrderStatus): Promise<IOrder[]> {
    return this.model.find({ status }).exec();
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<IOrder | null> {
    return this.model
      .findByIdAndUpdate(orderId, { status }, { new: true })
      .exec();
  }
}