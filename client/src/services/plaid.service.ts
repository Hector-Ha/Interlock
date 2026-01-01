import apiClient from "./api-client";
import { User } from "@/types/index";

export const plaidService = {
  // Create a link token to initialize Plaid Link
  async createLinkToken(user: User) {
    const response = await apiClient.post<{ linkToken: string }>(
      "/plaid/create-link-token",
      { user }
    );
    return response.data;
  },

  // Exchange public token for access token
  async exchangePublicToken(publicToken: string) {
    const response = await apiClient.post<{
      accessToken: string;
      itemId: string;
    }>("/plaid/exchange-public-token", { publicToken });
    return response.data;
  },
};
