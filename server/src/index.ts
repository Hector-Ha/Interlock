import "./instrument";
import app from "./app";
import { config } from "./config";
import { logger } from "@/middleware/logger";

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
