import User from "../models/User.js";
import { sendMessage } from "../utils/sendMessage.js";

// Telegram Webhook Handler
export const telegramWebhook = async (req, res) => {
  console.log("Received Webhook:", req.body);

  const message = req.body.message;
  if (!message) return res.sendStatus(200); // Ignore empty requests

  const chatId = message.chat.id;
  const text = message.text;
  const contact = message.contact; // If user shares contact

  if (text === "/start") {
    await sendMessage(
      chatId,
      "👋 Welcome! Please send your 10-digit phone number to register for OTP services.",
      {
        keyboard: [
          [{ text: "📞 Send My Phone Number", request_contact: true }],
          [{ text: "❌ Close" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    );
  } else if (contact) {
    const phoneNumber = contact.phone_number.slice(2);
    if (phoneNumber.length === 10) {
      let user = User.findOneAndUpdate(
        { phone: phoneNumber },
        { chatId },
        { upsert: true }
      );
      if (!user) {
        console.log("User not found, creating new user...");
        user = await User.create({ phone: phoneNumber, chatId });
      }
      console.log("User found or created:", user);
      await sendMessage(
        chatId,
        `✅ Registered! Your phone (${phoneNumber}) is linked for OTP.`
      );
    } else {
      await sendMessage(
        chatId,
        "⚠️ Invalid phone number format. Please enter 10 digits manually."
      );
    }
  } else if (/^\d{10}$/.test(text)) {
    let user = await User.findOneAndUpdate(
      { phone: text },
      { chatId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!user) {
      user = await User.create({ phone: text, chatId });
    }

    await sendMessage(
      chatId,
      `✅ Registered! Your phone (${text}) is linked for OTP.`
    );
  } else if (text === "❌ Close") {
    await sendMessage(chatId, "", {
      remove_keyboard: true,
    });
  } else {
    await sendMessage(
      chatId,
      "Please send your mobile number to register either manually or by clicking the button below if you haven't done so yet.",
      {
        keyboard: [
          [{ text: "📞 Send My Phone Number", request_contact: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    );
  }

  res.sendStatus(200);
};

// ✅ Send OTP API
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user || !user.chatId)
      return res.status(400).json({ message: "Phone not registered!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendMessage(user.chatId, `🔢 Your OTP is : ${otp}`);

    res.json({ message: "OTP sent via Telegram!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
