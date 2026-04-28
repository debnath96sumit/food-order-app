import { IMenuItem } from "../interfaces/menu.interface";
import { MenuRepository } from "../repositories/menu.repository";

export class MenuService {
  private menuRepository: MenuRepository;

  constructor() {
    this.menuRepository = new MenuRepository();
  }

  async getAllItems(): Promise<IMenuItem[]> {
    return this.menuRepository.findAvailable();
  }

  async getItemById(id: string): Promise<IMenuItem | null> {
    const item = await this.menuRepository.getById(id);
    if (!item) return null;
    return item;
  }

  async getItemsByCategory(category: string): Promise<IMenuItem[]> {
    return this.menuRepository.findByCategory(category);
  }
}