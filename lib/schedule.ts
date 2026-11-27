import type { Announcement } from "~/sanity/queries/settings.query";

/** What the header, hero, footer and menus need to know about the schedule. */
export interface ScheduleSummary {
  /** Short names of the weekly gathering days, e.g. ["Wed", "Sat", "Sun"]. */
  days: string[];
  /** Full names, e.g. ["Wednesday", "Saturday", "Sunday"]. */
  fullDays: string[];
  /** The highlighted (or first) service. */
  next: {
    name: string;
    day: string;
    time: string;
    location: string;
  } | null;
  announcement: Announcement | null;
}

export const emptySchedule: ScheduleSummary = {
  days: [],
  fullDays: [],
  next: null,
  announcement: null,
};

/** ["Wednesday", "Saturday", "Sunday"] → "Wednesday, Saturday and Sunday" */
export function joinDays(days: string[]): string {
  if (days.length <= 1) return days[0] ?? "";
  return `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]}`;
}
