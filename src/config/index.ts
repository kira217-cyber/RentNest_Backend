import dotenv from "dotenv";

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  admin: {
    email: process.env.ADMIN_EMAIL || "admin@rentnest.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  client: {
    successUrl:
      process.env.CLIENT_SUCCESS_URL || "http://localhost:3000/payment/success",
    cancelUrl:
      process.env.CLIENT_CANCEL_URL || "http://localhost:3000/payment/cancel",
  },
};

export default config;
