import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import paymentRoutes from "./routes/payment.js";
import studentRoutes from "./routes/studentRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*", // later you can restrict
    methods: ["GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.send("Server OK");
});

app.use("/api/payment", paymentRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
