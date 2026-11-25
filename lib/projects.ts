/**
 * Shapes for projects. The content itself lives in Sanity (see
 * sanity/schemas/project.schema.ts); sponsor counts come from Neon.
 * Fetch with getProjects() / getProjectBySlug() in ~/lib/data/projects.
 */

/** "All" plus the names of your Project Filters in Sanity. */
export type ProjectCategory = string;

export interface ProjectMilestone {
  label: string;
  completed: boolean;
}

export interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectItem {
  slug: string;
  code: string;
  title: string;
  category: string;
  status: "Active" | "In Progress" | "Ongoing" | "Completed";
  location: string;
  timeline: string;
  /** Empty string when no banner image has been uploaded yet. */
  bannerImage: string;
  bannerAlt: string;
  summary: string;
  about: string[];
  purpose: {
    heading: string;
    description: string;
    objectives: string[];
  };
  progress: {
    percentage: number;
    raisedLabel: string;
    goalLabel: string;
    supportersCount: number;
    milestones: ProjectMilestone[];
  };
  gallery: ProjectGalleryItem[];
}
