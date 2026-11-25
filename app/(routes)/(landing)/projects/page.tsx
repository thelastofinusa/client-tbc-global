import type { Metadata } from "next";
import { navItemsData } from "~/lib/constants";
import { Callout } from "./_components/callout";
import { Filters } from "./_components/filters";
import { ProjectsHeroComponent } from "./_components/hero";

const navItem = navItemsData("/projects");

export const metadata: Metadata = {
  title: navItem?.mobileLabel,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default function ProjectsPage() {
  return (
    <main className="bg-background text-foreground">
      <ProjectsHeroComponent />
      <Filters />
      <Callout />
    </main>
  );
}
