import { BeliefsComponent } from "./_components/beliefs";
import { HomeHeroComponent } from "./_components/hero";
import { ImpactComponent } from "./_components/impact";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HomeHeroComponent />
      <ImpactComponent />
      <BeliefsComponent />
      <div className="py-16"></div>
    </div>
  );
}
