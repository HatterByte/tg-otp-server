//Function to set the webhook for the Telegram bot
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const setWebhook = async () => {
  const Webhook_Url = process.env.WEBHOOK_URL;
  await fetch(`${TELEGRAM_API_URL}/setWebhook?url=${Webhook_Url}`);
};
setWebhook();
