import { BeliefsComponent } from "./_components/beliefs";
import { HomeHeroComponent } from "./_components/hero";
import { ImpactComponent } from "./_components/impact";
import { InvolvedComponent } from "./_components/involved";
import { ProjectsComponent } from "./_components/projects";
import { ServicesComponent } from "./_components/services";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HomeHeroComponent />
      <ImpactComponent />
      <BeliefsComponent />
      <ServicesComponent />
      <ProjectsComponent />
      <InvolvedComponent />
    </div>
  );
}
