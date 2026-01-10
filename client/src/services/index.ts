export { apiClient, api, type ApiError } from "./api-client";

export { authService } from "./auth.service";
export { bankService } from "./bank.service";
export { plaidService } from "./plaid.service";
export { transferService } from "./transfer.service";
export { p2pService } from "./p2p.service";
export { notificationService } from "./notification.service";

export type {
  AuthResponse,
  UpdateProfileData,
  ChangePasswordData,
} from "./auth.service";

export type {
  AccountsResponse,
  TransactionsResponse,
  TransactionFilters,
  SyncResult,
  LinkDwollaData,
} from "./bank.service";

export type {
  LinkTokenResponse,
  ExchangeTokenData,
  ExchangeTokenResponse,
} from "./plaid.service";

export type {
  NotificationListResponse,
  UnreadCountResponse,
  GetNotificationsOptions,
} from "./notification.service";
