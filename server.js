import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Store phone numbers & chat IDs
const users = {};

// ✅ Telegram Webhook Endpoint
app.post("/telegram-webhook", async (req, res) => {
  console.log("Received Webhook:", req.body);

  const message = req.body.message;
  const text = message.text;

  if (message) {
    const chatId = message.chat.id;
    const phoneNumber = message.text;

    if (/^\d{10}$/.test(phoneNumber)) {
      users[phoneNumber] = chatId;
      console.log("User stored:", users);
      await sendMessage(chatId, "✅ Registered for OTP!");
    } else if (phoneNumber === "/start") {
      await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "👋 Welcome! Please send your mobile number to register for OTP services.",
          reply_markup: {
            keyboard: [
              [{ text: "📞 Send My Phone Number", request_contact: true }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }),
      });
    } else {
      await sendMessage(
        chatId,
        "⚠️ Please send a valid 10-digit phone number."
      );
    }
  }
  res.sendStatus(200);
});

// ✅ Function to Send Messages
const sendMessage = async (chatId, text) => {
  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
};

// ✅ Send OTP API
app.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const chatId = users[phone];

    if (!chatId)
      return res.status(400).json({ message: "Phone not registered!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendMessage(chatId, `🔢 Your OTP: ${otp}`);
    res.json({ message: "OTP sent via Telegram!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ✅ Set Telegram Webhook
// const setWebhook = async () => {
//     const webhookUrl = "https://tg-otp-server.onrender.com/telegram-webhook"; // Change after deployment
//     await fetch(`${TELEGRAM_API_URL}/setWebhook?url=${webhookUrl}`);
// };
// setWebhook();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
