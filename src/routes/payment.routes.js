import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * CREATE ORDER
 */
router.post("/order", createOrder);

/**
 * VERIFY PAYMENT
 */
router.post("/verify", verifyPayment);

/**
 * GET ALL PAYMENTS
 */
router.get("/all", getAllPayments);

export default router;
