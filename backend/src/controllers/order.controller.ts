import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import { sendError, sendSuccess } from "../utils/response";
import { createOrderSchema } from "../validations/order.validation";
import { MenuRepository } from "../repositories/menu.repository";
import { isValidObjectId } from "../utils/objectId";

export class OrderController {
  private orderService: OrderService;
  private menuItemRepository: MenuRepository;
  constructor() {
    this.orderService = new OrderService();
    this.menuItemRepository = new MenuRepository();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = createOrderSchema.parse(req.body);

      const menuItemIds = validated.items.map((item) => item.menuItemId);
      const dbItems = await this.menuItemRepository.getAllByFields({ _id: { $in: menuItemIds } });

      const dbItemMap = new Map(dbItems.map((item) => [item._id.toString(), item]));

      const notFound: string[] = [];
      const unavailable: string[] = [];
      const priceMismatch: { id: string; sent: number; actual: number }[] = [];

      for (const item of validated.items) {
        const dbItem = dbItemMap.get(item.menuItemId);

        if (!dbItem) {
          notFound.push(item.menuItemId);
          continue;
        }

        if (!dbItem.isAvailable) {
          unavailable.push(dbItem.name);
          continue;
        }

        if (Math.abs(dbItem.price - item.price) > 0.01) {
          priceMismatch.push({
            id: item.menuItemId,
            sent: item.price,
            actual: dbItem.price,
          });
        }
      }

      if (notFound.length > 0) {
        res.status(404).json({
          success: false,
          message: `Menu item(s) not found: ${notFound.join(", ")}`,
        });
        return;
      }

      if (unavailable.length > 0) {
        res.status(400).json({
          success: false,
          message: `The following item(s) are currently unavailable: ${unavailable.join(", ")}`,
        });
        return;
      }

      if (priceMismatch.length > 0) {
        res.status(400).json({
          success: false,
          message: "Price mismatch detected for one or more items",
          errors: priceMismatch.map((p) => ({
            menuItemId: p.id,
            sentPrice: p.sent,
            actualPrice: p.actual,
          })),
        });
        return;
      }

      const totalAmount = validated.items.reduce((sum, item) => {
        const dbItem = dbItemMap.get(item.menuItemId)!;
        return sum + dbItem.price * item.quantity;
      }, 0);

      const order = await this.orderService.createOrder({
        ...validated,
        totalAmount,
      } as any);

      if (!order) {
        sendError(res, "Failed to create order", 500);
        return;
      }
      sendSuccess(res, order, "Order created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isValidObjectId(req.params.id)) {
        sendError(res, "Invalid order ID", 400);
        return;
      }
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        sendError(res, "Order not found", 404);
        return;
      }
      sendSuccess(res, order, "Order fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  };
}