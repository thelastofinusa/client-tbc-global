import { Container } from "~/components/shared/container";
import { siteConfig } from "~/config/site.config";

export default function HomePage() {
  return (
    <div className="py-6">
      <Container>{siteConfig.description}</Container>
    </div>
  );
}
