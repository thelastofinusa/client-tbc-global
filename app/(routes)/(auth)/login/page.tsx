import { Container } from "~/components/shared/container";
import { siteConfig } from "~/config/site.config";

export default function Page() {
  return (
    <div className="py-5">
      <Container>
        <p className="text-sm">{siteConfig.description}</p>
      </Container>
    </div>
  );
}
