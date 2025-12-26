import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { config } from "../config";

const configuration = new Configuration({
  basePath:
    PlaidEnvironments[config.plaidEnv as keyof typeof PlaidEnvironments] ||
    PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": config.plaidClientId,
      "PLAID-SECRET": config.plaidSecret,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
