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

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid signature" });
    }

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

    // SEND EMAIL AFTER SUCCESS
    await sendPaymentEmail(paymentData);

    res.status(200).json({
      success: true,
      message: "Payment verified and email sent",
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Payment verification failed",
    });
  }
};

/**
 * GET ALL PAYMENTS
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payment data",
    });
  }
};
