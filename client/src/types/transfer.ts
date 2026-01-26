export interface Transfer {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "RETURNED";
  sourceBankName: string;
  destinationBankName: string;
  createdAt: string;
}

export interface TransferDetails extends Transfer {
  sourceBank: {
    id: string;
    institutionName: string;
  };
  destinationBank: {
    id: string;
    institutionName: string;
  };
  dwollaTransferId: string | null;
  updatedAt: string;
}

export interface TransfersResponse {
  transfers: Transfer[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface TransferFilters {
  limit?: number;
  offset?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
}

export interface InitiateTransferData {
  sourceBankId: string;
  destinationBankId: string;
  amount: number;
}
