import { CountryCode, Products } from "plaid";

export interface CreateLinkTokenRequest {
  user: {
    userId: number; // or string based on auth middleware
  };
}

export interface ExchangeTokenRequest {
  publicToken: string;
  institutionId?: string;
  institutionName?: string;
  user: {
    userId: number;
  };
}
