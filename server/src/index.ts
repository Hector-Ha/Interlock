import "./instrument";
import app from "./app";
import { config, validateEnv } from "./config";

validateEnv();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
