import apiClient from "./api-client";
import {
  Transfer,
  TransferDetails,
  TransfersResponse,
  TransferFilters,
  InitiateTransferData,
} from "@/types/transfer";

export const transferService = {
  // Get user's transfer history
  async getTransfers(filters?: TransferFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get<TransfersResponse>(
      `/transfers${params.toString() ? `?${params}` : ""}`
    );
    return response.data;
  },

  // Get a single transfer by ID
  async getTransfer(transferId: string) {
    const response = await apiClient.get<{ transfer: TransferDetails }>(
      `/transfers/${transferId}`
    );
    return response.data;
  },

  // Initiate a new transfer
  async initiateTransfer(data: InitiateTransferData) {
    const response = await apiClient.post<{ transfer: Transfer }>(
      "/bank/transfer",
      data
    );
    return response.data;
  },

  // Cancel a pending transfer
  async cancelTransfer(transferId: string) {
    const response = await apiClient.post<{ message: string }>(
      `/transfers/${transferId}/cancel`
    );
    return response.data;
  },
};
