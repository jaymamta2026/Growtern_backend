// ============= controllers/payment.controller.js =============

import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import { sendPaymentEmail } from "../util/sendEmail.js";

dotenv.config();

/* ========= VALIDATE ENV VARS ON STARTUP ========= */
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  console.error(
    "MISSING ENV: RAZORPAY_KEY_ID or RAZORPAY_SECRET is not set. " +
      "Add them in Render → Environment."
  );
}

/* ========= RAZORPAY INSTANCE ========= */
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* =========================================================
   CREATE ORDER
   ========================================================= */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({
      message: "Order creation failed",
      error: error.message, // visible in Render logs & response during debugging
    });
  }
};

/* =========================================================
   VERIFY PAYMENT
   ========================================================= */
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

    /* ---- 1. Validate required Razorpay fields ---- */
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment fields" });
    }

    /* ---- 2. Verify signature ---- */
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.warn("Invalid signature attempt:", { razorpay_order_id, email });
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    /* ---- 3. Save payment to DB ---- */
    const paymentData = {
      fullName,
      email,
      paymentType,
      contactNumber,
      whatsappNumber: whatsappNumber || contactNumber,
      qualification,
      amount: Number(amount),
      interestedCourse: course,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentStatus: "SUCCESS",
    };

    const payment = await Payment.create(paymentData);

    /* ---- 4. Respond immediately — don't let email delay/block response ---- */
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });

    /* ---- 5. Send email AFTER response (non-blocking) ---- */
    /*
      Using .catch() here ensures an email failure never causes a 500.
      The payment is already saved and the user already got a success response.
    */
    sendPaymentEmail(paymentData).catch((emailErr) => {
      console.error("Email sending failed (payment was still saved):", emailErr.message);
    });

  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({
      message: "Payment verification failed",
      error: error.message, // remove this line after debugging
    });
  }
};

/* =========================================================
   GET ALL PAYMENTS (admin)
   ========================================================= */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("getAllPayments error:", error);
    return res.status(500).json({
      message: "Failed to fetch payment data",
      error: error.message,
    });
  }
};