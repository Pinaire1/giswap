"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

const SIZES = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"];
const CONDITIONS = ["New", "Like New", "Good", "Worn"];
const BRANDS = [
  "Shoyoroll", "Tatami", "Kingz", "Scramble", "Hyperfly",
  "Fuji", "Venum", "Sanabul", "Flow", "Gameness",
];

const OTHER_BRAND_VALUE = "other";

export default function FilterBar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? "";

  const update = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // reset pagination on filter change
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams],
  );

  const toggle = (key: string, value: string) => {
    update({ [key]: get(key) === value ? "" : value });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters =
    get("q") || get("size") || get("condition") || get("brand") ||
    get("minPrice") || get("maxPrice");

  const chipBase =
    "px-3 py-2 min-h-[36px] rounded-xl text-xs font-medium border transition-all cursor-pointer select-none";
  const chipOff = "border-[#1e2a4a] text-gray-500 hover:border-blue-700 hover:text-blue-300 bg-transparent";
  const chipOn  = "border-blue-600 text-blue-300 bg-blue-950/50";

  return (
    <div className={`space-y-4 mb-8 transition-opacity ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* Search + price row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search brand or title…"
          defaultValue={get("q")}
          onChange={(e) => update({ q: e.target.value })}
          className="flex-1 p-3 bg-[#111] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition text-sm"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="number"
            placeholder="Min $"
            defaultValue={get("minPrice")}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="flex-1 min-w-0 sm:w-24 sm:flex-none p-3 bg-[#111] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition text-sm"
          />
          <input
            type="number"
            placeholder="Max $"
            defaultValue={get("maxPrice")}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="flex-1 min-w-0 sm:w-24 sm:flex-none p-3 bg-[#111] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition text-sm"
          />
        </div>
      </div>

      {/* Size chips */}
      <div>
        <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle("size", s)}
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
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => toggle("condition", c)}
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
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => toggle("brand", b)}
              className={`${chipBase} ${get("brand") === b ? chipOn : chipOff}`}
            >
              {b}
            </button>
          ))}
          <button
            onClick={() => toggle("brand", OTHER_BRAND_VALUE)}
            className={`${chipBase} ${get("brand") === OTHER_BRAND_VALUE ? chipOn : chipOff}`}
          >
            Other
          </button>
        </div>
      </div>

      {/* Results count + clear */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-sm text-gray-600">
          {isPending ? "Filtering…" : `${total} gi${total !== 1 ? "s" : ""} found`}
        </p>
        {hasFilters && (
          <button
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
