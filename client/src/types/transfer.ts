export interface Transfer {
  id: string;
  sourceBankId: string;
  destinationBankId: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface TransferDetails extends Transfer {
  sourceBankName: string;
  destinationBankName: string;
  transactionId?: string;
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
}

export interface InitiateTransferData {
  sourceBankId: string;
  destinationBankId: string;
  amount: number;
  memo?: string;
}
