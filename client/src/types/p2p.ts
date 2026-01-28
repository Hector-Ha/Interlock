export interface Recipient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hasLinkedBank: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  dismissedAt: string | null;
  relatedTransactionId: string | null;
  actionUrl: string | null;
  createdAt: string;
}

export type NotificationType =
  | "P2P_RECEIVED"
  | "P2P_SENT"
  | "TRANSFER_COMPLETED"
  | "TRANSFER_FAILED"
  | "BANK_DISCONNECTED"
  | "SECURITY_ALERT";

export interface NotificationPreference {
  type: NotificationType;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

export interface P2PTransferRequest {
  recipientId: string;
  senderBankId: string;
  amount: number;
  note?: string;
}

export interface P2PTransferResponse {
  message: string;
  transactionId: string;
}

export interface RecipientSearchResponse {
  recipients: Recipient[];
}
