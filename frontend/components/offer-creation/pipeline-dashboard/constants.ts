import { OfferStatus } from "./types";

export const STATUS_OPTIONS: { label: string; value: OfferStatus }[] = [
  { label: "Draft", value: "Draft" },
  { label: "Pending Approval", value: "Pending Approval" },
  { label: "Published", value: "Published" },
  { label: "Closed / Closure", value: "Closed / Closure" },
  { label: "Cancelled", value: "Cancelled" },
];

export const PRIMARY_GREEN = "#0C7A43";
export const BACKGROUND_COLOR = "#F5F7FA";
export const BORDER_COLOR = "#E5E7EB";
export const TEXT_DARK = "#111827";
export const TEXT_MUTED = "#6B7280";
