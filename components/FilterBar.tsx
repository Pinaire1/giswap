"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";
import {
  LISTING_BRANDS,
  LISTING_CONDITIONS,
  LISTING_SIZES,
} from "@/lib/listing-constants";
import {
  applyListingSearchUpdates,
  listingsBrowsePath,
} from "@/lib/listings-search";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const DEBOUNCE_MS = 300;

export default function FilterBar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? "";

  const urlQ = get("q");
  const urlMin = get("minPrice");
  const urlMax = get("maxPrice");

  const [query, setQuery] = useState(urlQ);
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const debouncedMinPrice = useDebouncedValue(minPrice, DEBOUNCE_MS);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, DEBOUNCE_MS);

  const paramsKey = searchParams.toString();
  const [prevParamsKey, setPrevParamsKey] = useState(paramsKey);
  if (paramsKey !== prevParamsKey) {
    setPrevParamsKey(paramsKey);
    const inputsSynced =
      query === debouncedQuery &&
      minPrice === debouncedMinPrice &&
      maxPrice === debouncedMaxPrice;
    if (inputsSynced) {
      setQuery(urlQ);
      setMinPrice(urlMin);
      setMaxPrice(urlMax);
    }
  }

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(listingsBrowsePath(params), { scroll: false });
      });
    },
    [router],
  );

  const update = useCallback(
    (updates: Record<string, string>, options?: { resetPage?: boolean }) => {
      const params = applyListingSearchUpdates(searchParams, updates, options);
      pushParams(params);
    },
    [searchParams, pushParams],
  );

  // Debounced URL updates for text/price fields
  useEffect(() => {
    if (
      debouncedQuery === urlQ &&
      debouncedMinPrice === urlMin &&
      debouncedMaxPrice === urlMax
    ) {
      return;
    }
    update({
      q: debouncedQuery,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
    });
  }, [debouncedQuery, debouncedMinPrice, debouncedMaxPrice, urlQ, urlMin, urlMax, update]);

  const toggle = (key: string, value: string) => {
    update({ [key]: get(key) === value ? "" : value });
  };

  const clearAll = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters =
    get("q") ||
    get("size") ||
    get("condition") ||
    get("brand") ||
    get("minPrice") ||
    get("maxPrice");

  const isDebouncing =
    query !== debouncedQuery ||
    minPrice !== debouncedMinPrice ||
    maxPrice !== debouncedMaxPrice;

  const isLoading = isPending || isDebouncing;

  const chipBase =
    "px-3 py-2 min-h-[36px] rounded-xl text-xs font-medium border transition-all cursor-pointer select-none";
  const chipOff =
    "border-[#1e2a4a] text-gray-500 hover:border-blue-700 hover:text-blue-300 bg-transparent";
  const chipOn = "border-blue-600 text-blue-300 bg-blue-950/50";

  return (
    <div
      className={`space-y-4 mb-8 transition-opacity ${isPending ? "opacity-70" : ""}`}
      aria-busy={isLoading}
    >
      {/* Search + price row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            aria-hidden
          />
          <input
            type="search"
            name="q"
            placeholder="Search by title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search listings by title"
            className="w-full pl-10 pr-10 p-3 bg-[#111] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="number"
            name="minPrice"
            placeholder="Min $"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            aria-label="Minimum price"
            className="flex-1 min-w-0 sm:w-24 sm:flex-none p-3 bg-[#111] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition text-sm"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max $"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Maximum price"
            className="flex-1 min-w-0 sm:w-24 sm:flex-none p-3 bg-[#111] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition text-sm"
          />
        </div>
      </div>

      {/* Size chips */}
      <div>
        <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Size</p>
        <div className="flex flex-wrap gap-2">
          {LISTING_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle("size", s)}
              aria-pressed={get("size") === s}
              className={`${chipBase} ${get("size") === s ? chipOn : chipOff}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Condition chips */}
      <div>
        <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Condition</p>
        <div className="flex flex-wrap gap-2">
          {LISTING_CONDITIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggle("condition", c)}
              aria-pressed={get("condition") === c}
              className={`${chipBase} ${get("condition") === c ? chipOn : chipOff}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Brand chips */}
      <div>
        <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Brand</p>
        <div className="flex flex-wrap gap-2">
          {LISTING_BRANDS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => toggle("brand", b)}
              aria-pressed={get("brand") === b}
              className={`${chipBase} ${get("brand") === b ? chipOn : chipOff}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + clear */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          {isLoading && (
            <Loader2 size={14} className="animate-spin text-blue-400" aria-hidden />
          )}
          <span>
            {isLoading
              ? "Searching…"
              : `${total} gi${total !== 1 ? "s" : ""} found`}
          </span>
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-white transition underline underline-offset-2"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
