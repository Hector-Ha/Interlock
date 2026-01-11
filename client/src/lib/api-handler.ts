import { AxiosError } from "axios";
import { toast } from "@/stores/toast.store";

// Matches client/src/services/api-client.ts ApiError interface
interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

// Keep this for cases where we might still catch raw Axios errors (e.g. outside api-client)
interface AxiosErrorResponse {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

interface ApiSuccessResponse {
  message?: string;
  [key: string]: unknown;
}

const errorMessages: Record<string, string> = {
  // Auth errors
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  EMAIL_EXISTS: "An account with this email already exists.",
  ACCOUNT_LOCKED: "Your account is temporarily locked. Please try again later.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  INVALID_TOKEN: "Invalid or expired token. Please sign in again.",

  // Bank errors
  BANK_NOT_FOUND: "Bank account not found.",
  BANK_CONNECTION_FAILED: "Failed to connect to your bank. Please try again.",
  PLAID_ERROR: "There was an issue connecting to your bank. Please try again.",

  // Transfer errors
  INSUFFICIENT_FUNDS: "Insufficient funds for this transfer.",
  TRANSFER_LIMIT_EXCEEDED: "Transfer amount exceeds your daily limit.",
  TRANSFER_NOT_FOUND: "Transfer not found.",
  TRANSFER_NOT_PENDING: "This transfer cannot be cancelled.",

  // P2P errors
  RECIPIENT_NOT_FOUND: "Recipient not found.",
  RECIPIENT_NO_BANK: "Recipient has no linked bank account.",
  SELF_TRANSFER_NOT_ALLOWED: "You cannot send money to yourself.",
  P2P_LIMIT_EXCEEDED: "P2P transfer limit exceeded.",

  // Validation errors
  VALIDATION_ERROR: "Please check your input and try again.",

  // Generic errors
  INTERNAL_ERROR: "Something went wrong. Please try again later.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
};

export function getErrorMessage(error: unknown): string {
  // Check for our custom ApiError structure (from api-client reject)
  if (isApiError(error)) {
    if (error.code && errorMessages[error.code]) {
      return errorMessages[error.code];
    }
    return error.message || errorMessages.INTERNAL_ERROR;
  }

  // Fallback for raw AxiosErrors (should be rare if using api-client)
  if (error instanceof AxiosError) {
    const data = error.response?.data as AxiosErrorResponse | undefined;

    if (data?.code && errorMessages[data.code]) {
      return errorMessages[data.code];
    }

    if (data?.message) {
      return data.message;
    }

    if (error.code === "ERR_NETWORK") return errorMessages.NETWORK_ERROR;
    if (error.code === "ECONNABORTED") return errorMessages.TIMEOUT_ERROR;

    // Status code fallbacks
    switch (error.response?.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Please sign in to continue.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please wait a moment.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return errorMessages.INTERNAL_ERROR;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return errorMessages.INTERNAL_ERROR;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error &&
    !("response" in error) // Distinguish from AxiosError
  );
}

export function handleApiError(error: unknown, showToast = true): string {
  const message = getErrorMessage(error);

  if (showToast) {
    toast.error("Error", message);
  }

  console.error("API Error:", error);
  return message;
}

export function handleApiSuccess(data: unknown, showToast = false): void {
  // Try to find a message in the response data
  if (showToast && typeof data === "object" && data !== null) {
    const msg = (data as ApiSuccessResponse).message;
    if (msg) {
      toast.success("Success", msg);
    }
  }
}

/**
 * Wrapper for API calls to handle success and error states automatically.
 * Supports promises that resolve to the data directly (unwrapped).
 * @param promise The API call promise (returns T, not AxiosResponse<T>)
 * @param options Configuration options
 * @returns The response data or throws an error
 */
export async function apiCall<T>(
  promise: Promise<T>,
  options: {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
  } = {}
): Promise<T> {
  try {
    const data = await promise;
    const { showSuccessToast = false, successMessage } = options;

    if (successMessage) {
      toast.success("Success", successMessage);
    } else {
      handleApiSuccess(data, showSuccessToast);
    }

    return data;
  } catch (error) {
    const { showErrorToast = true } = options;
    handleApiError(error, showErrorToast);
    throw error;
  }
}

// Type guard for validation errors (supports both raw AxiosError and our ApiError)
export function isValidationError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.code === "VALIDATION_ERROR";
  }
  if (error instanceof AxiosError) {
    return error.response?.data?.code === "VALIDATION_ERROR";
  }
  return false;
}

// Extract field errors
export function getFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  let errors: Record<string, string[]> | undefined;

  if (isApiError(error)) {
    if (error.code !== "VALIDATION_ERROR") return {};
    errors = error.errors;
  } else if (
    error instanceof AxiosError &&
    error.response?.data?.code === "VALIDATION_ERROR"
  ) {
    errors = error.response.data.errors;
  }

  if (errors) {
    for (const [field, messages] of Object.entries(errors)) {
      fieldErrors[field] = messages[0] || "Invalid value";
    }
  }

  return fieldErrors;
}
