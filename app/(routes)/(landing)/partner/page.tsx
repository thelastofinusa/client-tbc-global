import type { Metadata } from "next";
import { navItemsData } from "~/lib/constants";
import { PartnerHeroComponent } from "./_components/hero";
import { Tracks } from "./_components/tracks";

const navItem = navItemsData("/partner");

export const metadata: Metadata = {
  title: navItem?.mobileLabel,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default function PartnerPage() {
  return (
    <main className="bg-background text-foreground">
      <PartnerHeroComponent />
      <Tracks />
    </main>
  );
}
