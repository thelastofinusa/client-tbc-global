import { defineQuery } from "next-sanity";
import type { ChurchService } from "~/lib/dashboard/types";
import { sanityQuery } from "../lib/fetch";

export type ServiceRow = ChurchService & {
  description: string | null;
  featured: boolean;
};

const Q_SERVICES = defineQuery(`
  *[_type == "service"] | order(coalesce(order, 999) asc, _createdAt asc) {
    "id": slug.current,
    name,
    "kind": coalesce(kind, "weekly"),
    day,
    time,
    "location": coalesce(location, "Kudenda, Kaduna"),
    "expected": coalesce(expected, 0),
    description,
    "featured": coalesce(featured, false)
  }
`);

export async function fetchServices(): Promise<ServiceRow[]> {
  const rows = await sanityQuery<ServiceRow[]>({
    query: Q_SERVICES,
    fallback: [],
  });
  return rows.filter((row) => Boolean(row.id));
}
