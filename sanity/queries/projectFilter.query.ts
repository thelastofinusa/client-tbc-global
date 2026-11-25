import { defineQuery } from "next-sanity";
import { sanityQuery } from "../lib/fetch";

export type ProjectFilterRow = {
  _id: string;
  name: string | null;
  slug: string | null;
};

const Q_ALL_FILTERS = defineQuery(`
  *[_type == "projectFilter"] | order(_createdAt asc) {
    _id,
    name,
    "slug": value.current
  }
`);

export async function fetchAllProjectFilters(): Promise<ProjectFilterRow[]> {
  return sanityQuery<ProjectFilterRow[]>({ query: Q_ALL_FILTERS, fallback: [] });
}
