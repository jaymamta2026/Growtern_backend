import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import paymentRoutes from "./routes/payment.js";
import AdminRouter from "./routes/admin.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

/* ===== FORCE CORS (Render Safe) ===== */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ===== ROUTES ===== */
app.get("/", (req, res) => {
  res.send("🚀 Server OK");
});

app.use("/api/payment", paymentRoutes);
app.use("/api/admin", AdminRouter);

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
