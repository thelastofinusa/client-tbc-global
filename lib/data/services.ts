import type { ScheduleSummary } from "~/lib/schedule";
import { fetchServices, type ServiceRow } from "~/sanity/queries/service.query";
import { fetchAnnouncement } from "~/sanity/queries/settings.query";

export type { ServiceRow };

/** All services from Sanity (weekly + special events). Never throws. */
export async function getServices(): Promise<ServiceRow[]> {
  try {
    return await fetchServices();
  } catch (err) {
    console.error("Could not load services from Sanity:", err);
    return [];
  }
}

export async function getServiceById(id: string): Promise<ServiceRow | null> {
  const services = await getServices();
  return services.find((service) => service.id === id) ?? null;
}

/** One cached read that powers the top bar, hero, menus and footer. */
export async function getScheduleSummary(): Promise<ScheduleSummary> {
  const [services, announcement] = await Promise.all([
    getServices(),
    fetchAnnouncement().catch(() => null),
  ]);

  const weekly = services.filter((s) => s.kind === "weekly" && s.weekday);
  const fullDays = [...new Set(weekly.map((s) => s.weekday as string))];
  const highlight =
    services.find((s) => s.featured) ?? weekly[0] ?? services[0];

  return {
    days: fullDays.map((day) => day.slice(0, 3)),
    fullDays,
    next: highlight
      ? {
          name: highlight.name,
          day: highlight.day,
          time: highlight.time,
          location: highlight.location,
        }
      : null,
    announcement,
  };
}
