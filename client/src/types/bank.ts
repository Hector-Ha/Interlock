export interface Bank {
  id: string;
  userId: string;
  itemId: string;
  institutionId: string;
  institutionName: string;
  status: "ACTIVE" | "LOGIN_REQUIRED" | "INACTIVE";
  dwollaFundingUrl: string | null;
  isDwollaLinked: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  accounts?: Account[];
}

export interface Account {
  id: string;
  name: string;
  officialName: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
  balance: {
    available: number | null;
    current: number | null;
    limit: number | null;
    currency: string | null;
  };
}

export interface Transaction {
  id: string;
  amount: number;
  name: string;
  merchantName: string | null;
  date: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "DECLINED"
    | "RETURNED"
    | "CANCELLED";
  category: string[];
  channel: string;
  pending: boolean;
}
