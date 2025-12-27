import * as Sentry from "@sentry/node";
// Profiling got commented out as it may cause issues with Bun
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

if (!process.env.SENTRY_DSN) {
  console.warn("SENTRY_DSN not set. Sentry will not be initialized.");
} else {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        // nodeProfilingIntegration(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });
    console.log("Sentry initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Sentry:", error);
  }
}
