import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  // User Details
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  interestedCourse: {
    type: String,
    required: true,
  },

  // Payment Details
  amount: {
    type: Number,
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "SUCCESS",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", PaymentSchema);
