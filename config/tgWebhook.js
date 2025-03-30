//Function to set the webhook for the Telegram bot
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const setWebhook = async () => {
  const webhookUrl = process.env.webhookUrl;
  await fetch(`${TELEGRAM_API_URL}/setWebhook?url=${webhookUrl}`);
};
setWebhook();
