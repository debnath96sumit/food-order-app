import { Schema, model } from "mongoose";
import { IMenuItem } from "../interfaces/menu.interface";

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const MenuItemModel = model<IMenuItem>("MenuItem", menuItemSchema);