import type { Metadata } from "next";
import { Suspense } from "react";
import { navItemsData } from "~/lib/constants";
import { getProjects } from "~/lib/data/projects";
import { fetchAllProjectFilters } from "~/sanity/queries/projectFilter.query";
import { Callout } from "./_components/callout";
import { Filters } from "./_components/filters";
import { ProjectsHeroComponent } from "./_components/hero";

const navItem = navItemsData("/projects");

export const metadata: Metadata = {
  title: navItem?.mobileLabel,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

async function ProjectsList() {
  const [projects, filters] = await Promise.all([
    getProjects(),
    fetchAllProjectFilters().catch(() => []),
  ]);

  return (
    <Filters
      projects={projects}
      categories={filters.map((f) => f.name).filter((n): n is string => !!n)}
    />
  );
}

export default function ProjectsPage() {
  return (
    <main className="bg-background text-foreground">
      <ProjectsHeroComponent />
      <Suspense fallback={<div className="min-h-96" />}>
        <ProjectsList />
      </Suspense>
      <Callout />
    </main>
  );
}
