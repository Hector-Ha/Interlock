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
