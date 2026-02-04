import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import paymentRoutes from "./routes/payment.js";
import AdminRouter from "./routes/admin.routes.js";

dotenv.config();
connectDB();

const app = express();

/* ========= CORS CONFIG ========= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://growtern.com",
  "https://www.growtern.com",
];

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ CORS Blocked Origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 VERY IMPORTANT (preflight fix)
app.options("*", cors());

/* ========= ROUTES ========= */
app.get("/", (req, res) => {
  res.send("🚀 Server OK");
});

app.use("/api/payment", paymentRoutes);
app.use("/api/admin", AdminRouter);

/* ========= SERVER ========= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
