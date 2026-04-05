// ============= server.js =============

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dns from "dns";

import connectDB from "./database/db.js";
import paymentRoutes from "./routes/payment.js";
import AdminRouter from "./routes/admin.routes.js";

/* ========= CONFIG ========= */
dotenv.config();

// ✅ FIX: Set DNS BEFORE DB connection (critical for MongoDB Atlas SRV)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

/* ========= DB CONNECTION ========= */
connectDB();

/* ========= APP INIT ========= */
const app = express();

/* ========= MIDDLEWARE ========= */
app.use(express.json());
app.use(cookieParser());

// ✅ Proper CORS config
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://growtern.com",
      "https://www.growtern.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

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