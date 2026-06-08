import { Router } from "express";
import {
   createPayment,
   handleWebhook,
   paymentSuccess,
   getPaymentStatus,
} from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Создание платежа (авторизованный пользователь)
router.post("/", protect, createPayment);

// Получение статуса платежа
router.get("/status/:orderId", protect, getPaymentStatus);

// Вебхук от YooKassa (без авторизации — приходит от YooKassa)
router.post("/webhook", handleWebhook);

// Редирект после успешной оплаты
router.get("/success", paymentSuccess);

export default router;
