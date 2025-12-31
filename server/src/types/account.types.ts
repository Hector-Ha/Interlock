export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string | null;
}

export interface Account {
  id: string;
  name: string;
  officialName: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
  balance: AccountBalance;
}

export interface AccountsResponse {
  accounts: Account[];
  institutionName: string;
  lastUpdated: Date;
}
