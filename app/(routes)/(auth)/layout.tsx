import { Container } from "~/components/shared/container";
import { LogoComponent } from "~/components/shared/logo";

export default function AuthLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <div className="flex flex-1 justify-center overflow-x-clip md:items-center">
      <Container>
        <div className="flex flex-col items-center gap-10 py-20">
          <LogoComponent className="text-[15px]" imgSize={48} />

          <div className="w-full max-w-[384px]">{props.children}</div>
        </div>
      </Container>
    </div>
  );
}
