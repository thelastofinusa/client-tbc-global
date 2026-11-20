import { Container } from "~/components/shared/container";
import { Header } from "~/components/shared/header";

export default function LandingLayout(props: LayoutProps<"/">) {
  return (
    <div>
      <Header />
      <Container>{props.children}</Container>
    </div>
  );
}
