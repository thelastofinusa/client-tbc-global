import { defineQuery } from "next-sanity";
import type { ProjectItem } from "~/lib/projects";
import { sanityQuery } from "../lib/fetch";

/** Everything except `supportersCount`, which comes from the database. */
export type ProjectRow = Omit<ProjectItem, "progress"> & {
  featured: boolean;
  progress: Omit<ProjectItem["progress"], "supportersCount">;
};

const PROJECT_FIELDS = `
  "slug": slug.current,
  "code": coalesce(code, ""),
  title,
  "category": coalesce(category->name, "Outreach"),
  "status": coalesce(status, "Active"),
  "location": coalesce(location, "Kudenda, Kaduna"),
  "timeline": coalesce(timeline, ""),
  "bannerImage": banner.asset->url,
  "bannerAlt": coalesce(banner.alt, title),
  summary,
  "about": coalesce(about, []),
  "purpose": {
    "heading": coalesce(purposeHeading, "Why this initiative matters"),
    "description": coalesce(purposeDescription, ""),
    "objectives": coalesce(objectives, [])
  },
  "progress": {
    "percentage": coalesce(progressPercentage, 0),
    "raisedLabel": coalesce(raisedLabel, ""),
    "goalLabel": coalesce(goalLabel, ""),
    "milestones": coalesce(milestones[]{ label, "completed": coalesce(completed, false) }, [])
  },
  "gallery": coalesce(gallery[defined(image.asset)]{
    "src": image.asset->url,
    "alt": coalesce(alt, caption, ""),
    "caption": coalesce(caption, "")
  }, []),
  "featured": coalesce(featured, false)
`;

const Q_PROJECTS = defineQuery(`
  *[_type == "project" && defined(slug.current)]
    | order(coalesce(order, 999) asc, _createdAt asc) { ${PROJECT_FIELDS} }
`);

export async function fetchProjects(): Promise<ProjectRow[]> {
  return sanityQuery<ProjectRow[]>({ query: Q_PROJECTS, fallback: [] });
}
