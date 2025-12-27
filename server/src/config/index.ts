import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  encryptionKey:
    process.env.ENCRYPTION_KEY || "32_byte_encryption_key_here!!!!",
  plaid: {
    clientId: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: process.env.PLAID_ENV || "sandbox",
    products: (
      process.env.PLAID_PRODUCTS || "auth,transactions,identity"
    ).split(","),
    countryCodes: (process.env.PLAID_COUNTRY_CODES || "US").split(","),
  },
  dwolla: {
    key: process.env.DWOLLA_KEY,
    secret: process.env.DWOLLA_SECRET,
    env: process.env.DWOLLA_ENV || "sandbox",
    webhookSecret: process.env.DWOLLA_WEBHOOK_SECRET,
  },
};
