import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  plaidClientId: process.env.PLAID_CLIENT_ID || "",
  plaidSecret: process.env.PLAID_SECRET || "",
  plaidEnv: process.env.PLAID_ENV || "sandbox",
  encryptionKey:
    process.env.ENCRYPTION_KEY || "interlock_secret_key_32_bytes_long",
  dwollaKey: process.env.DWOLLA_KEY || "",
  dwollaSecret: process.env.DWOLLA_SECRET || "",
  dwollaEnv: process.env.DWOLLA_ENV || "sandbox",
};
