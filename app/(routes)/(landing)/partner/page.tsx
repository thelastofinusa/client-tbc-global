import { PartnerHeroComponent } from "./_components/hero";
import { Tracks } from "./_components/tracks";

export default function PartnerPage() {
  return (
    <main className="bg-background text-foreground">
      <PartnerHeroComponent />
      <Tracks />
    </main>
  );
}
