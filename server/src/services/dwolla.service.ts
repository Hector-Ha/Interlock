import { Client } from "dwolla-v2";
import { config } from "../config";

export const dwollaClient = new Client({
  key: config.dwollaKey,
  secret: config.dwollaSecret,
  environment: "sanbox",
});
