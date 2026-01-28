"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Building2, CreditCard, Loader2, ArrowRight } from "lucide-react";
import { useBankStore } from "@/stores/bank.store";
import { bankService } from "@/services/bank.service";
import { Input } from "@/components/ui/Input";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types/bank";

interface SearchResult {
  id: string;
  type: "bank" | "transaction";
  title: string;
  subtitle: string;
  metadata?: string;
  bankId?: string;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

export function GlobalSearch({ className, placeholder = "Search transactions, banks...", isMobile = false }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { banks } = useBankStore();

  const searchBanks = useCallback((searchQuery: string): SearchResult[] => {
    const q = searchQuery.toLowerCase();
    return banks
      .filter(bank => 
        bank.institutionName.toLowerCase().includes(q) ||
        bank.institutionId.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map(bank => ({
        id: bank.id,
        type: "bank" as const,
        title: bank.institutionName,
        subtitle: `${bank.accounts?.length || 0} account(s) connected`,
        metadata: bank.status === "ACTIVE" ? "Active" : bank.status,
      }));
  }, [banks]);

  const searchTransactions = useCallback(async (searchQuery: string): Promise<SearchResult[]> => {
    if (banks.length === 0) return [];
    
    const q = searchQuery.toLowerCase();
    const allResults: SearchResult[] = [];
    
    const bankResults = await Promise.all(
      banks.slice(0, 3).map(async (bank) => {
        try {
          const response = await bankService.getTransactions(bank.id, { limit: 20 });
          return response.transactions
            .filter((tx: Transaction) => 
              tx.name.toLowerCase().includes(q) ||
              tx.merchantName?.toLowerCase().includes(q) ||
              (Array.isArray(tx.category) && tx.category.some(c => c.toLowerCase().includes(q)))
            )
            .slice(0, 3)
            .map((tx: Transaction) => ({
              id: tx.id,
              type: "transaction" as const,
              title: tx.name,
              subtitle: formatCurrency(Math.abs(tx.amount)),
              metadata: formatDate(tx.date),
              bankId: bank.id,
            }));
        } catch {
          return [];
        }
      })
    );
    
    bankResults.forEach(txResults => allResults.push(...txResults));
    return allResults.slice(0, 5);
  }, [banks]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const bankResults = searchBanks(searchQuery);
      const transactionResults = await searchTransactions(searchQuery);
      
      setResults([...bankResults, ...transactionResults]);
    } finally {
      setIsSearching(false);
    }
  }, [searchBanks, searchTransactions]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInputFocused = () => {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (query.length >= 2) {
          router.push(`/transactions?search=${encodeURIComponent(query)}`);
          setIsOpen(false);
          setQuery("");
        }
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    
    if (result.type === "bank") {
      router.push(`/banks?selected=${result.id}`);
    } else if (result.type === "transaction") {
      router.push(`/transactions?search=${encodeURIComponent(result.title)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
    if (e.target.value) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          startIcon={<Search className="w-4 h-4" aria-hidden="true" />}
          endIcon={
            query ? (
              isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <button
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground pointer-events-auto"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )
            ) : !isMobile ? (
              <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-medium">
                /
              </kbd>
            ) : undefined
          }
          className={cn("h-9 text-sm", isMobile && "h-10")}
          containerClassName="w-full"
          aria-label="Search"
          aria-expanded={isOpen}
          role="combobox"
          aria-autocomplete="list"
        />
      </div>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl shadow-[var(--color-gray-main)]/10 border border-[var(--color-gray-soft)] z-50 overflow-hidden">
          {isSearching && results.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-brand-main)]" />
              <span className="ml-2 text-sm text-[var(--color-gray-main)]">Searching...</span>
            </div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="py-8 px-4 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-[var(--color-gray-disabled)]" />
              <p className="text-sm text-[var(--color-gray-main)]">No results found for &quot;{query}&quot;</p>
              <button
                onClick={() => {
                  router.push(`/transactions?search=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                  setQuery("");
                }}
                className="mt-3 text-sm text-[var(--color-brand-main)] hover:underline"
              >
                Search in transactions page
              </button>
            </div>
          ) : (
            <ul className="py-2 max-h-[400px] overflow-y-auto" role="listbox">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.id}`} role="option" aria-selected={index === selectedIndex}>
                  <button
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      index === selectedIndex
                        ? "bg-[var(--color-brand-surface)]"
                        : "hover:bg-[var(--color-gray-surface)]"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl",
                      result.type === "bank"
                        ? "bg-[var(--color-brand-surface)] text-[var(--color-brand-main)]"
                        : "bg-[var(--color-gray-surface)] text-[var(--color-gray-main)]"
                    )}>
                      {result.type === "bank" ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-gray-text)] truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-[var(--color-gray-main)] truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    {result.metadata && (
                      <span className="text-xs text-[var(--color-gray-disabled)]">
                        {result.metadata}
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-[var(--color-gray-disabled)] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
              
              {query.length >= 2 && (
                <li className="border-t border-[var(--color-gray-soft)] mt-2 pt-2 px-4 pb-2">
                  <button
                    onClick={() => {
                      router.push(`/transactions?search=${encodeURIComponent(query)}`);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-2 w-full py-2 text-sm text-[var(--color-brand-main)] hover:underline"
                  >
                    <Search className="h-4 w-4" />
                    Search all for &quot;{query}&quot;
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
