import { api } from "./api-client";
import type {
  Recipient,
  P2PTransferRequest,
  P2PTransferResponse,
  RecipientSearchResponse,
} from "@/types/p2p";

export const p2pService = {
  searchRecipients: async (query: string): Promise<RecipientSearchResponse> => {
    return api.get<RecipientSearchResponse>(
      `/transfers/p2p/recipients/search`,
      {
        params: { q: query },
      }
    );
  },

  createTransfer: async (
    data: P2PTransferRequest
  ): Promise<P2PTransferResponse> => {
    return api.post<P2PTransferResponse>("/transfers/p2p", data);
  },
};
