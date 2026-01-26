"use client";

import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { User, AlertCircle, Loader2 } from "lucide-react";
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
    <div className={cn("space-y-3", className)}>
      <Input
        placeholder="Search by email or phone…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
        startIcon={<User className="h-4 w-4" />}
        endIcon={
          isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-main" />
          ) : undefined
        }
        className="bg-background border-border focus:border-brand-main focus:ring-brand-main/20"
        autoComplete="off"
        spellCheck={false}
        aria-label="Search for recipient by email or phone"
      />

      {error && (
        <div className="text-sm text-error-main flex items-center gap-1.5 p-2 bg-error-surface rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <ul className="border border-border rounded-xl divide-y divide-border bg-card shadow-lg overflow-hidden">
          {results.map((recipient) => (
            <li key={recipient.id}>
              <button
                type="button"
                onClick={() => handleSelect(recipient)}
                disabled={!recipient.hasLinkedBank}
                className={cn(
                  "w-full text-left p-4 flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-main",
                  recipient.hasLinkedBank
                    ? "cursor-pointer hover:bg-muted/50"
                    : "opacity-50 cursor-not-allowed",
                )}
                aria-label={`Select ${recipient.firstName} ${recipient.lastName}${!recipient.hasLinkedBank ? " (no linked bank)" : ""}`}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-main to-brand-hover flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {recipient.firstName} {recipient.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {recipient.email}
                  </p>
                </div>
                {!recipient.hasLinkedBank && (
                  <div className="flex items-center gap-1.5 text-warning-main text-sm flex-shrink-0 bg-warning-surface px-2 py-1 rounded-full">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="font-medium">No linked bank</span>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 3 && !isSearching && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center py-6 bg-muted/30 rounded-lg">
          No users found matching &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
