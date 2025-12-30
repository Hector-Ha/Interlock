export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SyncResult {
  added: number;
  modified: number;
  removed: number;
  hasMore: boolean;
}

export interface TransactionListItem {
  id: string;
  amount: number;
  name: string;
  merchantName: string | null;
  date: Date;
  status: string;
  category: string | null;
  channel: string;
  pending: boolean;
}
