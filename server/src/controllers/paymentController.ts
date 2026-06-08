import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import {
   createYooKassaPayment,
   getYooKassaPaymentStatus,
} from "../config/yookassa";

export const createPayment = async (req: AuthRequest, res: Response) => {
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

      // Создаём заказ в статусе "pending"
      const order = await Order.create({
         user_id: req.user!.id,
         total,
         status: "pending",
      });

      // Создаём позиции заказа
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

      // Создаём платёж в YooKassa
      const returnUrl = `${req.protocol}://${req.get("host")}/api/payments/success?order_id=${order.id}`;
      const payment = await createYooKassaPayment(
         total,
         `Заказ №${order.id}`,
         returnUrl,
         { order_id: String(order.id) },
      );

      // Сохраняем payment_url и yookassa_payment_id в заказ
      await order.update({
         payment_url: payment.confirmation?.confirmation_url || null,
         yookassa_payment_id: payment.id,
      });

      // Очищаем корзину
      await CartItem.destroy({ where: { user_id: req.user!.id } });

      res.json({
         order_id: order.id,
         payment_url: payment.confirmation?.confirmation_url,
         payment_id: payment.id,
      });
   } catch (error: any) {
      console.error("YooKassa error:", error.response?.data || error.message);
      res.status(500).json({ message: "Ошибка при создании платежа" });
   }
};

export const handleWebhook = async (req: AuthRequest | any, res: Response) => {
   try {
      const event = req.body;

      // Проверяем, что это уведомление от YooKassa
      if (event.type === "notification") {
         const paymentId = event.object.id;
         const newStatus = event.event;

         // Находим заказ по yookassa_payment_id
         const order = await Order.findOne({
            where: { yookassa_payment_id: paymentId },
         });

         if (!order) {
            return res.status(404).json({ message: "Заказ не найден" });
         }

         if (newStatus === "payment.succeeded") {
            await order.update({ status: "paid" });
         } else if (newStatus === "payment.canceled") {
            await order.update({ status: "cancelled" });
         }
      }

      // YooKassa ожидает 200 OK
      res.status(200).json({ message: "OK" });
   } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Ошибка обработки вебхука" });
   }
};

export const paymentSuccess = async (req: AuthRequest | any, res: Response) => {
   try {
      const { order_id } = req.query;

      if (!order_id) {
         return res.redirect(
            `${process.env.CLIENT_URL || "http://localhost:5173"}/cart`,
         );
      }

      const order = await Order.findByPk(Number(order_id));

      if (!order) {
         return res.redirect(
            `${process.env.CLIENT_URL || "http://localhost:5173"}/cart`,
         );
      }

      // Проверяем статус платежа в YooKassa
      if (order.yookassa_payment_id) {
         const paymentStatus = await getYooKassaPaymentStatus(
            order.yookassa_payment_id,
         );

         if (paymentStatus.status === "succeeded" && order.status !== "paid") {
            await order.update({ status: "paid" });
         }
      }

      // Редиректим на фронтенд
      res.redirect(
         `${process.env.CLIENT_URL || "http://localhost:5173"}/cart?payment=success`,
      );
   } catch (error) {
      console.error("Payment success error:", error);
      res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/cart`);
   }
};

export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
   try {
      const { orderId } = req.params;

      const order = await Order.findOne({
         where: { id: orderId, user_id: req.user!.id },
      });

      if (!order) {
         return res.status(404).json({ message: "Заказ не найден" });
      }

      res.json({
         status: order.status,
         payment_url: order.payment_url,
      });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при получении статуса" });
   }
};
