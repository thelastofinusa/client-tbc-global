import { defineQuery } from "next-sanity";
import type { ChurchService } from "~/lib/dashboard/types";
import { formatClock, formatClockFromIso, formatDay } from "~/lib/format";
import { sanityQuery } from "../lib/fetch";

type ServiceDoc = {
  id: string | null;
  name: string;
  kind: "weekly" | "special";
  weekday: string | null;
  startTime: string | null;
  endTime: string | null;
  startsAt: string | null;
  location: string;
  expected: number;
  description: string | null;
  featured: boolean;
};

/** A service ready to display: `day` and `time` are already formatted. */
export type ServiceRow = ChurchService & {
  description: string | null;
  featured: boolean;
  /** "Sunday" for weekly services, null for one-off events. */
  weekday: string | null;
};

const Q_SERVICES = defineQuery(`
  *[_type == "service" && defined(slug.current)]
    | order(coalesce(order, 999) asc, _createdAt asc) {
    "id": slug.current,
    name,
    "kind": coalesce(kind, "weekly"),
    weekday,
    startTime,
    endTime,
    startsAt,
    "location": coalesce(location, "Kudenda, Kaduna"),
    "expected": coalesce(expected, 0),
    description,
    "featured": coalesce(featured, false)
  }
`);

function toRow(doc: ServiceDoc): ServiceRow {
  const weekly = doc.kind === "weekly";
  const start = weekly
    ? formatClock(doc.startTime)
    : formatClockFromIso(doc.startsAt);
  const end = weekly ? formatClock(doc.endTime) : "";

  return {
    id: doc.id ?? "",
    name: doc.name,
    kind: doc.kind,
    weekday: weekly ? doc.weekday : null,
    day: weekly ? (doc.weekday ?? "") : formatDay(doc.startsAt),
    time: [start, end].filter(Boolean).join(" – ") || "To be confirmed",
    location: doc.location,
    expected: doc.expected,
    description: doc.description,
    featured: doc.featured,
  };
}

export async function fetchServices(): Promise<ServiceRow[]> {
  const docs = await sanityQuery<ServiceDoc[]>({
    query: Q_SERVICES,
    fallback: [],
  });
  return docs.filter((doc) => Boolean(doc.id)).map(toRow);
}
