export const GI_SIZES = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"] as const;

export const COMMON_BRANDS = [
  "Shoyoroll",
  "Tatami",
  "Kingz",
  "Scramble",
  "Hyperfly",
  "Fuji",
  "Venum",
  "Sanabul",
  "Flow",
  "Gameness",
] as const;

export const GI_CONDITIONS = [
  { label: "New", accent: "border-blue-600 text-blue-300" },
  { label: "Like New", accent: "border-purple-600 text-purple-300" },
  { label: "Good", accent: "border-amber-700 text-amber-400" },
  { label: "Worn", accent: "border-zinc-500 text-zinc-400" },
] as const;

export const CONDITION_COLORS: Record<string, string> = {
  New: "bg-blue-950 text-blue-300 border-blue-800",
  "Like New": "bg-purple-950 text-purple-300 border-purple-800",
  Good: "bg-amber-950 text-amber-400 border-amber-800",
  Worn: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

/** Semi-transparent variants for condition badges overlaid on listing card images. */
export const CONDITION_OVERLAY_COLORS: Record<string, string> = {
  New: "bg-blue-950/80 text-blue-300 border-blue-800",
  "Like New": "bg-purple-950/80 text-purple-300 border-purple-800",
  Good: "bg-amber-950/80 text-amber-400 border-amber-800",
  Worn: "bg-zinc-800/80 text-zinc-400 border-zinc-700",
};

export const REPORT_STATUSES = ["pending", "reviewed", "dismissed"] as const;

export const REPORT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-950 text-amber-400 border-amber-800",
  reviewed: "bg-blue-950 text-blue-400 border-blue-800",
  dismissed: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export const VALID_SIZES: readonly string[] = GI_SIZES;
export const VALID_CONDITIONS: readonly string[] = GI_CONDITIONS.map((c) => c.label);

export const REPORT_REASONS = [
  "Counterfeit / fake gi",
  "Misleading description",
  "Wrong photos",
  "Spam or duplicate listing",
  "Offensive content",
  "Other",
] as const;
