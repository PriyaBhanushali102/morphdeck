import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("FATAL: MONGO_URI environment variable is not set.");
}
if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is not set.");
}

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  CORS: {
    origin: process.env.CORS_ORIGIN,
  },
};

export const JWT_SECRET = process.env.JWT_SECRET || "mysecret";
export const JWT_EXPIRATION = process.env.TOKEN_EXPIRE || "1h";
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
