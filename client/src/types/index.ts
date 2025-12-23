interface HeaderBoxProps {
  type: "greeting" | "title";
  title: string;
  subtext?: string;
  user?: string;
}

interface TotalBalanceBoxProps {
  account: [];
  totalBanks: number;
  totalCurrentBalance: number;
}

interface DoughnutChartProps {
  account: [];
}

interface SidebarProps {
  user: User;
}

interface User {
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
