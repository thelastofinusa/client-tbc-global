import { ServicesHeroComponent } from "./_components/hero";
import { ServiceTime } from "./_components/service-time";
import { WhatToExpect } from "./_components/what-to-expect";

export default function ServicesPage() {
  return (
    <main className="bg-background text-foreground">
      <ServicesHeroComponent />
      <ServiceTime />
      <WhatToExpect />
    </main>
  );
}
