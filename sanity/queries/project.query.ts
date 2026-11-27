import { defineQuery } from "next-sanity";
import { formatNaira, formatTimeline } from "~/lib/format";
import type { ProjectItem } from "~/lib/projects";
import { sanityQuery } from "../lib/fetch";

type ProjectDoc = {
  slug: string;
  code: string;
  title: string;
  category: string;
  status: ProjectItem["status"];
  location: string;
  startDate: string | null;
  endDate: string | null;
  bannerImage: string | null;
  bannerThumb: string | null;
  bannerAlt: string;
  summary: string;
  about: string[];
  purpose: ProjectItem["purpose"];
  progress: {
    percentage: number;
    amountRaised: number | null;
    fundingGoal: number | null;
    milestones: ProjectItem["progress"]["milestones"];
  };
  gallery: ProjectItem["gallery"];
  featured: boolean;
};

/** Everything except `supportersCount`, which comes from the database. */
export type ProjectRow = Omit<ProjectItem, "progress"> & {
  featured: boolean;
  progress: Omit<ProjectItem["progress"], "supportersCount">;
};

const Q_PROJECTS = defineQuery(`
  *[_type == "project" && defined(slug.current)]
    | order(coalesce(order, 999) asc, _createdAt asc) {
    "slug": slug.current,
    "code": coalesce(code, ""),
    title,
    "category": coalesce(category->name, "Outreach"),
    "status": coalesce(status, "Active"),
    "location": coalesce(location, "Kudenda, Kaduna"),
    startDate,
    endDate,
    "bannerImage": banner.asset->url + "?w=1600&auto=format&q=75",
    "bannerThumb": banner.asset->url + "?w=240&h=240&fit=crop&auto=format&q=70",
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
      "amountRaised": amountRaised,
      "fundingGoal": fundingGoal,
      "milestones": coalesce(milestones[]{ label, "completed": coalesce(completed, false) }, [])
    },
    "gallery": coalesce(gallery[defined(image.asset)]{
      "src": image.asset->url + "?w=1000&auto=format&q=75",
      "alt": coalesce(alt, caption, ""),
      "caption": coalesce(caption, "")
    }, []),
    "featured": coalesce(featured, false)
  }
`);

export async function fetchProjects(): Promise<ProjectRow[]> {
  const docs = await sanityQuery<ProjectDoc[]>({
    query: Q_PROJECTS,
    fallback: [],
  });

  return docs.map(
    ({ startDate, endDate, bannerImage, bannerThumb, progress, ...rest }) => ({
      ...rest,
      timeline: formatTimeline(startDate, endDate),
      bannerImage: bannerImage ?? "",
      bannerThumb: bannerThumb ?? "",
      progress: {
        percentage: progress.percentage,
        raisedLabel: formatNaira(progress.amountRaised),
        goalLabel: formatNaira(progress.fundingGoal),
        milestones: progress.milestones,
      },
    }),
  );
}
