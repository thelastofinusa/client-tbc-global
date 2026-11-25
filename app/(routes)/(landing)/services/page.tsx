import type { Metadata } from "next";
import { navItemsData } from "~/lib/constants";
import { Expressions } from "./_components/expressions";
import { FindUs } from "./_components/find-us";
import { ServicesHeroComponent } from "./_components/hero";
import { ServiceTime } from "./_components/service-time";

const navItem = navItemsData("/services");

export const metadata: Metadata = {
  title: navItem?.mobileLabel,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default function ServicesPage() {
  return (
    <main className="bg-background text-foreground">
      <ServicesHeroComponent />
      <ServiceTime />
      <Expressions />
      <FindUs />
    </main>
  );
}
