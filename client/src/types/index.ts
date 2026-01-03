export * from "./auth";
export * from "./bank";
export * from "./transfer";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dwollaCustomerId?: string;
  dwollaCustomerUrl?: string;
}

export interface HeaderBoxProps {
  type: "greeting" | "title";
  title: string;
  subtext?: string;
  user?: string;
}

export interface TotalBalanceBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

export interface DoughnutChartProps {
  accounts: Account[];
}

export interface SidebarProps {
  user?: User;
}

export interface MobileNavProps {
  user: User;
}

export interface RightSideBarProps {
  user: User;
  transactions: Transaction[];
  banks: Bank[];
}

import type { Account, Bank, Transaction } from "./bank";
