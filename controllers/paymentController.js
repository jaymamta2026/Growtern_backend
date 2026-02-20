import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import { sendPaymentEmail } from "../util/sendEmail.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/**
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      fullName,
      email,
      contactNumber,
      whatsappNumber,
      qualification,
      paymentType,
      course,
      amount,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Save payment to DB
    const paymentData = {
      fullName,
      email,
      paymentType,
      contactNumber,
      whatsappNumber: whatsappNumber || contactNumber,
      qualification,
      amount: Number(amount),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentStatus: "SUCCESS",
    };

    const payment = await Payment.create(paymentData);

    // ✅ Email is isolated — won't crash payment if it fails
    try {
      await sendPaymentEmail(paymentData);
      console.log("✓ Email sent to:", email);
    } catch (emailErr) {
      console.error("Email failed (non-fatal):", emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error.message);
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

/**
 * GET ALL PAYMENTS
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment data" });
  }
};