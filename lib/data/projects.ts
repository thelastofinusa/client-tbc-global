import { and, count, eq, isNotNull, ne } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, submissions } from "~/db";
import type { ProjectItem } from "~/lib/projects";
import { fetchProjects } from "~/sanity/queries/project.query";

/**
 * Sponsor requests per project slug. Cached for a minute (and refreshed the
 * moment someone submits one), so project pages stay static and fast.
 * Never throws: a database hiccup must not break a page.
 */
async function getSponsorCounts(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("public-stats");

  try {
    const rows = await db
      .select({ slug: submissions.projectSlug, n: count() })
      .from(submissions)
      .where(
        and(
          eq(submissions.type, "sponsor"),
          ne(submissions.status, "declined"),
          isNotNull(submissions.projectSlug),
        ),
      )
      .groupBy(submissions.projectSlug);

    return Object.fromEntries(rows.map((row) => [row.slug ?? "", row.n]));
  } catch (err) {
    console.error("Could not load sponsor counts:", err);
    return {};
  }
}

export type ProjectWithFlags = ProjectItem & { featured: boolean };

/** Projects from Sanity plus sponsor counts from Neon. */
export async function getProjects(): Promise<ProjectWithFlags[]> {
  const [rows, counts] = await Promise.all([
    fetchProjects(),
    getSponsorCounts(),
  ]);

  return rows.map((row) => ({
    ...row,
    progress: {
      ...row.progress,
      supportersCount: counts[row.slug] ?? 0,
    },
  }));
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectWithFlags | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getFeaturedProject(): Promise<
  ProjectWithFlags | undefined
> {
  const projects = await getProjects();
  return projects.find((project) => project.featured);
}
