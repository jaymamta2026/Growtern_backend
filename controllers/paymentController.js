import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
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
    const { amount, studentId } = req.body;

    if (!amount || !studentId) {
      return res.status(400).json({ message: "Amount & studentId required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpayInstance.orders.create(options);

    // 🔗 Save payment as "created"
    const payment = await Payment.create({
      student: studentId,
      amount,
      razorpay_order_id: order.id,
      status: "created",
    });

    res.status(200).json({
      success: true,
      order,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
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
      paymentId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified",
      payment,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
