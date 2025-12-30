import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
  ProcessorTokenCreateRequestProcessorEnum,
} from "plaid";
import { config } from "@/config";
import { prisma } from "@/db";
import { encrypt } from "@/utils/encryption";
import { logger } from "@/middleware/logger";
import type { Account } from "@/types/account.types";
import type { PlaidError } from "plaid";

function isPlaidError(
  error: unknown
): error is { response: { data: PlaidError } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response !== null &&
    "data" in (error as { response: object }).response &&
    typeof (error as { response: { data?: unknown } }).response.data ===
      "object" &&
    (error as { response: { data?: unknown } }).response.data !== null &&
    "error_code" in (error as { response: { data: object } }).response.data
  );
}

const configuration = new Configuration({
  basePath:
    PlaidEnvironments[config.plaid.env as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": config.plaid.clientId!,
      "PLAID-SECRET": config.plaid.secret!,
      "Plaid-Version": "2020-09-14",
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

export const createLinkToken = async (userId: string) => {
  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "Interlock",
    products: config.plaid.products as Products[],
    country_codes: config.plaid.countryCodes as CountryCode[],
    language: "en",
  });

  return response.data.link_token;
};

interface PlaidLinkMetadata {
  institution: {
    institution_id: string;
    name: string;
  };
  accounts: Array<{
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }>;
}

export const exchangePublicToken = async (
  userId: string,
  publicToken: string,
  metadata: PlaidLinkMetadata
) => {
  const tokenResponse = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  const accessToken = tokenResponse.data.access_token;
  const itemId = tokenResponse.data.item_id;

  const encryptedAccessToken = encrypt(accessToken);

  const bank = await prisma.bank.create({
    data: {
      userId,
      plaidItemId: itemId,
      plaidAccessToken: encryptedAccessToken,
      institutionId: metadata.institution.institution_id,
      institutionName: metadata.institution.name,
    },
  });

  return {
    id: bank.id,
    institutionId: bank.institutionId,
    institutionName: bank.institutionName,
    status: bank.status,
  };
};

export const getAccounts = async (accessToken: string) => {
  const response = await plaidClient.accountsGet({
    access_token: accessToken,
  });

  return response.data.accounts;
};

export const createProcessorToken = async (
  accessToken: string,
  accountId: string
): Promise<string> => {
  const response = await plaidClient.processorTokenCreate({
    access_token: accessToken,
    account_id: accountId,
    processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla,
  });

  return response.data.processor_token;
};

// Retrieves accounts with real-time balance information from Plaid.

export const getAccountsWithBalances = async (
  accessToken: string
): Promise<Account[]> => {
  try {
    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });

    return response.data.accounts.map((account) => ({
      id: account.account_id,
      name: account.name,
      officialName: account.official_name || null,
      type: account.type,
      subtype: account.subtype?.toString() || null,
      mask: account.mask || null,
      balance: {
        available: account.balances.available || null,
        current: account.balances.current || null,
        limit: account.balances.limit || null,
        currency: account.balances.iso_currency_code || null,
      },
    }));
  } catch (error) {
    if (isPlaidError(error)) {
      const plaidError = error.response.data;
      logger.error(
        {
          plaidError: plaidError.error_code,
          message: plaidError.error_message,
        },
        "Plaid API error while fetching account balances"
      );
    }
    throw error;
  }
};
