import { Callout } from "./_components/callout";
import { Filters } from "./_components/filters";
import { ProjectsHeroComponent } from "./_components/hero";

export default function ProjectsPage() {
  return (
    <main className="bg-background text-foreground">
      <ProjectsHeroComponent />
      <Filters />
      <Callout />
    </main>
  );
}
