import { Router } from "express";
import {
   createOrder,
   getUserOrders,
   getOrderById,
} from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);

export default router;
