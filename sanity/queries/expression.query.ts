import { defineQuery } from "next-sanity";
import { formatDate, formatFrequency } from "~/lib/format";
import { sanityQuery } from "../lib/fetch";

type ExpressionDoc = {
  _id: string;
  title: string;
  slug: string | null;
  tagline: string;
  description: string | null;
  frequency: string | null;
  nextGatheringAt: string | null;
  image: string | null;
  imageAlt: string;
};

export type ExpressionRow = Omit<
  ExpressionDoc,
  "frequency" | "nextGatheringAt"
> & {
  /** e.g. "Weekly" or "Weekly · Next: 6 Dec 2026". */
  schedule: string | null;
};

const Q_EXPRESSIONS = defineQuery(`
  *[_type == "expression" && defined(slug.current)]
    | order(coalesce(order, 999) asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    description,
    frequency,
    nextGatheringAt,
    "image": image.asset->url + "?w=900&auto=format&q=75",
    "imageAlt": coalesce(image.alt, title)
  }
`);

export async function fetchExpressions(): Promise<ExpressionRow[]> {
  const docs = await sanityQuery<ExpressionDoc[]>({
    query: Q_EXPRESSIONS,
    fallback: [],
  });

  return docs.map(({ frequency, nextGatheringAt, ...rest }) => {
    const parts = [
      formatFrequency(frequency),
      nextGatheringAt ? `Next: ${formatDate(nextGatheringAt)}` : "",
    ].filter(Boolean);
    return { ...rest, schedule: parts.length ? parts.join(" · ") : null };
  });
}
