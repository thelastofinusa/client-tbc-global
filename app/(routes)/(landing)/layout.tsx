import { Container } from "~/components/shared/container";

export default function LandingLayout(props: LayoutProps<"/">) {
  return (
    <div>
      <Container>{props.children}</Container>
    </div>
  );
}
