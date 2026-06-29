import type { Carrier } from "@prisma/client";

export type { Carrier };

export const CARRIER_LABELS: Record<Carrier, string> = {
  USPS: "USPS",
  UPS: "UPS",
  FEDEX: "FedEx",
  PIRATE_SHIP: "Pirate Ship",
  OTHER: "Other",
};

export const CARRIERS = Object.keys(CARRIER_LABELS) as Carrier[];

export const HANDLING_TIMES = [
  "Same Day",
  "1–2 Days",
  "3–5 Days",
  "1 Week",
] as const;

export type HandlingTime = (typeof HANDLING_TIMES)[number];

export const US_STATES = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
  { abbr: "DC", name: "District of Columbia" },
] as const;

export interface ShippingFormState {
  pickupAvailable: boolean;
  shippingAvailable: boolean;
  shippingCost: string;
  shipsFromCity: string;
  shipsFromState: string;
  handlingTime: string;
  preferredCarrier: Carrier | "";
}

export const DEFAULT_SHIPPING_STATE: ShippingFormState = {
  pickupAvailable: false,
  shippingAvailable: false,
  shippingCost: "",
  shipsFromCity: "",
  shipsFromState: "",
  handlingTime: "",
  preferredCarrier: "",
};

export function validateShipping(s: ShippingFormState): string | null {
  if (!s.pickupAvailable && !s.shippingAvailable) return null;
  if (s.shippingAvailable) {
    const cost = parseFloat(s.shippingCost);
    if (s.shippingCost !== "" && (isNaN(cost) || cost < 0))
      return "Shipping cost cannot be negative.";
    if (!s.shipsFromCity.trim()) return "City is required when shipping is enabled.";
    if (!s.shipsFromState) return "State is required when shipping is enabled.";
    if (!s.handlingTime) return "Handling time is required when shipping is enabled.";
    if (!s.preferredCarrier) return "Carrier is required when shipping is enabled.";
  }
  return null;
}

export function shippingPayload(s: ShippingFormState) {
  const cost = s.shippingAvailable && s.shippingCost !== ""
    ? parseFloat(s.shippingCost)
    : null;
  return {
    pickupAvailable: s.pickupAvailable,
    shippingAvailable: s.shippingAvailable,
    shippingCost: cost,
    shipsFromCity: s.shippingAvailable ? s.shipsFromCity.trim() : null,
    shipsFromState: s.shippingAvailable ? s.shipsFromState : null,
    handlingTime: s.shippingAvailable ? s.handlingTime : null,
    preferredCarrier: s.shippingAvailable && s.preferredCarrier ? s.preferredCarrier : null,
  };
}
