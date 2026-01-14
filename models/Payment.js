import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // 🔗 Student who is paying
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // 💰 Amount
    amount: {
      type: Number,
      required: true,
    },

    // 🧾 Razorpay details
    razorpay_order_id: {
      type: String,
      required: true,
    },

    razorpay_payment_id: {
      type: String,
      default: null, // ✅ comes after payment
    },

    razorpay_signature: {
      type: String,
      default: null,
    },

    // 📌 Payment status
    status: {
      type: String,
      enum: ["created", "success", "failed"],
      default: "created",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
