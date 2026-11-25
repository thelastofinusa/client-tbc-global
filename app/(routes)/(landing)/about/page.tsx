import type { Metadata } from "next";
import { navItemsData } from "~/lib/constants";
import { AboutHeroComponent } from "./_components/hero";
import { MissionVision } from "./_components/mission-vision";
import { Practices } from "./_components/practices";
import { Story } from "./_components/story";
import { Values } from "./_components/values";

const navItem = navItemsData("/about");

export const metadata: Metadata = {
  title: navItem?.mobileLabel,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default function Page() {
  return (
    <div className="flex-1 overflow-x-clip">
      <AboutHeroComponent />
      <MissionVision />
      <Story />
      <Values />
      <Practices />
    </div>
  );
}
