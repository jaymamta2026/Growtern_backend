import express from "express";
import dotenv from "dotenv";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

dotenv.config();

const router = express.Router();

/**
 * CREATE ORDER
 */
router.post("/order", createOrder);

/**
 * VERIFY PAYMENT
 */
router.post("/verify", verifyPayment);

export default router;
