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
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
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
    console.log("=== RECEIVED PAYMENT DATA ===");
    console.log(JSON.stringify(req.body, null, 2));

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      fullName,
      email,
      contactNumber,
      whatsappNumber,
      qualification,
      course,
      amount,
      paymentType,
    } = req.body;

    // Validate all required fields
    if (
      !fullName ||
      !email ||
      !contactNumber ||
      !qualification ||
      !course ||
      !amount
    ) {
      console.error("Missing required fields:", {
        fullName: !!fullName,
        email: !!email,
        contactNumber: !!contactNumber,
        qualification: !!qualification,
        course: !!course,
        amount: !!amount,
        paymentType: !!paymentType,
      });
      return res.status(400).json({
        message: "Missing required student details",
        received: req.body,
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Prepare payment data exactly matching your schema
    const paymentData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      contactNumber: contactNumber.trim(),
      paymentType: paymentType.trim().toLowerCase(),
      whatsappNumber: whatsappNumber
        ? whatsappNumber.trim()
        : contactNumber.trim(),
      qualification: qualification.trim(),
      interestedCourse: course.trim(), // Note: schema uses 'interestedCourse'
      amount: Number(amount),
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature,
      paymentStatus: "SUCCESS",
    };

    console.log("=== SAVING TO DATABASE ===");
    console.log(JSON.stringify(paymentData, null, 2));

    // Save to database
    const payment = await Payment.create(paymentData);

    console.log("=== PAYMENT SAVED SUCCESSFULLY ===");
    console.log(JSON.stringify(payment, null, 2));

    res.status(200).json({
      success: true,
      message: "Payment verified and student details saved successfully",
      payment,
    });
  } catch (error) {
    console.error("=== VERIFY PAYMENT ERROR ===");
    console.error(error);
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
      details: error.errors || error,
    });
  }
};
