# Telegram OTP Microservice

This microservice enables OTP (One-Time Password) delivery via a Telegram bot using webhooks. It maps a user's phone number to their Telegram `chat_id` and sends OTPs via Telegram.

---

## Features

- OTP delivery through Telegram bot
- Webhook-based message handling
- Maps user phone numbers to their Telegram `chat_id`
- Stores mappings securely in a database
- Easily integratable with any authentication system
---
## How It Works

1. **User starts the Telegram bot** and sends their phone number.
2. The bot receives this message via a **Telegram webhook**.
3. The server extracts the phone number and `chat_id`, and stores them in the database.
4. When your main application wants to send an OTP:
   - It makes a request to this microservice.
   - The service looks up the user's `chat_id` and sends the OTP using Telegram.
---
## Tech Stack

- **Backend**: Express.js (Node.js)
- **Bot Framework**: `node-telegram-bot-api` in webhook mode
- **Database**: MongoDB 
- **Webhook Handling**: Express route
- **Environment Management**: `dotenv`

---
## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/HatterByte/tg-otp-server
cd tg-otp-service
```

2. **Install dependencies**
```
npm install
```
3. **Create a .env file with the following:**
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MONGODB_URI=your_mongo_connection_uri
WEBHOOK_URL=https://yourdomain.com/telegram-webhook
PORT=3000
```
4. **Run the server**
```
node server.js
```

5. **Set Telegram webhook (optional manual setup):**

- Run tgWebhook.js from the config folder.
---
## API Endpoint
**POST /send-otp**
Sends an OTP to the Telegram user linked with the provided phone number.
---
**Request Body:**
```
{
  "phone": "1234567890",
}
```
Response:
```
{ 
    message: "OTP sent via Telegram!" 
}
```
---
## Example DB Document
```
{
  "phone": "1234567890",
  "chatId": 123456789
}
```
---

## Security Note
Ensure users send their correct phone numbers to the bot to establish the mapping.

Consider OTP rate limiting and expiration in production.

---

*Built with ❤️ for [SIH 2024 Railmadad Project](https://github.com/RedHillSIH/RailMadad).*
