import axiosInstance from "./axiosInstance";
import { ICartItem } from "../types/cart";

export const cartApi = {
   getCart: async (): Promise<ICartItem[]> => {
      const response = await axiosInstance.get("/cart");
      return response.data;
   },

   addToCart: async (
      product_id: number,
      quantity: number = 1,
   ): Promise<ICartItem> => {
      const response = await axiosInstance.post("/cart", {
         product_id,
         quantity,
      });
      return response.data;
   },

   updateQuantity: async (
      itemId: number,
      quantity: number,
   ): Promise<ICartItem> => {
      const response = await axiosInstance.put(`/cart/${itemId}`, { quantity });
      return response.data;
   },

   removeFromCart: async (itemId: number): Promise<void> => {
      await axiosInstance.delete(`/cart/${itemId}`);
   },

   clearCart: async (): Promise<void> => {
      await axiosInstance.delete("/cart");
   },
};
