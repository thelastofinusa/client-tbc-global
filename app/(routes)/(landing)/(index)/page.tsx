import { BeliefsComponent } from "./_components/beliefs";
import { HeroComponent } from "./_components/hero";
import { ImpactComponent } from "./_components/impact";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComponent />
      <ImpactComponent />
      <BeliefsComponent />
    </div>
  );
}
