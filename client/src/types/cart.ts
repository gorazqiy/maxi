import { IProduct } from "./product";

export interface ICartItem {
   id: number;
   user_id: number;
   product_id: number;
   product: IProduct;
   quantity: number;
   created_at: string;
}

export interface IOrder {
   id: number;
   user_id: number;
   total: number;
   status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
   items?: IOrderItem[];
   created_at: string;
}

export interface IOrderItem {
   id: number;
   order_id: number;
   product_id: number;
   product: IProduct;
   quantity: number;
   price: number;
}
