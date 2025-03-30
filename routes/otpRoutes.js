import express from "express";
import { telegramWebhook, sendOTP } from "../controllers/otpController.js";

const router = express.Router();

router.post("/telegram-webhook", telegramWebhook);
router.post("/send-otp", sendOTP);

export default router;
