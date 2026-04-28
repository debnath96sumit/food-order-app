import { IMenuItem } from "../interfaces/menu.interface";
import { MenuItemModel } from "../models/menu.model";
import { BaseRepository } from "./base.repository";

export class MenuRepository extends BaseRepository<IMenuItem> {
  constructor() {
    super(MenuItemModel);
  }

  async findAvailable(): Promise<IMenuItem[]> {
    return this.model.find({ isAvailable: true }).exec();
  }

  async findByCategory(category: string): Promise<IMenuItem[]> {
    return this.model.find({ category, isAvailable: true }).exec();
  }
}