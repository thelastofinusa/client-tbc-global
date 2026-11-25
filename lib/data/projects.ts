import { and, count, eq, isNotNull } from "drizzle-orm";
import { connection } from "next/server";
import { db, submissions } from "~/db";
import type { ProjectItem } from "~/lib/projects";
import { fetchProjects } from "~/sanity/queries/project.query";

/** Sponsor requests per project slug. Never throws: the site must still render. */
async function getSponsorCounts(): Promise<Record<string, number>> {
  try {
    const rows = await db
      .select({ slug: submissions.projectSlug, n: count() })
      .from(submissions)
      .where(
        and(eq(submissions.type, "sponsor"), isNotNull(submissions.projectSlug)),
      )
      .groupBy(submissions.projectSlug);

    return Object.fromEntries(rows.map((row) => [row.slug ?? "", row.n]));
  } catch (err) {
    console.error("Could not load sponsor counts:", err);
    return {};
  }
}

export type ProjectWithFlags = ProjectItem & { featured: boolean };

/**
 * Projects from Sanity plus sponsor counts from Neon.
 * Call from inside a <Suspense> boundary (it reads live data).
 */
export async function getProjects(): Promise<ProjectWithFlags[]> {
  await connection();

  let rows: Awaited<ReturnType<typeof fetchProjects>> = [];
  try {
    rows = await fetchProjects();
  } catch (err) {
    console.error("Could not load projects from Sanity:", err);
  }

  const counts = await getSponsorCounts();

  return rows.map((row) => ({
    ...row,
    bannerImage: row.bannerImage ?? "",
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
  return projects.find((project) => project.featured) ?? projects[0];
}
