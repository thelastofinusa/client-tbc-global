import type { Metadata } from "next";
import { navItemsData } from "~/lib/constants";
import { fetchProjects } from "~/sanity/queries/project.query";
import { PartnerHeroComponent } from "./_components/hero";
import { Tracks } from "./_components/tracks";

const navItem = navItemsData("/partner");

export const metadata: Metadata = {
  title: navItem?.mobileLabel,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default async function PartnerPage() {
  const projects = await fetchProjects();

  return (
    <main className="bg-background text-foreground">
      <PartnerHeroComponent />
      <Tracks projects={projects.map(({ slug, title }) => ({ slug, title }))} />
    </main>
  );
}
