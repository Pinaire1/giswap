"use client";

import {
  CARRIERS,
  CARRIER_LABELS,
  HANDLING_TIMES,
  US_STATES,
  type ShippingFormState,
  type Carrier,
} from "@/lib/shipping";

interface Props {
  value: ShippingFormState;
  onChange: (next: ShippingFormState) => void;
}

export default function ShippingSection({ value, onChange }: Props) {
  const set = (patch: Partial<ShippingFormState>) =>
    onChange({ ...value, ...patch });

  const inputClass =
    "w-full p-4 bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition text-sm";
  const labelClass = "block text-xs font-medium mb-1.5 text-gray-400 uppercase tracking-wider";
  const checkboxCard = (
    checked: boolean,
    onClick: () => void,
    icon: string,
    label: string,
    sub: string
  ) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left w-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        checked
          ? "border-blue-600 bg-[#0d0d20]"
          : "border-[#1e2a4a] bg-[#0d0d0d] hover:border-blue-900 hover:bg-[#0d0d18]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked ? "border-blue-600 bg-blue-600" : "border-gray-600 bg-transparent"
        }`}
        aria-hidden="true"
      >
        {checked && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div>
        <p className={`font-semibold text-sm ${checked ? "text-white" : "text-gray-400"}`}>
          {icon} {label}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">{sub}</p>
      </div>
    </button>
  );

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        📦 Delivery Options
      </legend>

      {/* Pickup / Shipping toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checkboxCard(
          value.pickupAvailable,
          () => set({ pickupAvailable: !value.pickupAvailable }),
          "📍",
          "Local Pickup",
          "Buyer meets you in person"
        )}
        {checkboxCard(
          value.shippingAvailable,
          () =>
            set({
              shippingAvailable: !value.shippingAvailable,
              ...(!value.shippingAvailable
                ? {}
                : {
                    shippingCost: "",
                    shipsFromCity: "",
                    shipsFromState: "",
                    handlingTime: "",
                    preferredCarrier: "",
                  }),
            }),
          "🚚",
          "Will Ship",
          "Ship anywhere in the US"
        )}
      </div>

      {/* Shipping detail fields — revealed when Will Ship is checked */}
      {value.shippingAvailable && (
        <div className="rounded-2xl border border-[#1e2a4a] bg-[#0a0a12] p-4 sm:p-5 space-y-4 mt-1">
          {/* Shipping Cost */}
          <div>
            <label htmlFor="shippingCost" className={labelClass}>
              Shipping Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm select-none">
                $
              </span>
              <input
                id="shippingCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={value.shippingCost}
                onChange={(e) => set({ shippingCost: e.target.value })}
                className={`${inputClass} pl-8`}
                aria-label="Shipping cost in dollars"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1.5">Enter 0 for free shipping.</p>
          </div>

          {/* Ships From */}
          <div>
            <p className={`${labelClass} mb-2`}>📍 Ships From</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="shipsFromCity" className="sr-only">City</label>
                <input
                  id="shipsFromCity"
                  type="text"
                  placeholder="City"
                  value={value.shipsFromCity}
                  onChange={(e) => set({ shipsFromCity: e.target.value })}
                  className={inputClass}
                  required={value.shippingAvailable}
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="shipsFromState" className="sr-only">State</label>
                <select
                  id="shipsFromState"
                  value={value.shipsFromState}
                  onChange={(e) => set({ shipsFromState: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                  required={value.shippingAvailable}
                >
                  <option value="">State</option>
                  {US_STATES.map((s) => (
                    <option key={s.abbr} value={s.abbr}>
                      {s.abbr} — {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Handling Time */}
          <div>
            <label htmlFor="handlingTime" className={labelClass}>
              ⏱ Estimated Handling Time
            </label>
            <select
              id="handlingTime"
              value={value.handlingTime}
              onChange={(e) => set({ handlingTime: e.target.value })}
              className={`${inputClass} cursor-pointer`}
              required={value.shippingAvailable}
            >
              <option value="">Select handling time…</option>
              {HANDLING_TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Carrier */}
          <div>
            <p className={`${labelClass} mb-2`}>🚚 Carrier Preference</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CARRIERS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    set({ preferredCarrier: value.preferredCarrier === c ? "" : (c as Carrier) })
                  }
                  aria-pressed={value.preferredCarrier === c}
                  className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    value.preferredCarrier === c
                      ? "border-blue-600 bg-[#0d0d20] text-blue-300"
                      : "border-[#1e2a4a] bg-[#0d0d0d] text-gray-400 hover:border-blue-900 hover:text-gray-200"
                  }`}
                >
                  {CARRIER_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}
