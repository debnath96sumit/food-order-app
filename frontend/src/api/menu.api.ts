import axiosInstance from "./axios";
import type { MenuItem } from "../types";

export const fetchMenuItems = async (category?: string): Promise<MenuItem[]> => {
    const params = category ? { category } : {};
    const res = await axiosInstance.get("/menu", { params });
    return res.data.data;
};

export const fetchMenuItemById = async (id: string): Promise<MenuItem> => {
    const res = await axiosInstance.get(`/menu/${id}`);
    return res.data.data;
};