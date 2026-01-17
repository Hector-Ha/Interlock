"use client";

import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Search, User, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui";
import { p2pService } from "@/services/p2p.service";
import type { Recipient } from "@/types/p2p";
import { cn } from "@/lib/utils";

interface RecipientSearchProps {
  onSelect: (recipient: Recipient) => void;
  className?: string;
}

// Search for P2P transfer recipients with debounced input.
export function RecipientSearch({ onSelect, className }: RecipientSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recipient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const { recipients } = await p2pService.searchRecipients(searchQuery);
      setResults(recipients);
    } catch (err) {
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleSelect = useCallback(
    (recipient: Recipient) => {
      if (recipient.hasLinkedBank) {
        onSelect(recipient);
        setQuery("");
        setResults([]);
      }
    },
    [onSelect],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
        <Input
          placeholder="Search by email or phone…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          className="pl-10"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search for recipient by email or phone"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-content-tertiary" />
        )}
      </div>

      {error && (
        <div className="text-sm text-error-text flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <ul className="border border-border rounded-lg divide-y divide-border bg-card shadow-sm">
          {results.map((recipient) => (
            <li key={recipient.id}>
              <button
                type="button"
                onClick={() => handleSelect(recipient)}
                disabled={!recipient.hasLinkedBank}
                className={cn(
                  "w-full text-left p-3 flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  recipient.hasLinkedBank
                    ? "cursor-pointer hover:bg-surface-alt"
                    : "opacity-50 cursor-not-allowed",
                )}
                aria-label={`Select ${recipient.firstName} ${recipient.lastName}${!recipient.hasLinkedBank ? " (no linked bank)" : ""}`}
              >
                <div className="h-10 w-10 rounded-full bg-brand-surface flex items-center justify-center flex-shrink-0">
                  <User
                    className="h-5 w-5 text-brand-text"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-content-primary truncate">
                    {recipient.firstName} {recipient.lastName}
                  </p>
                  <p className="text-sm text-content-secondary truncate">
                    {recipient.email}
                  </p>
                </div>
                {!recipient.hasLinkedBank && (
                  <div className="flex items-center gap-1 text-warning-text text-sm flex-shrink-0">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <span>No linked bank</span>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 3 && !isSearching && results.length === 0 && !error && (
        <p className="text-sm text-content-secondary text-center py-4">
          No users found matching &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
