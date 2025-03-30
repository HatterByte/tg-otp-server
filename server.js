import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/otp", otpRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 OTP Service running on port ${PORT}`));
