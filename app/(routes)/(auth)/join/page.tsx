import Link from "next/link";
import { Container } from "~/components/shared/container";

export default function Page() {
  return (
    <section className="flex-1 overflow-x-clip py-6">
      <Container size="sm" className="flex flex-col gap-8">
        <p className="ml-auto font-serif text-[13px] font-medium tracking-wide">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-bold underline underline-offset-2"
          >
            Login
          </Link>
        </p>
      </Container>
    </section>
  );
}
