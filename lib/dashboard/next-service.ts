import type { ChurchService } from "./types";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** The weekly service that comes up soonest (by weekday), else the first one. */
export function pickNextService<T extends ChurchService>(
  services: T[],
  now = new Date(),
): T | null {
  const today = now.getDay();
  let best: { service: T; distance: number } | null = null;

  for (const service of services) {
    const index = DAYS.indexOf(service.day.trim().toLowerCase());
    if (index === -1) continue;
    const distance = (index - today + 7) % 7;
    if (!best || distance < best.distance) best = { service, distance };
  }

  return best?.service ?? services[0] ?? null;
}
