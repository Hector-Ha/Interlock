export * from "./auth";
export * from "./bank";
export * from "./transfer";
export interface HeaderBoxProps {
  type: "greeting" | "title";
  title: string;
  subtext?: string;
  user?: string;
}

export interface TotalBalanceBoxProps {
  account: [];
  totalBanks: number;
  totalCurrentBalance: number;
}

export interface DoughnutChartProps {
  account: [];
}

export interface SidebarProps {
  user: User;
}

export interface User {
  id: string;
  email: string;
  userID: string;
  dwollaCustomerID: string;
  dwollaCustomerURL: string;

  phoneNumber: string;

  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
}

export interface MobileNavProps {
  user: User;
}

export interface RightSideBarProps {
  user: User;
  transactions: [];
  banks: [];
}
