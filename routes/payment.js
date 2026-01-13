import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
const router = express.Router();

/**
 * CREATE ORDER
 */
router.post("/order", createOrder);

/**
 * VERIFY PAYMENT
 */
router.post("/verify",verifyPayment);

export default router;
