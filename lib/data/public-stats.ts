import { and, count, eq, ne } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, submissions, user } from "~/db";

export interface PublicStats {
  members: number;
  sponsors: number;
  partners: number;
}

/**
 * The three numbers on the home page. Cached for a minute and refreshed as
 * soon as a new request comes in, so the home page stays static and fast.
 * Falls back to zeros if the database is unreachable.
 */
export async function getPublicStats(): Promise<PublicStats> {
  "use cache";
  cacheLife("minutes");
  cacheTag("public-stats");

  try {
    const countType = (type: "sponsor" | "partner") =>
      db
        .select({ n: count() })
        .from(submissions)
        .where(and(eq(submissions.type, type), ne(submissions.status, "declined")));

    const [[members], [sponsors], [partners]] = await Promise.all([
      db.select({ n: count() }).from(user).where(eq(user.status, "approved")),
      countType("sponsor"),
      countType("partner"),
    ]);

    return {
      members: members?.n ?? 0,
      sponsors: sponsors?.n ?? 0,
      partners: partners?.n ?? 0,
    };
  } catch (err) {
    console.error("Could not load public stats:", err);
    return { members: 0, sponsors: 0, partners: 0 };
  }
}
