"use client";

import { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink as usePlaidLinkBase,
  PlaidLinkOptions,
} from "react-plaid-link";
import { plaidService } from "@/services/plaid.service";
import { useBankStore } from "@/stores/bank.store";
import { useToast } from "@/stores/ui.store";

interface UsePlaidLinkOptions {
  onSuccess?: () => void;
  onExit?: () => void;
}

export function usePlaidLink(options?: UsePlaidLinkOptions) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchBanks } = useBankStore();
  const toast = useToast();

  // Fetch link token on mount
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const { link_token } = await plaidService.createLinkToken();
        setLinkToken(link_token);
      } catch (err: any) {
        setError(err.message || "Failed to initialize bank connection");
      }
    };
    fetchLinkToken();
  }, []);

  // Handle successful connection
  const handleSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      setIsLoading(true);
      setError(null);

      try {
        await plaidService.exchangeToken({
          publicToken,
          metadata: {
            institution: metadata.institution,
            accounts: metadata.accounts,
          },
        });

        // Refresh banks list
        await fetchBanks();

        toast.success("Bank connected successfully!");
        options?.onSuccess?.();
      } catch (err: any) {
        setError(err.message || "Failed to connect bank");
        toast.error("Failed to connect bank. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBanks, options, toast]
  );

  const handleExit = useCallback(
    (err: any) => {
      if (err) {
        setError(err.display_message || "Connection cancelled");
      }
      options?.onExit?.();
    },
    [options]
  );

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: handleExit,
  };

  const { open, ready } = usePlaidLinkBase(config);

  return {
    open,
    ready: ready && !!linkToken,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
