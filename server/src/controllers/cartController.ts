import { Response } from "express";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import ProductImage from "../models/ProductImage";
import { AuthRequest } from "../middleware/authMiddleware";

export const getCart = async (req: AuthRequest, res: Response) => {
   try {
      const cartItems = await CartItem.findAll({
         where: { user_id: req.user!.id },
         include: [
            {
               model: Product,
               as: "product",
               include: [
                  {
                     model: ProductImage,
                     as: "images",
                     attributes: ["id", "image_url", "sort_order"],
                     order: [["sort_order", "ASC"]],
                  },
               ],
            },
         ],
         order: [["created_at", "DESC"]],
      });

      res.json(cartItems);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при получении корзины", error });
   }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
   try {
      const { product_id, quantity = 1 } = req.body;

      const product = await Product.findByPk(product_id);
      if (!product) {
         return res.status(404).json({ message: "Товар не найден" });
      }

      const existingItem = await CartItem.findOne({
         where: { user_id: req.user!.id, product_id },
      });

      if (existingItem) {
         existingItem.quantity += quantity;
         await existingItem.save();
         return res.json(existingItem);
      }

      const cartItem = await CartItem.create({
         user_id: req.user!.id,
         product_id,
         quantity,
      });

      res.status(201).json(cartItem);
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при добавлении в корзину",
         error,
      });
   }
};

export const updateQuantity = async (req: AuthRequest, res: Response) => {
   try {
      const cartItem = await CartItem.findOne({
         where: { id: req.params.itemId, user_id: req.user!.id },
      });

      if (!cartItem) {
         return res.status(404).json({ message: "Элемент корзины не найден" });
      }

      const { quantity } = req.body;
      if (quantity < 1) {
         return res
            .status(400)
            .json({ message: "Количество должно быть больше 0" });
      }

      cartItem.quantity = quantity;
      await cartItem.save();

      res.json(cartItem);
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при обновлении количества",
         error,
      });
   }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
   try {
      const cartItem = await CartItem.findOne({
         where: { id: req.params.itemId, user_id: req.user!.id },
      });

      if (!cartItem) {
         return res.status(404).json({ message: "Элемент корзины не найден" });
      }

      await cartItem.destroy();
      res.json({ message: "Товар удален из корзины" });
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при удалении из корзины",
         error,
      });
   }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
   try {
      await CartItem.destroy({ where: { user_id: req.user!.id } });
      res.json({ message: "Корзина очищена" });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при очистке корзины", error });
   }
};
