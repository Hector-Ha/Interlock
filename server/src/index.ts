import "./instrument";
import app from "./app";
import { config, validateEnv } from "./config";
import { logger } from "@/middleware/logger";

validateEnv();

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
