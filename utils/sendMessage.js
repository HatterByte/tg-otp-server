import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export const sendMessage = async (chatId, text, replyMarkup = null) => {
    const payload = { chat_id: chatId };
    if(text)payload.text = text ;
    if (replyMarkup) payload.reply_markup = replyMarkup;

    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }); 
};
