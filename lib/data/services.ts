import { fetchServices, type ServiceRow } from "~/sanity/queries/service.query";

export type { ServiceRow };

/** All services from Sanity (weekly + special events). */
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
