import { cacheLife, cacheTag } from "next/cache";
import { readClient } from "./client";

type FetchOptions<T> = {
  query: string;
  params?: Record<string, string | number | boolean>;
  /** Returned (and logged) if Sanity can't be reached, so a Sanity blip never breaks a deploy. */
  fallback: T;
};

/**
 * Cached Sanity read. Uses Next's `use cache` (the app runs with
 * cacheComponents), so pages stay fast and edits show up within minutes.
 */
export async function sanityQuery<T>({
  query,
  params,
  fallback,
}: FetchOptions<T>): Promise<T> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");

  try {
    return await readClient.fetch<T>(query, params ?? {});
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return fallback;
  }
}
