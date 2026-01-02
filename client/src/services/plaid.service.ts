import { api } from "./api-client";

export interface LinkTokenResponse {
  link_token: string;
}

export interface ExchangeTokenData {
  publicToken: string;
  metadata: {
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
  };
}

export interface ExchangeTokenResponse {
  id: string;
  institutionId: string;
  institutionName: string;
  status: string;
}

export const plaidService = {
  createLinkToken: async (): Promise<LinkTokenResponse> => {
    return api.post<LinkTokenResponse>("/plaid/link-token");
  },

  createUpdateLinkToken: async (
    bankId: string
  ): Promise<{ linkToken: string }> => {
    return api.post<{ linkToken: string }>("/plaid/update-link-token", {
      bankId,
    });
  },

  exchangeToken: async (
    data: ExchangeTokenData
  ): Promise<ExchangeTokenResponse> => {
    return api.post<ExchangeTokenResponse>("/plaid/exchange-token", data);
  },
};
