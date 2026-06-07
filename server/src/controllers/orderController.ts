import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import CartItem from "../models/CartItem";
import Product from "../models/Product";

export const createOrder = async (req: AuthRequest, res: Response) => {
   try {
      const cartItems = await CartItem.findAll({
         where: { user_id: req.user!.id },
         include: [{ model: Product, as: "product" }],
      });

      if (cartItems.length === 0) {
         return res.status(400).json({ message: "Корзина пуста" });
      }

      let total = 0;
      for (const item of cartItems) {
         if (item.product) {
            total += Number(item.product.price) * item.quantity;
         }
      }

      const order = await Order.create({
         user_id: req.user!.id,
         total,
         status: "pending",
      });

      for (const item of cartItems) {
         if (item.product) {
            await OrderItem.create({
               order_id: order.id,
               product_id: item.product_id,
               quantity: item.quantity,
               price: item.product.price,
            });
         }
      }

      await CartItem.destroy({ where: { user_id: req.user!.id } });

      res.status(201).json({
         ...order.toJSON(),
         message: "Заказ успешно создан",
      });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при создании заказа", error });
   }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
   try {
      const orders = await Order.findAll({
         where: { user_id: req.user!.id },
         include: [
            {
               model: OrderItem,
               as: "items",
               include: [
                  {
                     model: Product,
                     as: "product",
                     attributes: ["id", "name", "price"],
                  },
               ],
            },
         ],
         order: [["created_at", "DESC"]],
      });

      res.json(orders);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при получении заказов", error });
   }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
   try {
      const order = await Order.findOne({
         where: { id: req.params.id, user_id: req.user!.id },
         include: [
            {
               model: OrderItem,
               as: "items",
               include: [
                  {
                     model: Product,
                     as: "product",
                     attributes: ["id", "name", "price"],
                  },
               ],
            },
         ],
      });

      if (!order) {
         return res.status(404).json({ message: "Заказ не найден" });
      }

      res.json(order);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при получении заказа", error });
   }
};
