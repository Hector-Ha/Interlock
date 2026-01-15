import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("8080"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  ENCRYPTION_KEY: z
    .string()
    .length(32, "ENCRYPTION_KEY must be exactly 32 characters"),

  // Plaid
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SECRET: z.string().optional(),
  PLAID_ENV: z.string().default("sandbox"),
  PLAID_PRODUCTS: z.string().default("auth,transactions,identity"),
  PLAID_COUNTRY_CODES: z.string().default("US"),

  // Dwolla
  DWOLLA_KEY: z.string().optional(),
  DWOLLA_SECRET: z.string().optional(),
  DWOLLA_BASE_URL: z.string().default("https://api-sandbox.dwolla.com"),
  DWOLLA_ENV: z.string().default("sandbox"),
  DWOLLA_WEBHOOK_SECRET: z.string().optional(),

  // SendGrid
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_SENDER_EMAIL: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().optional(),
  ENABLE_LOGS: z.string().optional(),
});

// Validate environment variables
const env = envSchema.parse(process.env);

export const config = {
  port: parseInt(env.PORT, 10),
  env: env.NODE_ENV,
  clientUrl: env.CLIENT_URL,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  encryptionKey: env.ENCRYPTION_KEY,
  plaid: {
    clientId: env.PLAID_CLIENT_ID,
    secret: env.PLAID_SECRET,
    env: env.PLAID_ENV,
    products: env.PLAID_PRODUCTS.split(","),
    countryCodes: env.PLAID_COUNTRY_CODES.split(","),
  },
  dwolla: {
    key: env.DWOLLA_KEY,
    secret: env.DWOLLA_SECRET,
    baseUrl: env.DWOLLA_BASE_URL,
    env: env.DWOLLA_ENV,
    webhookSecret: env.DWOLLA_WEBHOOK_SECRET,
  },
  email: {
    sendgridApiKey: env.SENDGRID_API_KEY,
    senderEmail: env.SENDGRID_SENDER_EMAIL,
  },
  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    enableLogs: env.ENABLE_LOGS === "true",
  },
};

export function validateEnv(): void {
  console.log("✅ Environment variables validated.");
}

/**
 * Validates production-specific security requirements.
 * Throws an error if any critical security check fails.
 * Should be called at server startup in production environments.
 */
export function validateProductionEnv(): void {
  if (config.env !== "production") return;

  const checks = [
    {
      key: "JWT_SECRET",
      test: config.jwtSecret.length >= 32 && config.jwtSecret !== "supersecret",
      message:
        "JWT_SECRET must be at least 32 characters and not a default value",
    },
    {
      key: "ENCRYPTION_KEY",
      test: config.encryptionKey.length === 32,
      message: "ENCRYPTION_KEY must be exactly 32 characters",
    },
    {
      key: "DATABASE_URL",
      test: !config.databaseUrl.includes("localhost"),
      message: "DATABASE_URL should not point to localhost in production",
    },
  ];

  const failures = checks.filter((c) => !c.test);
  if (failures.length > 0) {
    throw new Error(
      `Production environment validation failed:\n${failures
        .map((f) => `  - ${f.key}: ${f.message}`)
        .join("\n")}`,
    );
  }

  console.log("✅ Production environment validated.");
}
