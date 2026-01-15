import * as Sentry from "@sentry/bun";
import { config } from "@/config";

// Only initialize if DSN is configured
if (config.monitoring.sentryDsn) {
  Sentry.init({
    dsn: config.monitoring.sentryDsn,
    environment: config.env,
    release: process.env.npm_package_version || "1.0.0",

    // Lower sampling rate in production to reduce costs
    tracesSampleRate: config.env === "production" ? 0.1 : 1.0,

    // Integration options
    integrations: [Sentry.prismaIntegration()],

    // Filter out non-error transactions
    beforeSend(event) {
      // Don't send events in development unless explicitly enabled
      if (config.env === "development" && !config.monitoring.enableLogs) {
        return null;
      }
      return event;
    },
  });

  console.info("✅ Sentry initialized successfully");
} else {
  console.info("ℹ️  Sentry DSN not configured - error tracking disabled");
}

export { Sentry };
