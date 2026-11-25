import { count, eq } from "drizzle-orm";
import { connection } from "next/server";
import { db, submissions, user } from "~/db";

export interface PublicStats {
  members: number;
  supporters: number;
}

/**
 * Real numbers for the home page. Call from inside a <Suspense> boundary.
 * Falls back to zeros if the database is unreachable so the page still loads.
 */
export async function getPublicStats(): Promise<PublicStats> {
  await connection();

  try {
    const [members] = await db
      .select({ n: count() })
      .from(user)
      .where(eq(user.status, "approved"));
    const [supporters] = await db.select({ n: count() }).from(submissions);

    return { members: members?.n ?? 0, supporters: supporters?.n ?? 0 };
  } catch (err) {
    console.error("Could not load public stats:", err);
    return { members: 0, supporters: 0 };
  }
}
