/**
 * Display helpers. Content in Sanity is stored as real types (date, datetime,
 * number); these turn them into text for the website. All times are shown in
 * Nigerian time, whatever the server's timezone is.
 */
const LAGOS = "Africa/Lagos";

/** "09:00" → "9:00 AM". Returns "" for empty input. */
export function formatClock(value?: string | null): string {
  if (!value) return "";
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return value;
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours >= 12 ? "PM" : "AM"}`;
}

/** Sanity `datetime` (ISO string) → "9:00 AM" in Nigerian time. */
export function formatClockFromIso(iso?: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: LAGOS,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

/** Sanity `datetime` → "Sun, 29 Nov" in Nigerian time. */
export function formatDay(iso?: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LAGOS,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

/** Sanity `datetime` → "29 Nov 2026". */
export function formatDate(iso?: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LAGOS,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Sanity `date` ("2026-01-15", no time) → "Jan 2026". */
export function formatMonthYear(date?: string | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/** 4200000 → "₦4.2M". Returns "" when there's no amount. */
export function formatNaira(amount?: number | null): string {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/** Two Sanity dates → "Jan 2026 – Dec 2026", "Since Jan 2026" or "Ongoing". */
export function formatTimeline(start?: string | null, end?: string | null) {
  if (start && end) return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
  if (start) return `Since ${formatMonthYear(start)}`;
  if (end) return `Until ${formatMonthYear(end)}`;
  return "Ongoing";
}

const FREQUENCY: Record<string, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  occasional: "Occasional",
};

export function formatFrequency(value?: string | null): string {
  return value ? (FREQUENCY[value] ?? value) : "";
}
