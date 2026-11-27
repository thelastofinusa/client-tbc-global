import { defineQuery } from "next-sanity";
import { sanityQuery } from "../lib/fetch";

export type Announcement = {
  message: string;
  linkLabel: string | null;
  href: string | null;
};

/**
 * `now()` runs on Sanity's side, so an announcement with an expiry drops out
 * by itself. Returns null when it's switched off, empty or expired.
 */
const Q_ANNOUNCEMENT = defineQuery(`
  *[_id == "siteSettings"][0]{
    "announcement": select(
      announcement.enabled == true
        && defined(announcement.message)
        && (!defined(announcement.expiresAt) || announcement.expiresAt > now())
        => announcement{ message, linkLabel, href }
    )
  }.announcement
`);

export async function fetchAnnouncement(): Promise<Announcement | null> {
  return sanityQuery<Announcement | null>({
    query: Q_ANNOUNCEMENT,
    fallback: null,
  });
}
