import { Router } from "express";
import {
   getCart,
   addToCart,
   updateQuantity,
   removeFromCart,
   clearCart,
} from "../controllers/cartController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:itemId", protect, updateQuantity);
router.delete("/:itemId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
