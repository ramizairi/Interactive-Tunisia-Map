"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Lock, MapPin, Search, Tags, X } from "lucide-react";
import { fetchAutocomplete } from "@/services/search.service";
import type { SearchSuggestion } from "@/types/search";

interface MapSearchProps {
  value: string;
  region: string;
  onChange: (value: string) => void;
  onResetView: () => void;
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
}

export function MapSearch({ value, region, onChange, onResetView, onSelectSuggestion }: MapSearchProps) {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const query = value.trim();
  const showSuggestions = isOpen && query.length >= 2;

  useEffect(() => {
    if (query.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetchAutocomplete({
        query,
        region,
        limit: 8,
        signal: controller.signal,
      })
        .then((payload) => setSuggestions(payload.suggestions))
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }

          setSuggestions([]);
          setError(err instanceof Error ? err.message : "Search is unavailable.");
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, region]);

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    onSelectSuggestion(suggestion);
    setOpen(false);
  }

  return (
    <div className="pointer-events-auto relative">
      <div className="flex h-[52px] items-center gap-3 rounded-lg border border-black/10 bg-white/78 px-3 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition focus-within:-translate-y-0.5 focus-within:bg-white focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-zinc-950/78 dark:focus-within:bg-zinc-950/92">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
          {isLoading && showSuggestions ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </span>
        <input
          value={value}
          onFocus={() => {
            if (blurTimerRef.current) {
              clearTimeout(blurTimerRef.current);
            }

            setOpen(true);
          }}
          onBlur={() => {
            blurTimerRef.current = setTimeout(() => setOpen(false), 140);
          }}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          placeholder="Search places, cafes, hotels..."
          className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-500 dark:text-zinc-50"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="map-search-suggestions"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSuggestions([]);
              setOpen(false);
            }}
            className="rounded-lg p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onResetView}
          className="hidden h-9 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/15 sm:flex"
        >
          <MapPin size={16} />
          {region}
        </button>
      </div>

      {showSuggestions ? (
        <div
          id="map-search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-[60px] z-50 overflow-hidden rounded-lg border border-black/10 bg-white/90 p-2 shadow-[0_24px_70px_rgba(15,23,42,0.24)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/90"
        >
          {error ? (
            <div className="px-3 py-2 text-sm font-medium text-orange-700 dark:text-orange-200">{error}</div>
          ) : null}
          {!error && !isLoading && suggestions.length === 0 ? (
            <div className="px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">No matches found</div>
          ) : null}
          <div className="grid gap-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-zinc-100 dark:hover:bg-white/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                  <SuggestionIcon suggestion={suggestion} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {suggestion.label}
                  </span>
                  {suggestion.subtitle ? (
                    <span className="block truncate text-xs font-medium capitalize text-zinc-500 dark:text-zinc-400">
                      {suggestion.subtitle}
                    </span>
                  ) : null}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                  {suggestion.kind}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SuggestionIcon({ suggestion }: { suggestion: SearchSuggestion }) {
  if (suggestion.kind === "category") {
    return <Tags size={17} style={{ color: suggestion.color }} />;
  }

  if (suggestion.kind === "region" && suggestion.status === "locked") {
    return <Lock size={17} className="text-red-500" />;
  }

  return <MapPin size={17} className="text-emerald-700 dark:text-emerald-300" />;
}
