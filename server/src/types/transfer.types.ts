export interface TransferDetails {
  id: string;
  amount: number;
  status: string;
  sourceBank: {
    id: string;
    institutionName: string;
  };
  destinationBank: {
    id: string;
    institutionName: string;
  };
  dwollaTransferId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransferListItem {
  id: string;
  amount: number;
  status: string;
  sourceBankName: string;
  destinationBankName: string;
  createdAt: Date;
}
