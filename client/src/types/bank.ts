export interface Bank {
  id: string;
  name: string;
  mask: string;
  institutionId: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  shareableId: string;
  userId: string;
}

export interface Account {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  paymentChannel: string;
  category: string;
  type: string;
  image?: string;
}
