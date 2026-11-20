import { siteConfig } from "~/config/site.config";

export default function HomePage() {
  return (
    <div className="py-10">
      <p>{siteConfig.description}</p>
    </div>
  );
}
