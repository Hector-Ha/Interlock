export interface Bank {
  id: string;
  institutionId: string;
  institutionName: string;
  status: "ACTIVE" | "LOGIN_REQUIRED";
  dwollaFundingUrl: string | null;
  isDwollaLinked: boolean;
  createdAt: string;
  updatedAt: string;
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
  status: "PENDING" | "SUCCESS" | "FAILED" | "RETURNED";
  category: string | null;
  channel: string;
  pending: boolean;
}
