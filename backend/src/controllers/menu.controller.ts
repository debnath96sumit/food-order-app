import { Request, Response, NextFunction } from "express";
import { MenuService } from "../services/menu.service";
import { sendError, sendSuccess } from "../utils/response";
import { isValidObjectId } from "../utils/objectId";

export class MenuController {
  private menuService: MenuService;

  constructor() {
    this.menuService = new MenuService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.query;
      const items = category
        ? await this.menuService.getItemsByCategory(category as string)
        : await this.menuService.getAllItems();
      sendSuccess(res, items, "Menu items fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isValidObjectId(req.params.id)) {
        sendError(res, "Invalid menu item ID", 400);
        return;
      }
      const item = await this.menuService.getItemById(req.params.id);
      if (!item) {
        sendError(res, "Menu item not found", 404);
        return;
      }
      sendSuccess(res, item, "Menu item fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  };
}