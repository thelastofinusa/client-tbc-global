import { AboutHeroComponent } from "./_components/hero";
import { MissionVision } from "./_components/mission-vision";
import { Practices } from "./_components/practices";
import { Story } from "./_components/story";
import { Values } from "./_components/values";

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
