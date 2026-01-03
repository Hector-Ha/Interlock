import { api } from "./api-client";
import type {
  Transfer,
  TransferDetails,
  TransfersResponse,
  TransferFilters,
  InitiateTransferData,
} from "@/types/transfer";

export const transferService = {
  getTransfers: async (
    filters?: TransferFilters
  ): Promise<TransfersResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    return api.get<TransfersResponse>(
      `/transfers${params.toString() ? `?${params}` : ""}`
    );
  },

  getTransfer: async (
    transferId: string
  ): Promise<{ transfer: TransferDetails }> => {
    return api.get<{ transfer: TransferDetails }>(`/transfers/${transferId}`);
  },

  initiateTransfer: async (
    data: InitiateTransferData
  ): Promise<{ transfer: Transfer }> => {
    return api.post<{ transfer: Transfer }>("/bank/transfer", data);
  },

  cancelTransfer: async (transferId: string): Promise<{ message: string }> => {
    return api.post(`/transfers/${transferId}/cancel`);
  },
};
