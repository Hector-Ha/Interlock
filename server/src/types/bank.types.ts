import type { TxStatus } from "@prisma/client";
import type { Account } from "./account.types";

export interface TransactionSummary {
  id: string;
  amount: number;
  name: string;
  date: Date;
  status: TxStatus;
}

export interface BankDetails {
  id: string;
  institutionId: string;
  institutionName: string;
  status: string;
  dwollaFundingUrl: string | null;
  isDwollaLinked: boolean;
  createdAt: Date;
  updatedAt: Date;
  transactions: TransactionSummary[];
  accounts: Account[];
}

export interface BankListItem {
  id: string;
  institutionId: string;
  institutionName: string;
  status: string;
  dwollaFundingUrl: string | null;
  createdAt: Date;
}
