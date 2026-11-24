import { defineQuery } from "next-sanity";
import type { Q_ALL_FILTERS_RESULT } from "~/sanity.types";
import { sanityQuery } from "../lib/fetch";

const fields = `
  _id,
  name,
  "slug": value.current,
`;

const Q_ALL_FILTERS = defineQuery(`
  *[_type == "projectFilter"] | order(_createdAt asc) {
    ${fields}
  }
`);

export async function fetchAllProjectFilters(): Promise<Q_ALL_FILTERS_RESULT> {
  return sanityQuery<Q_ALL_FILTERS_RESULT>({ query: Q_ALL_FILTERS });
}
