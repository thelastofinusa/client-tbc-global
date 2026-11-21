import { siteConfig } from "~/config/site.config";

export default function Page() {
  return <div className="py-5">{siteConfig.description}</div>;
}
