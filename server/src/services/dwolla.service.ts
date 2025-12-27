import { Client } from "dwolla-v2";
import { config } from "../config";

export const dwollaClient = new Client({
  key: config.dwolla.key!,
  secret: config.dwolla.secret!,
  environment: config.dwolla.env as "sandbox" | "production",
});
