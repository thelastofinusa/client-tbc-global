import { defineQuery } from "next-sanity";
import { sanityQuery } from "../lib/fetch";

export type ExpressionRow = {
  _id: string;
  title: string;
  slug: string | null;
  tagline: string;
  description: string | null;
  schedule: string | null;
  image: string | null;
  imageAlt: string;
};

const Q_EXPRESSIONS = defineQuery(`
  *[_type == "expression"] | order(coalesce(order, 999) asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    description,
    schedule,
    "image": image.asset->url,
    "imageAlt": coalesce(image.alt, title)
  }
`);

export async function fetchExpressions(): Promise<ExpressionRow[]> {
  return sanityQuery<ExpressionRow[]>({ query: Q_EXPRESSIONS, fallback: [] });
}
