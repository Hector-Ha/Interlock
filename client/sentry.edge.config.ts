import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0d35c7ca113d8693daafd5de31c48520@o4510608188243968.ingest.de.sentry.io/4510608189620304",
  tracesSampleRate: 1.0,
});
