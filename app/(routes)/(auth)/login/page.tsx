import Link from "next/link";
import { Container } from "~/components/shared/container";

export default function Page() {
  return (
    <section className="flex-1 overflow-x-clip py-6">
      <Container size="sm" className="flex flex-col gap-8">
        <p className="ml-auto font-serif text-[13px] font-medium tracking-wide">
          New to the Family?{" "}
          <Link
            href="/join"
            className="text-primary font-bold underline underline-offset-2"
          >
            Join us
          </Link>
        </p>
      </Container>
    </section>
  );
}
